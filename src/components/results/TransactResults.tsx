"use client";

import type { Listing, Video } from "@/types";
import { VideoCard } from "../VideoCard";
import ThumbnailImage from "../ThumbnailImage";

interface TransactResultsProps {
  listings: Listing[];
  videos: Video[];
}

function formatPrice(listing: Listing): string {
  if (listing.currency === "JPY") return `¥${listing.price.toLocaleString()}`;
  if (listing.currency === "THB") return `฿${listing.price.toLocaleString()}`;
  if (listing.currency === "IDR") return `Rp ${listing.price.toLocaleString()}`;
  if (listing.currency === "SGD") return `S$${listing.price.toLocaleString()}`;
  return `${listing.price}`;
}

export default function TransactResults({ listings, videos }: TransactResultsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-400">
          预订选项 ({listings.length})
        </h3>
        <div className="space-y-3">
          {listings.map((listing) => (
            <div
              key={listing.id}
              className="flex gap-4 rounded-xl border border-green-500/20 bg-zinc-900 p-4 transition hover:border-green-500/40"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg">
                <ThumbnailImage
                  src={listing.thumbnail}
                  alt={listing.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-green-500/10 px-2 py-0.5 text-xs text-green-300">
                      {listing.type === "hotel" ? "酒店" : listing.type === "ticket" ? "门票" : "体验"}
                    </span>
                    <span className="text-xs text-zinc-500">{listing.provider}</span>
                  </div>
                  <h4 className="mt-1 font-semibold text-white">{listing.name}</h4>
                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-yellow-400">★ {listing.rating}</span>
                    <span>({listing.reviewCount.toLocaleString()} 评价)</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-400">
                    {formatPrice(listing)}
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-green-500 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-green-600"
                  >
                    去预订
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-zinc-400">种草视频</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {videos.slice(0, 2).map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </div>
  );
}
