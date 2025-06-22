"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Card, CardContent } from "./ui/card";
import VideoComponent from "./VideoComponent";
import { useRef, useState } from "react";

export default function VideoFeed({ videos }) {
  const [currentPlayingId, setCurrentPlayingId] = useState(null);
  const videoRefs = useRef({});

  const handlePlay = (id) => {
    // Pause all other videos except the one being played
    Object.entries(videoRefs.current).forEach(([key, videoElement]) => {
      if (key !== id && videoElement && !videoElement.paused) {
        videoElement.pause();
      }
    });

    setCurrentPlayingId(id);
  };

  return (
    <div className="relative max-w-7xl mx-auto p-6 overflow-hidden h-full">
      <Carousel className="w-full px-9">
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem
              key={video._id?.toString()}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <Card className="h-full shadow-none border-none p-0 bg-transparent">
                <CardContent className="p-2">
                  <div className="h-full flex flex-col">
                    <VideoComponent
                      video={video}
                      onPlay={handlePlay}
                      videoRefs={videoRefs}
                    />
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
}
