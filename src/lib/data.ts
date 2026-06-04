import videosData from "../../data/videos.json";
import poisData from "../../data/pois.json";
import listingsData from "../../data/listings.json";
import type { Video, POI, Listing } from "@/types";

export const videos: Video[] = videosData as Video[];
export const pois: POI[] = poisData as POI[];
export const listings: Listing[] = listingsData as Listing[];

export function getVideosByCity(city: string): Video[] {
  return videos.filter((v) => v.city === city);
}

export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}

export function getPOIById(id: string): POI | undefined {
  return pois.find((p) => p.id === id);
}
