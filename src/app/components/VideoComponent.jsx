"use client";

import { useEffect, useRef } from "react";
import { Video } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

export default function VideoComponent({ video, onPlay, videoRefs }) {
  const videoRef = useRef(null);

  // Store the actual <video> element in the refs object
  useEffect(() => {
    if (videoRef.current) {
      const underlyingVideo = videoRef.current.querySelector("video");
      if (underlyingVideo) {
        videoRefs.current[video._id] = underlyingVideo;
      }
    }
  }, [video._id, videoRefs]);

  const handlePlay = () => {
    if (onPlay) {
      onPlay(video._id);
    }
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <div
          className="rounded-xl overflow-hidden relative w-full"
          style={{ aspectRatio: "9/9" }}
          ref={videoRef}
        >
          <Video
            urlEndpoint={urlEndpoint}
            src={video.videoUrl}
            controls
            width="100%"
            height="100%"
            className="w-full h-full object-cover"
            onPlay={handlePlay}
          />
        </div>
      </figure>

      <div className="card-body py-1 px-5 mb-1">
        <h2 className="card-title">{video.title}</h2>
        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
}
