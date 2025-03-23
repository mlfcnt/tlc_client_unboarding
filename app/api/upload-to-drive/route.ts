import {NextRequest, NextResponse} from "next/server";
import {supabase} from "@/lib/supabase";
import {DATABASE_TABLES} from "@/app/constants/databaseTables";
import {
  uploadFileToDrive,
  createUserFolderIfNotExists,
} from "@/app/lib/google-drive/drive-client";
import {google} from "googleapis";

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();

    // Get the user ID
    const userId = formData.get("userId") as string;
    if (!userId) {
      return NextResponse.json({error: "User ID is required"}, {status: 400});
    }

    // Check if a specific folder ID was provided
    const forcedFolderId = formData.get("folderId") as string | null;

    // Get file information
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({error: "File is required"}, {status: 400});
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Get user information from database
    const {data: userData, error: userError} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .select("*")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    try {
      let folderId: string;

      // If client provided a folder ID, verify and use it
      if (forcedFolderId) {
        try {
          // Initialize Drive client to verify the folder exists
          const auth = new google.auth.GoogleAuth({
            credentials: {
              type: "service_account",
              project_id: process.env.GOOGLE_CLOUD_PROJECT_ID,
              private_key:
                process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
                  /\\n/g,
                  "\n"
                ),
              client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            },
            scopes: ["https://www.googleapis.com/auth/drive"],
          });

          const drive = google.drive({version: "v3", auth});

          // Verify the folder exists and is accessible
          const folderCheck = await drive.files.get({
            fileId: forcedFolderId,
            fields: "id,name,mimeType",
          });

          if (
            folderCheck.data.mimeType === "application/vnd.google-apps.folder"
          ) {
            folderId = forcedFolderId;

            // Cache this folder ID
            if (global.DRIVE_FOLDER_CACHE) {
              global.DRIVE_FOLDER_CACHE[`folder_${userId}`] = folderId;
            }
          } else {
            // Not a folder, create/get one
            folderId = await createUserFolderIfNotExists(userData);
          }
        } catch (error) {
          console.error("Error verifying folder:", error);
          // Couldn't verify folder, create/get one
          folderId = await createUserFolderIfNotExists(userData);
        }
      } else {
        // No folder ID provided, create/get one
        folderId = await createUserFolderIfNotExists(userData);
      }

      // Upload file to Google Drive
      const fileLink = await uploadFileToDrive(
        userData,
        fileBuffer,
        file.name,
        file.type
      );

      // Save the folder ID in the database if not already saved
      if (userData && !userData.drive_folder_id) {
        await supabase
          .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
          .update({drive_folder_id: folderId})
          .eq("id", userId);
      }

      // Return success response
      return NextResponse.json({
        success: true,
        fileLink,
        folderId,
      });
    } catch (driveError: any) {
      return NextResponse.json(
        {
          error: "Google Drive operation failed",
          details: driveError.message || "Unknown error",
        },
        {status: 500}
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to upload file",
        details: error.message || "Unknown error",
      },
      {status: 500}
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the query params
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({error: "User ID is required"}, {status: 400});
    }

    // Get user information from database
    const {data: userData, error: userError} = await supabase
      .from(DATABASE_TABLES.ONBOARDING_REQUESTS)
      .select("drive_folder_id")
      .eq("id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json({error: "User not found"}, {status: 404});
    }

    // Return the folder ID
    return NextResponse.json({
      folderId: userData.drive_folder_id || null,
    });
  } catch (error) {
    console.error("Error fetching drive folder information:", error);
    return NextResponse.json(
      {error: "Failed to fetch drive folder information"},
      {status: 500}
    );
  }
}
