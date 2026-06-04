import { NextRequest, NextResponse } from "next/server";
import { classifyIntentWithLLM } from "@/lib/intentClassifier";
import {
  retrieveVideos,
  retrievePOIs,
  retrieveListings,
  findNavigateTarget,
  synthesizeItineraryWithLLM,
} from "@/lib/retriever";
import type { SearchResponse } from "@/types";

export async function POST(request: NextRequest) {
  const { query, mode = "intent" } = await request.json();

  if (!query || typeof query !== "string") {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const trimmed = query.trim();
  const intent = await classifyIntentWithLLM(trimmed);

  if (mode === "traditional") {
    const videos = retrieveVideos(trimmed, intent.intent, 12);
    return NextResponse.json({
      query: trimmed,
      intent,
      videos,
      mode: "traditional",
    } satisfies SearchResponse & { mode: string });
  }

  const videos = retrieveVideos(trimmed, intent.intent, 8);
  const response: SearchResponse = { query: trimmed, intent, videos };

  switch (intent.intent) {
    case "learn": {
      response.itinerary = await synthesizeItineraryWithLLM(trimmed, videos);
      break;
    }
    case "discover": {
      response.pois = retrievePOIs(trimmed, 6);
      break;
    }
    case "transact": {
      response.listings = retrieveListings(trimmed, 4);
      break;
    }
    case "navigate": {
      response.navigateTarget = findNavigateTarget(trimmed) ?? undefined;
      if (!response.navigateTarget && videos.length > 0) {
        response.navigateTarget = {
          type: "poi",
          name: videos[0].pois[0] ?? videos[0].title,
          description: videos[0].transcript,
          thumbnail: videos[0].thumbnail,
          relatedVideos: videos.slice(0, 4),
        };
      }
      break;
    }
  }

  return NextResponse.json(response);
}
