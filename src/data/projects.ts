// src/data/projects.ts
// Tipos + datos en un solo lugar para mantenerlo simple.
import { prefix } from "@/lib/prefix"

export type ProjectType = "game" | "web" | "tool" | "qa";
export type ProjectStatus = "Work In Progress" | "Done" | "Prototype";

export type Media = {
  src: string;
  type: "image" | "video";
  poster?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  type: ProjectType;
  year: number;
  tech: string[];
  tags: string[];
  cover: Media | Media[];
  repo?: string;
  status?: ProjectStatus;
  featured?: boolean;
  metrics?: { lastUpdated?: string; language?: string };
};

export const PROJECTS: ReadonlyArray<Project> = [
  {
    slug: "dungeon-crawler",
    title: "Dungeon Supply Master",
    summary:
      "Prototipo 2D con loot, salas procedurales y combate básico en tiempo real.",
    type: "game",
    year: 2025,
    tech: ["Godot", "GDScript", "Logic"],
    tags: ["Procedural", "2D", "Pixel"],
    cover: [
      { src: `${prefix}/dsm/game_battle.png`, type: "image", poster: `${prefix}/dsm/game_battle.png` },
      { src: `${prefix}/dsm/game_boss.png`, type: "image" },
      { src: `${prefix}/dsm/game_engine.png`, type: "image" },
      { src: `${prefix}/dsm/game_loot.png`, type: "image" },
    ],
    repo: "https://github.com/GreyberSojo/DungeonSupplyMaster",
    status: "Prototype",
    featured: false,
    metrics: { lastUpdated: "2025-07-20", language: "GDScript" },
  },
  {
    slug: "truco-argentino",
    title: "Truco Argentino",
    summary:
      "Clasico juego de cartas Truco, donde se implementaron las reglas del modo de juego truco argentino: Envido, truco/retruco/vale cuatro. UI simple, reparto de cartas automaticas, sistema de fases + rondas.",
    type: "game",
    year: 2024,
    tech: ["Unity", "C#", "State Machines", "UI", "UX", "AI", "PixelArt", "3D", "2.5D"],
    tags: ["Cartas", "2.5D", "IA (roadmap)", "Online (roadmap)", "Pixel", "Truco", "Argentine"],
    cover: [
      { src: `${prefix}/truco/truco-preview-unity.mp4`, type: "video", poster: `${prefix}/truco/truco.png` },
      { src: `${prefix}/truco/truco.png`, type: "image" },
      { src: `${prefix}/truco/code-preview.png`, type: "image" },
      { src: `${prefix}/truco/unity-truco.png`, type: "image" },
    ],
    repo: "https://github.com/GreyberSojo/",
    status: "Work In Progress",
    featured: true,
    metrics: { lastUpdated: "2024-08-10", language: "C#" },
  },
  {
    slug: "portfolio-website",
    title: "Portfolio WEB",
    summary:
      "Portafolio web con Next.js, Tailwind, Framer Motion y shadcn/ui. Dark/Light mode, secciones animadas, SEO y componentes reusables.",
    type: "web",
    year: 2025,
    tech: ["Next.js", "Tailwind", "Framer Motion", "shadcn/ui", "Windsurf", "TypeScript", "Framer Motion", "Windsurf"],
    tags: ["SEO", "Accesibilidad", "Animaciones", "Dark/Light mode", "Componentes reusables", "Secciones animadas"],
    cover: [      
      { src: `${prefix}/portfolio/video-preview.mp4`, type: "video", poster: `${prefix}/portfolio/home.png` },
      { src: `${prefix}/portfolio/home.png`, type: "image" },
      { src: `${prefix}/portfolio/contact.png`, type: "image" },
      { src: `${prefix}/portfolio/showcase.png`, type: "image" },
      { src: `${prefix}/portfolio/windsurf.png`, type: "image" },
    ],
    repo: "https://github.com/GreyberSojo/greyber-portfolio",
    status: "Done",
    featured: true,
    metrics: { lastUpdated: "2025-08-15", language: "TypeScript" },
  },
];

// Helpers mínimos y útiles
export const getAllTags = () =>
  Array.from(new Set(PROJECTS.flatMap((p) => p.tags))).sort();

export const findProjectBySlug = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
