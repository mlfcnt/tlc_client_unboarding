import {google} from "googleapis";
import {GoogleAuth} from "google-auth-library";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";

// Initialize the Google Drive client
const initializeDriveClient = async (): Promise<any> => {
  try {
    const auth = new GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
          /\\n/g,
          "\n"
        ),
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      },
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    const client = await auth.getClient();
    return google.drive({version: "v3", auth: client as any});
  } catch (error) {
    console.error("Error initializing Google Drive client:", error);
    throw error;
  }
};

/**
 * Create a folder for a user if it doesn't exist already
 * The folder name follows the format: first_name_last_name_id
 */
export const createUserFolderIfNotExists = async (
  user: OnboardingRequest
): Promise<string> => {
  try {
    const drive = await initializeDriveClient();
    const folderName = `${user.first_name}_${user.last_name}_${user.id}`;
    const parentFolderId = process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID;

    // Check if folder already exists
    const response = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentFolderId}' in parents and trashed=false`,
      fields: "files(id, name)",
    });

    const files = response.data.files;

    // If folder exists, return its ID
    if (files && files.length > 0) {
      console.log(
        `Folder for ${folderName} already exists. ID: ${files[0].id}`
      );
      return files[0].id!;
    }

    // If folder doesn't exist, create it
    console.log(`Creating new folder for ${folderName}`);
    const folderMetadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentFolderId],
    };

    const folder = await drive.files.create({
      requestBody: folderMetadata,
      fields: "id",
    });

    console.log(`Folder created with ID: ${folder.data.id}`);
    return folder.data.id!;
  } catch (error) {
    console.error("Error creating user folder:", error);
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
    const drive = await initializeDriveClient();

    // Get or create user folder
    const folderId = await createUserFolderIfNotExists(user);

    // Prepare file metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId],
    };

    // Upload the file
    const media = {
      mimeType,
      body: fileBuffer,
    };

    console.log(`Uploading file ${fileName} to folder ${folderId}`);
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id,webViewLink",
    });

    console.log(
      `File uploaded. ID: ${response.data.id}, Link: ${response.data.webViewLink}`
    );

    // Return the file's web view link
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
): Promise<any[]> => {
  try {
    const drive = await initializeDriveClient();

    // Get user folder ID
    const folderId = await createUserFolderIfNotExists(user);

    // List files in the folder
    console.log(`Listing files in folder ${folderId}`);
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

// Generate a shareable link for a file
export const generateShareableLink = async (
  fileId: string
): Promise<string> => {
  try {
    const drive = await initializeDriveClient();

    // Create a public permission
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    // Get the file's web view link
    const response = await drive.files.get({
      fileId,
      fields: "webViewLink",
    });

    return response.data.webViewLink!;
  } catch (error) {
    console.error("Error generating shareable link:", error);
    throw error;
  }
};
