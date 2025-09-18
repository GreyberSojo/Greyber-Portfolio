// src/lib/utils.ts
import { type ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import type { Media } from "@/data/projects";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function firstMedia(cover: Media | Media[]): Media {
  return Array.isArray(cover) ? cover[0] : cover;
}
