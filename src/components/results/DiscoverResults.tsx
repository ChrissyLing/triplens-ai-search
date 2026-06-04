"use client";

import type { POI, Video } from "@/types";
import { VideoCard } from "../VideoCard";
import ThumbnailImage from "../ThumbnailImage";

interface DiscoverResultsProps {
  pois: POI[];
  videos: Video[];
}

export default function DiscoverResults({ pois, videos }: DiscoverResultsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-400">
          推荐地点 ({pois.length})
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pois.map((poi) => (
            <div
              key={poi.id}
              className="overflow-hidden rounded-xl border border-purple-500/20 bg-zinc-900 transition hover:border-purple-500/40"
            >
              <div className="relative h-40 overflow-hidden">
                <ThumbnailImage
                  src={poi.thumbnail}
                  alt={poi.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-yellow-300">
                  ★ {poi.rating}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{poi.name}</h4>
                    <p className="text-xs text-zinc-500">{poi.nameEn} · {poi.category}</p>
                  </div>
                  <span className="text-xs text-zinc-400">{poi.priceLevel}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{poi.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {poi.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-purple-500/10 px-2 py-0.5 text-xs text-purple-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {poi.queueTime && (
                  <p className="mt-2 text-xs text-orange-400/80">⏱ {poi.queueTime}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-400">
          创作者实拍视频
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {videos.slice(0, 4).map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
