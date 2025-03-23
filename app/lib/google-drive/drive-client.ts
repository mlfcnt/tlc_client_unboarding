import {google} from "googleapis";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {Readable} from "stream";

// Declare the global cache for TypeScript
declare global {
  var DRIVE_FOLDER_CACHE: Record<string, string>;
}

// Initialize a global folder cache to prevent duplicate folder creation
if (typeof global.DRIVE_FOLDER_CACHE === "undefined") {
  global.DRIVE_FOLDER_CACHE = {};
}

/**
 * Initialize the Google Drive client
 */
function getDriveClient() {
  try {
    // Get required environment variables
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    // Validate configuration
    if (!email || !rawPrivateKey || !projectId) {
      throw new Error(
        "Missing required Google Drive configuration. Check your environment variables."
      );
    }

    // Replace \n with actual newlines in the private key
    const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

    // Create auth client with credential object
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: projectId,
        private_key: privateKey,
        client_email: email,
      },
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    // Create and return drive client
    return google.drive({version: "v3", auth});
  } catch (error) {
    console.error("Failed to initialize Google Drive client:", error);
    throw error;
  }
}

/**
 * Get folder ID from cache if it exists
 */
function getFolderFromCache(userId: string): string | null {
  const cacheKey = `folder_${userId}`;
  return global.DRIVE_FOLDER_CACHE[cacheKey] || null;
}

/**
 * Store folder ID in cache
 */
function storeFolderInCache(userId: string, folderId: string): void {
  const cacheKey = `folder_${userId}`;
  global.DRIVE_FOLDER_CACHE[cacheKey] = folderId;
}

/**
 * Create a folder for a user if it doesn't exist already
 * The folder name follows the format: firstname_lastname_id
 */
export const createUserFolderIfNotExists = async (
  user: OnboardingRequest
): Promise<string> => {
  try {
    // Check cache first for faster lookup
    const cachedFolderId = getFolderFromCache(user.id);
    if (cachedFolderId) {
      return cachedFolderId;
    }

    const drive = getDriveClient();
    const userId = user.id;
    const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

    if (!parentFolderId) {
      throw new Error(
        "GOOGLE_DRIVE_PARENT_FOLDER_ID environment variable is not set"
      );
    }

    // First check if we already stored this folder ID in the database
    try {
      const {supabase} = await import("@/lib/supabase");
      const {DATABASE_TABLES} = await import("@/app/constants/databaseTables");

      const {data} = await supabase
        .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
        .select("drive_folder_id")
        .eq("id", userId)
        .single();

      if (data?.drive_folder_id) {
        storeFolderInCache(userId, data.drive_folder_id);
        return data.drive_folder_id;
      }
    } catch (dbError) {
      console.error("Error fetching drive folder information:", dbError);
      // Continue with Google Drive API lookup
    }

    // Check if folder already exists in Google Drive
    const exactIdQuery = `name contains '${userId}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`;

    const response = await drive.files.list({
      q: exactIdQuery,
      fields: "files(id, name)",
      pageSize: 100,
    });

    const existingFolders = response.data.files;

    // If folder exists, use it
    if (existingFolders && existingFolders.length > 0) {
      // Sort folders by name to get consistent results
      existingFolders.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

      const folderId = existingFolders[0].id!;
      storeFolderInCache(userId, folderId);
      return folderId;
    }

    // Create a new folder
    const firstName = (user.first_name || "")
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "");
    const lastName = (user.last_name || "").trim().replace(/[^a-zA-Z0-9]/g, "");
    const folderName = `${firstName}_${lastName}_${userId}`;

    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
      description: `Documents for ${user.first_name} ${user.last_name}`,
    };

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: "id, name",
    });

    storeFolderInCache(userId, folder.data.id!);
    return folder.data.id!;
  } catch (error) {
    console.error("Error finding/creating user folder:", error);
    throw error;
  }
};

/**
 * Upload a file to the user's folder in Google Drive
 * If the user folder doesn't exist, it will be created
 */
export const uploadFileToDrive = async (
  user: OnboardingRequest,
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<string> => {
  try {
    const drive = getDriveClient();

    // Get or create user folder
    const folderId = await createUserFolderIfNotExists(user);

    // Prepare file metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    // Create a readable stream from the buffer
    const bufferStream = new Readable();
    bufferStream.push(fileBuffer);
    bufferStream.push(null); // Mark end of stream

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType,
        body: bufferStream,
      },
      fields: "id,webViewLink",
    });

    return response.data.webViewLink!;
  } catch (error) {
    console.error("Error uploading file to Drive:", error);
    throw error;
  }
};

/**
 * List all files in a user's folder
 */
export const listUserFiles = async (
  user: OnboardingRequest
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> => {
  try {
    const drive = getDriveClient();

    // Get user folder ID
    const folderId = await createUserFolderIfNotExists(user);

    const response = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: "files(id, name, webViewLink, mimeType, createdTime)",
    });

    return response.data.files || [];
  } catch (error) {
    console.error("Error listing user files:", error);
    throw error;
  }
};
