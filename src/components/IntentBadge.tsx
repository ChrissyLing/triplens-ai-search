"use client";

import { INTENT_COLORS, INTENT_LABELS, type IntentResult } from "@/types";

interface IntentBadgeProps {
  intent: IntentResult;
}

export default function IntentBadge({ intent }: IntentBadgeProps) {
  return (
    <div className="rounded-xl border border-zinc-700/50 bg-zinc-900/80 p-4 backdrop-blur-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm text-zinc-400">检测到意图</span>
        <span
          className={`rounded-full border px-3 py-1 text-sm font-medium ${INTENT_COLORS[intent.intent]}`}
        >
          {INTENT_LABELS[intent.intent]}
        </span>
        <span className="text-sm text-zinc-500">
          置信度 {(intent.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{intent.reasoning}</p>
      {intent.constraints && intent.constraints.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {intent.constraints.map((c) => (
            <span
              key={c}
              className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
            >
              {c}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
