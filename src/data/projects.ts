// src/data/projects.ts
// Tipos + datos en un solo lugar para mantenerlo simple.

export type ProjectType = "game" | "web" | "tool" | "qa";
export type ProjectStatus = "WIP" | "Done" | "Prototype";

export type Cover =
  | { type: "image"; src: string }
  | { type: "video"; src: string; poster?: string };

export type Project = {
  slug: string;
  title: string;
  summary: string;
  type: ProjectType;
  year: number;
  tech: string[];
  tags: string[];
  cover: Cover;
  repo?: string;
  demo?: string;
  caseStudy?: string;
  status?: ProjectStatus;
  featured?: boolean;
  metrics?: { stars?: number; lastUpdated?: string; language?: string };
};

export const PROJECTS: ReadonlyArray<Project> = [
  {
    slug: "dungeon-crawler",
    title: "Dungeon Crawler",
    summary:
      "Prototipo 2D con loot, salas procedurales y combate básico en tiempo real.",
    type: "game",
    year: 2025,
    tech: ["Godot", "GDScript", "Tilemaps"],
    tags: ["Procedural", "2D", "Pixel"],
    cover: { type: "video", src: "/games/dungeon-preview.mp4", poster: "/games/game1.jpg" },
    demo: "/games/dungeon",
    repo: "https://github.com/greyber/dungeon-crawler",
    caseStudy: "/projects/dungeon-crawler",
    status: "Prototype",
    featured: false,
    metrics: { stars: 12, lastUpdated: "2025-07-20", language: "GDScript" },
  },
  {
    slug: "pixel-shooter",
    title: "Pixel Shooter",
    summary:
      "Shooter arcade con oleadas, power-ups y sistema simple de partículas.",
    type: "game",
    year: 2025,
    tech: ["Unity", "C#"],
    tags: ["Shooter", "Arcade", "FX"],
    cover: { type: "video", src: "/games/shooter-preview.mp4", poster: "/games/game2.jpg" },
    demo: "/games/shooter",
    repo: "https://github.com/greyber/pixel-shooter",
    caseStudy: "/projects/pixel-shooter",
    status: "Prototype",
    featured: false,
    metrics: { stars: 9, lastUpdated: "2025-07-05", language: "C#" },
  },
  {
    slug: "truco-argentino",
    title: "Truco Argentino (Godot)",
    summary:
      "Implementación de reglas de Truco: envido, flor (opcional), truco/retruco/vale cuatro. UI simple y lógica preparada para IA y online.",
    type: "game",
    year: 2025,
    tech: ["Godot", "GDScript", "State Machines"],
    tags: ["Cartas", "IA (roadmap)", "Online (roadmap)"],
    cover: { type: "video", src: "/games/truco-preview.mp4", poster: "/games/game3.jpg" },
    demo: "/games/truco",
    repo: "https://github.com/greyber/truco-godot",
    caseStudy: "/projects/truco-argentino",
    status: "WIP",
    featured: true,
    metrics: { stars: 21, lastUpdated: "2025-08-10", language: "GDScript" },
  },
  {
    slug: "portfolio-website",
    title: "Este sitio (Portfolio)",
    summary:
      "Portafolio con Next.js, Tailwind, Framer Motion y shadcn/ui. Dark/Light mode, secciones animadas, SEO y componentes reusables.",
    type: "web",
    year: 2025,
    tech: ["Next.js", "Tailwind", "Framer Motion", "shadcn/ui"],
    tags: ["SEO", "Accesibilidad", "Animaciones"],
    cover: { type: "image", src: "/covers/portfolio-cover.webp" },
    demo: "/",
    repo: "https://github.com/greyber/portfolio",
    caseStudy: "/projects/portfolio-website",
    status: "Done",
    featured: true,
    metrics: { stars: 5, lastUpdated: "2025-08-15", language: "TypeScript" },
  },
  {
    slug: "qa-automation-playwright",
    title: "QA Automation (Playwright)",
    summary:
      "Suite de pruebas UI y API con Playwright, fixtures, screenshots y reportes HTML.",
    type: "qa",
    year: 2025,
    tech: ["Playwright", "TypeScript", "CI"],
    tags: ["Testing", "API", "UI"],
    cover: { type: "image", src: "/covers/playwright-cover.webp" },
    demo: "https://stackblitz.com/edit/playwright-demo",
    repo: "https://github.com/greyber/playwright-suite",
    caseStudy: "/projects/qa-automation-playwright",
    status: "Done",
    featured: false,
    metrics: { stars: 18, lastUpdated: "2025-07-30", language: "TypeScript" },
  },
  {
    slug: "dungeon-crawler2",
    title: "Dungeon Crawler",
    summary:
      "Prototipo 2D con loot, salas procedurales y combate básico en tiempo real.",
    type: "game",
    year: 2025,
    tech: ["Godot", "GDScript", "Tilemaps"],
    tags: ["Procedural", "2D", "Pixel"],
    cover: { type: "video", src: "/games/dungeon-preview.mp4", poster: "/games/game1.jpg" },
    demo: "/games/dungeon",
    repo: "https://github.com/greyber/dungeon-crawler",
    caseStudy: "/projects/dungeon-crawler",
    status: "Prototype",
    featured: false,
    metrics: { stars: 12, lastUpdated: "2025-07-20", language: "GDScript" },
  },
  {
    slug: "pixel-shooter2",
    title: "Pixel Shooter",
    summary:
      "Shooter arcade con oleadas, power-ups y sistema simple de partículas.",
    type: "game",
    year: 2025,
    tech: ["Unity", "C#"],
    tags: ["Shooter", "Arcade", "FX"],
    cover: { type: "video", src: "/games/shooter-preview.mp4", poster: "/games/game2.jpg" },
    demo: "/games/shooter",
    repo: "https://github.com/greyber/pixel-shooter",
    caseStudy: "/projects/pixel-shooter",
    status: "Prototype",
    featured: false,
    metrics: { stars: 9, lastUpdated: "2025-07-05", language: "C#" },
  },
  {
    slug: "truco-argentino2",
    title: "Truco Argentino (Godot)",
    summary:
      "Implementación de reglas de Truco: envido, flor (opcional), truco/retruco/vale cuatro. UI simple y lógica preparada para IA y online.",
    type: "game",
    year: 2025,
    tech: ["Godot", "GDScript", "State Machines"],
    tags: ["Cartas", "IA (roadmap)", "Online (roadmap)"],
    cover: { type: "video", src: "/games/truco-preview.mp4", poster: "/games/game3.jpg" },
    demo: "/games/truco",
    repo: "https://github.com/greyber/truco-godot",
    caseStudy: "/projects/truco-argentino",
    status: "WIP",
    featured: true,
    metrics: { stars: 21, lastUpdated: "2025-08-10", language: "GDScript" },
  },
  {
    slug: "portfolio-website2",
    title: "Este sitio (Portfolio)",
    summary:
      "Portafolio con Next.js, Tailwind, Framer Motion y shadcn/ui. Dark/Light mode, secciones animadas, SEO y componentes reusables.",
    type: "web",
    year: 2025,
    tech: ["Next.js", "Tailwind", "Framer Motion", "shadcn/ui"],
    tags: ["SEO", "Accesibilidad", "Animaciones"],
    cover: { type: "image", src: "/covers/portfolio-cover.webp" },
    demo: "/",
    repo: "https://github.com/greyber/portfolio",
    caseStudy: "/projects/portfolio-website",
    status: "Done",
    featured: true,
    metrics: { stars: 5, lastUpdated: "2025-08-15", language: "TypeScript" },
  },
  {
    slug: "qa-automation-playwright3",
    title: "QA Automation (Playwright)",
    summary:
      "Suite de pruebas UI y API con Playwright, fixtures, screenshots y reportes HTML.",
    type: "qa",
    year: 2025,
    tech: ["Playwright", "TypeScript", "CI"],
    tags: ["Testing", "API", "UI"],
    cover: { type: "image", src: "/covers/playwright-cover.webp" },
    demo: "https://stackblitz.com/edit/playwright-demo",
    repo: "https://github.com/greyber/playwright-suite",
    caseStudy: "/projects/qa-automation-playwright",
    status: "Done",
    featured: false,
    metrics: { stars: 18, lastUpdated: "2025-07-30", language: "TypeScript" },
  },
    {
    slug: "portfolio-website3",
    title: "Este sitio (Portfolio)",
    summary:
      "Portafolio con Next.js, Tailwind, Framer Motion y shadcn/ui. Dark/Light mode, secciones animadas, SEO y componentes reusables.",
    type: "web",
    year: 2025,
    tech: ["Next.js", "Tailwind", "Framer Motion", "shadcn/ui"],
    tags: ["SEO", "Accesibilidad", "Animaciones"],
    cover: { type: "image", src: "/covers/portfolio-cover.webp" },
    demo: "/",
    repo: "https://github.com/greyber/portfolio",
    caseStudy: "/projects/portfolio-website",
    status: "Done",
    featured: true,
    metrics: { stars: 5, lastUpdated: "2025-08-15", language: "TypeScript" },
  },
  {
    slug: "qa-automation-playwright4",
    title: "QA Automation (Playwright)",
    summary:
      "Suite de pruebas UI y API con Playwright, fixtures, screenshots y reportes HTML.",
    type: "qa",
    year: 2025,
    tech: ["Playwright", "TypeScript", "CI"],
    tags: ["Testing", "API", "UI"],
    cover: { type: "image", src: "/covers/playwright-cover.webp" },
    demo: "https://stackblitz.com/edit/playwright-demo",
    repo: "https://github.com/greyber/playwright-suite",
    caseStudy: "/projects/qa-automation-playwright",
    status: "Done",
    featured: false,
    metrics: { stars: 18, lastUpdated: "2025-07-30", language: "TypeScript" },
  },
  
];

// Helpers mínimos y útiles
export const getAllTags = () =>
  Array.from(new Set(PROJECTS.flatMap((p) => p.tags))).sort();

export const findProjectBySlug = (slug: string) =>
  PROJECTS.find((p) => p.slug === slug);
