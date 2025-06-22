"use client";

import {
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
  upload,
} from "@imagekit/next";
import { useRef, useState } from "react";

const FileUpload = ({ onSuccess, onProgress, fileType = "image" }) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const abortController = new AbortController();

  const authenticator = async () => {
    try {
      const response = await fetch("/api/upload-auth");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Request failed: ${response.status}: ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Auth error:", error);
      throw new Error("Authentication failed");
    }
  };

  const validateFile = (file) => {
    setError("");
    if (fileType === "video") {
      if (!file.type.startsWith("video/")) {
        setError("Please upload a valid video file.");
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError("Video must be less than 100MB.");
        return false;
      }
    } else {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        setError("Upload JPEG, PNG, or WebP image.");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB.");
        return false;
      }
    }
    return true;
  };

  const handleUpload = async () => {
    const input = fileInputRef.current;
    if (!input || !input.files?.length) {
      setError("Select a file to upload.");
      return;
    }

    const file = input.files[0];
    if (!validateFile(file)) return;

    let auth;
    try {
      auth = await authenticator();
    } catch {
      setError("Authentication failed.");
      return;
    }

    try {
      setUploading(true);
      const uploadResponse = await upload({
        ...auth,
        file,
        fileName: file.name,
        folder: fileType === "video" ? "/videos" : "/images",
        onProgress: (event) => {
          const percent = (event.loaded / event.total) * 100;
          setProgress(percent);
          if (onProgress) onProgress(percent);
        },
        abortSignal: abortController.signal,
      });

      setUploading(false);
      setProgress(0);
      if (onSuccess) onSuccess(uploadResponse);
    } catch (err) {
      setUploading(false);
      if (err instanceof ImageKitAbortError) {
        setError("Upload aborted.");
      } else if (err instanceof ImageKitInvalidRequestError) {
        setError("Invalid upload request.");
      } else if (err instanceof ImageKitUploadNetworkError) {
        setError("Network error during upload.");
      } else if (err instanceof ImageKitServerError) {
        setError("Server error during upload.");
      } else {
        setError("Upload failed.");
      }
      console.error("Upload error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "1rem auto" }}>
      <input
        type="file"
        className="cursor-pointer"
        accept={fileType === "video" ? "video/*" : "image/*"}
        ref={fileInputRef}
      />
      <button onClick={handleUpload} disabled={uploading} className="cursor-pointer">
        {uploading ? "Uploading..." : `Upload ${fileType}`}
      </button>
      {uploading && (
        <progress value={progress} max={100} style={{ width: "100%" }} />
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default FileUpload;
