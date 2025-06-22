"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation"; 
import { useNotification } from "./Notification";
import { apiClient } from "@/lib/api-client";
import FileUpload from "./FileUpload";

export default function VideoUploadForm() {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { showNotification } = useNotification();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      thumbnailUrl: "",
    },
  });

  const handleUploadSuccess = (response) => {
    setValue("videoUrl", response.filePath);
    setValue("thumbnailUrl", response.thumbnailUrl || response.filePath);
    showNotification("Video uploaded successfully!", "success");
  };

  const handleUploadProgress = (progress) => {
    setUploadProgress(progress);
  };

  const onSubmit = async (data) => {
    if (!data.videoUrl) {
      showNotification("Please upload a video first", "error");
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVideo(data);
      showNotification("Video published successfully!", "success");

      // Optional: reset form
      setValue("title", "");
      setValue("description", "");
      setValue("videoUrl", "");
      setValue("thumbnailUrl", "");
      setUploadProgress(0);
      router.push("/");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Failed to publish video",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl mx-auto bg-black border border-border p-8 rounded-xl text-white"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Upload Video</h2>

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2.5">
          Title
        </label>
        <input
          id="title"
          placeholder="Title of video"
          type="text"
          {...register("title", { required: "Title is required" })}
          className={`w-full px-4 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.title ? "border-red-500" : "border-border"
          }`}
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2.5">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Description of video"
          {...register("description", {
            required: "Description is required",
          })}
          className={`w-full px-4 py-2 border rounded-lg h-28 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
            errors.description ? "border-red-500" : "border-border"
          }`}
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Upload Video</label>
        <FileUpload
          fileType="video"
          onSuccess={handleUploadSuccess}
          onProgress={handleUploadProgress}
        />
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading || !uploadProgress}
        className="w-full bg-primary text-primary-foreground py-2 cursor-pointer rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Publishing Video...
          </>
        ) : (
          "Publish Video"
        )}
      </button>
    </form>
  );
}
