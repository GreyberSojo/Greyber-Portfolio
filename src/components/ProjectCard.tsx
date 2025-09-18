// src/components/ProjectCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, KeyboardEvent } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProjectCardCover =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

export type ProjectCardData = {
  slug: string;
  title: string;
  summary: string;
  year: number;
  type: string;
  tech: string[];
  tags: string[];
  cover: ProjectCardCover;
  demo?: string;
  repo?: string;
  caseStudy?: string;
  status?: string;
};

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzI4MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjMjIyJy8+PC9zdmc+";

const cardVariants = cva(
  "group relative rounded-2xl border bg-background/60 backdrop-blur-sm shadow-sm hover:shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-ring",
  {
    variants: {
      density: { default: "p-0", compact: "p-0" },
    },
    defaultVariants: { density: "default" },
  }
);

type Props = VariantProps<typeof cardVariants> & {
  project: ProjectCardData;
  onOpen?: (p: ProjectCardData) => void;
};

export default function ProjectCard({ project, onOpen, density }: Props) {
  const [loaded, setLoaded] = useState(false);

  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen?.(project);
    }
  };

  return (
    <Card
      className={cn(cardVariants({ density }))}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : -1}
      aria-label={onOpen ? `Abrir vista rápida de ${project.title}` : undefined}
      onKeyDown={onOpen ? handleKey : undefined}
      onClick={onOpen ? () => onOpen(project) : undefined}
    >
      {/* Media */}
      <div className="relative aspect-[16/9]">
        {!loaded && <div className="absolute inset-0 bg-foreground/5 animate-pulse" />}
        {project.cover.type === "image" ? (
          <Image
            src={project.cover.src}
            alt={project.title}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            onLoadingComplete={() => setLoaded(true)}
          />
        ) : (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={project.cover.src}
            poster={project.cover.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            onLoadedData={() => setLoaded(true)}
          />
        )}

        {/* Overlay hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="pointer-events-auto text-[11px] px-2 py-0.5 rounded-full bg-background/80 border"
              >
                {t}
              </span>
            ))}
          </div>
          <h3 className="text-white text-lg font-semibold drop-shadow-sm">{project.title}</h3>
          <p className="text-white/80 text-xs line-clamp-2">{project.summary}</p>

          <div className="mt-2 flex gap-2 pointer-events-auto">
            {project.demo && (
              <Link
                href={project.demo}
                target={project.demo.startsWith("http") ? "_blank" : undefined}
                rel={project.demo.startsWith("http") ? "noopener noreferrer" : undefined}
                className="inline-flex"
              >
                <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
                  Demo
                </Button>
              </Link>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex">
                <Button size="sm" variant="secondary">
                  Repo
                </Button>
              </a>
            )}
            {project.caseStudy && (
              <Link href={project.caseStudy} className="inline-flex">
                <Button size="sm" variant="outline">
                  Caso de estudio
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Meta */}
      <CardContent className="p-4 flex items-center justify-between gap-2">
        <div>
          <div className="text-xs text-foreground/60">
            {project.type.toUpperCase()} • {project.year}
            {project.status ? ` • ${project.status}` : ""}
          </div>
          <div className="font-medium">{project.title}</div>
        </div>
      </CardContent>
    </Card>
  );
}
