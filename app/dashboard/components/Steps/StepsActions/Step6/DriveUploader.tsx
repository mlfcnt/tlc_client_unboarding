"use client";

import React, {useState, useRef} from "react";
import {Button} from "@/components/ui/button";
import {UploadCloud, FileText, X, Check} from "lucide-react";
import {OnboardingRequest} from "@/app/types/OnboardingRequest";
import {toast} from "sonner";

type UploadedFile = {
  name: string;
  size: number;
  link?: string;
  status: "uploading" | "success" | "error";
};

export const DriveUploader = ({
  user,
  onUploadsChanged,
}: {
  user: OnboardingRequest;
  onUploadsChanged?: (fileLinks: string[]) => void;
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Store folder ID for consistent uploads
  const [folderId, setFolderId] = useState<string | null>(null);

  // Handler for file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selectedFiles = Array.from(e.target.files);

    // Add files to UI state with uploading status
    const newFiles = selectedFiles.map((file) => ({
      name: file.name,
      size: file.size,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setIsUploading(true);

    // Reset file input
    e.target.value = "";

    // Process files sequentially to ensure folder consistency
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const fileInfo = newFiles[i];

        await uploadFile(file, fileInfo);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Upload a single file to Google Drive
  const uploadFile = async (
    file: File,
    fileInfo: UploadedFile
  ): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", user.id);

      // Send folder ID if we have it to ensure consistent folder usage
      if (folderId) {
        formData.append("folderId", folderId);
      }

      const response = await fetch("/api/upload-to-drive", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();

      // Store folder ID for future uploads
      if (data.folderId && !folderId) {
        setFolderId(data.folderId);
      }

      // Update file status in UI
      setFiles((prev) =>
        prev.map((f) =>
          f.name === fileInfo.name
            ? {...f, status: "success", link: data.fileLink}
            : f
        )
      );

      // Notify parent of new uploads
      if (onUploadsChanged) {
        const successfulUploads = [
          ...files.filter((f) => f.status === "success").map((f) => f.link!),
          data.fileLink,
        ];
        onUploadsChanged(successfulUploads);
      }

      toast.success(`Successfully uploaded ${fileInfo.name}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Update file status to error
      setFiles((prev) =>
        prev.map((f) =>
          f.name === fileInfo.name ? {...f, status: "error"} : f
        )
      );

      toast.error(`Failed to upload ${fileInfo.name}`);
    }
  };

  // Remove a file from the list
  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));

    // Notify parent of updated uploads
    if (onUploadsChanged) {
      const successfulUploads = files
        .filter((f) => f.status === "success" && f.name !== fileName)
        .map((f) => f.link!);
      onUploadsChanged(successfulUploads);
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 p-6 rounded-md">
        <div className="flex flex-col items-center justify-center space-y-2">
          <UploadCloud size={40} className="text-gray-400" />
          <h3 className="text-lg font-medium">Drag and drop files here</h3>
          <p className="text-sm text-gray-500">
            Or click the button below to select files
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            variant="outline"
            className="mt-2"
          >
            Select Files
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
            disabled={isUploading}
          />
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Uploaded Files</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center space-x-2">
                  <FileText size={20} className="text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {file.status === "uploading" && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  )}
                  {file.status === "success" && (
                    <Check size={18} className="text-green-500" />
                  )}
                  {file.status === "error" && (
                    <X size={18} className="text-red-500" />
                  )}
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
