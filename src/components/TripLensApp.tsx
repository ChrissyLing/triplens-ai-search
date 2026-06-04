"use client";

import { useState, useCallback } from "react";
import SearchBar from "./SearchBar";
import CompareToggle from "./CompareToggle";
import IntentBadge from "./IntentBadge";
import LearnResults from "./results/LearnResults";
import DiscoverResults from "./results/DiscoverResults";
import TransactResults from "./results/TransactResults";
import NavigateResults from "./results/NavigateResults";
import VideoCardGrid from "./VideoCard";
import { SAMPLE_QUERIES, type SearchResponse } from "@/types";

export default function TripLensApp() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"intent" | "traditional">("intent");
  const [result, setResult] = useState<(SearchResponse & { mode?: string }) | null>(null);
  const [lastQuery, setLastQuery] = useState("");

  const search = useCallback(
    async (query: string, searchMode = mode) => {
      setLoading(true);
      setLastQuery(query);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, mode: searchMode }),
        });
        const data = await res.json();
        setResult(data);
      } catch {
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [mode]
  );

  const handleModeChange = (newMode: "intent" | "traditional") => {
    setMode(newMode);
    if (lastQuery) search(lastQuery, newMode);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Trip<span className="text-pink-500">Lens</span>
              </h1>
              <p className="text-sm text-zinc-500">Intent-aware AI 旅游搜索</p>
            </div>
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              Demo v1
            </span>
          </div>
          <SearchBar
            onSearch={search}
            loading={loading}
            sampleQueries={SAMPLE_QUERIES}
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {result && (
          <div className="space-y-6">
            <CompareToggle mode={mode} onChange={handleModeChange} />

            {mode === "intent" && <IntentBadge intent={result.intent} />}

            {mode === "traditional" ? (
              <div>
                <p className="mb-4 text-sm text-zinc-500">
                  传统模式：所有 query 返回相同的视频列表排序，无差异化布局
                </p>
                <VideoCardGrid videos={result.videos} />
              </div>
            ) : (
              <>
                {result.intent.intent === "learn" && result.itinerary && (
                  <LearnResults itinerary={result.itinerary} />
                )}
                {result.intent.intent === "discover" && result.pois && (
                  <DiscoverResults pois={result.pois} videos={result.videos} />
                )}
                {result.intent.intent === "transact" && result.listings && (
                  <TransactResults listings={result.listings} videos={result.videos} />
                )}
                {result.intent.intent === "navigate" && result.navigateTarget && (
                  <NavigateResults target={result.navigateTarget} />
                )}
              </>
            )}
          </div>
        )}

        {!result && !loading && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 text-5xl">🌏</div>
            <h2 className="text-xl font-semibold text-zinc-300">探索你的下一站</h2>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
              输入搜索词或点击上方示例，体验 Intent-aware 搜索如何根据你的意图切换不同结果页
            </p>
            <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 text-left text-sm">
              {[
                { icon: "📋", label: "Learn", desc: "AI 合成行程攻略" },
                { icon: "🔍", label: "Discover", desc: "探店发现具体地点" },
                { icon: "🎫", label: "Transact", desc: "门票酒店预订" },
                { icon: "🎯", label: "Navigate", desc: "直达 POI/创作者" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4"
                >
                  <span className="text-lg">{item.icon}</span>
                  <p className="mt-1 font-medium text-zinc-300">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
