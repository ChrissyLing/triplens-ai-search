"use client";

import type { Video } from "@/types";
import ThumbnailImage from "./ThumbnailImage";

function VideoCard({ video }: { video: Video }) {
  return (
    <div className="group overflow-hidden rounded-xl bg-zinc-900 transition hover:ring-1 hover:ring-pink-500/30">
      <div className="relative aspect-[3/4] overflow-hidden">
        <ThumbnailImage
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
          <p className="text-xs text-pink-300">{video.creator}</p>
          <p className="line-clamp-2 text-sm font-medium text-white">{video.title}</p>
          <p className="mt-1 text-xs text-zinc-400">{video.views} 播放</p>
        </div>
      </div>
    </div>
  );
}

export default function VideoCardGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {videos.map((v) => (
        <VideoCard key={v.id} video={v} />
      ))}
    </div>
  );
}

export { VideoCard };
