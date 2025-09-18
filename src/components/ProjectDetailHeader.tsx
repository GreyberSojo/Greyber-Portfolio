// src/components/ProjectDetailHeader.tsx
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Project } from "@/data/projects";
import { firstMedia } from "@/lib/utils";

export default function ProjectDetailHeader({ project }: { project: Project }) {
  const cover = firstMedia(project.cover);
  const isVideo = cover.type === "video";

  return (
    <header className="flex flex-col md:flex-row gap-6 items-center">
      <div className="relative w-full md:w-[500px] aspect-[5/3]">
        {isVideo ? (
          <video
            className="absolute inset-0 w-full h-full object-cover rounded-xl border shadow-lg"
            src={cover.src}
            poster={cover.poster ?? cover.src}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
          />
        ) : (
          <Image
            src={cover.src}
            alt={project.title}
            fill
            className="rounded-xl border shadow-lg object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 500px"
          />
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-foreground/70 mt-2">{project.summary}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs border bg-foreground/[.05]"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          {project.repo && (
            <Button asChild variant="outline">
              <a href={project.repo} target="_blank" rel="noopener noreferrer">
                Ver Código
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
