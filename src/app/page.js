"use client";
import React, { useEffect, useState } from "react";
import VideoFeed from "./components/VideoFeed";
import { apiClient } from "@/lib/api-client";
import Header from "./components/Header";

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
<main className="container mx-auto px-4 py-8 h-[90%]">
      <Header/>
      <VideoFeed videos={videos} />
    </main>
  );
}
