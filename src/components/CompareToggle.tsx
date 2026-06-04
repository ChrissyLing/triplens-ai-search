"use client";

interface CompareToggleProps {
  mode: "intent" | "traditional";
  onChange: (mode: "intent" | "traditional") => void;
}

export default function CompareToggle({ mode, onChange }: CompareToggleProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-3">
      <span className="text-sm text-zinc-400">搜索模式</span>
      <div className="flex rounded-full bg-zinc-800 p-1">
        <button
          type="button"
          onClick={() => onChange("intent")}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            mode === "intent"
              ? "bg-pink-500 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          Intent-aware
        </button>
        <button
          type="button"
          onClick={() => onChange("traditional")}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            mode === "traditional"
              ? "bg-zinc-600 text-white"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          传统搜索
        </button>
      </div>
      {mode === "traditional" && (
        <span className="text-xs text-zinc-500">纯视频列表，无意图路由</span>
      )}
    </div>
  );
}
