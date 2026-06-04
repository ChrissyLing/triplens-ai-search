"use client";

import type { SynthesizedItinerary } from "@/types";
import { VideoCard } from "../VideoCard";

interface LearnResultsProps {
  itinerary: SynthesizedItinerary;
}

export default function LearnResults({ itinerary }: LearnResultsProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-zinc-900 p-6">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-xs text-blue-300">
            AI 合成攻略
          </span>
          {itinerary.budget && (
            <span className="text-xs text-zinc-400">{itinerary.budget}</span>
          )}
        </div>
        <h2 className="text-xl font-bold text-white">{itinerary.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{itinerary.summary}</p>

        <div className="mt-6 space-y-4">
          {itinerary.days.map((day) => (
            <div
              key={day.day}
              className="rounded-xl border border-zinc-700/50 bg-zinc-900/60 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                  {day.day}
                </span>
                <h3 className="font-semibold text-white">{day.title}</h3>
              </div>
              <ul className="mt-3 space-y-1.5">
                {day.activities.map((activity) => (
                  <li key={activity} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                    {activity}
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {day.pois.map((poi) => (
                  <span
                    key={poi}
                    className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
                  >
                    📍 {poi}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-amber-400/80">💡 {day.tips}</p>
            </div>
          ))}
        </div>
      </div>

      {itinerary.sourceVideos.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-medium text-zinc-400">
            参考创作者视频 ({itinerary.sourceVideos.length})
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {itinerary.sourceVideos.map((v) => (
              <VideoCard key={v.id} video={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
