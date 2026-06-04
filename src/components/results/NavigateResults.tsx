"use client";

import type { SearchResponse } from "@/types";
import { VideoCard } from "../VideoCard";
import ThumbnailImage from "../ThumbnailImage";

interface NavigateResultsProps {
  target: NonNullable<SearchResponse["navigateTarget"]>;
}

export default function NavigateResults({ target }: NavigateResultsProps) {
  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-orange-500/20 bg-zinc-900">
        <div className="relative h-48 overflow-hidden sm:h-56">
          <ThumbnailImage
            src={target.thumbnail}
            alt={target.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="rounded-md bg-orange-500/20 px-2 py-0.5 text-xs text-orange-300">
              {target.type === "creator" ? "创作者" : "地点直达"}
            </span>
            <h2 className="mt-1 text-2xl font-bold text-white">{target.name}</h2>
            <p className="mt-1 text-sm text-zinc-400">{target.description}</p>
          </div>
        </div>
        <div className="flex gap-3 p-4">
          <button
            type="button"
            className="flex-1 rounded-full bg-orange-500 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
          >
            {target.type === "creator" ? "查看主页" : "查看详情"}
          </button>
          <button
            type="button"
            className="rounded-full border border-zinc-700 px-6 py-2.5 text-sm text-zinc-300 transition hover:border-zinc-500"
          >
            收藏
          </button>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-400">
          相关视频 ({target.relatedVideos.length})
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {target.relatedVideos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
