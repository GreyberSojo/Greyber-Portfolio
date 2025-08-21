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
    title: "project.dungeon-crawler.title",
    summary: "project.dungeon-crawler.summary",
    type: "game",
    year: 2025,
    tech: ["Godot", "GDScript", "Tilemaps"],
    tags: [
      "project.dungeon-crawler.tags.procedural",
      "project.dungeon-crawler.tags.2d",
      "project.dungeon-crawler.tags.pixel",
    ],
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
    title: "project.pixel-shooter.title",
    summary: "project.pixel-shooter.summary",
    type: "game",
    year: 2025,
    tech: ["Unity", "C#"],
    tags: [
      "project.pixel-shooter.tags.shooter",
      "project.pixel-shooter.tags.arcade",
      "project.pixel-shooter.tags.fx",
    ],
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
    title: "project.truco-argentino.title",
    summary: "project.truco-argentino.summary",
    type: "game",
    year: 2025,
    tech: ["Godot", "GDScript", "State Machines"],
    tags: [
      "project.truco-argentino.tags.cartas",
      "project.truco-argentino.tags.ia-roadmap",
      "project.truco-argentino.tags.online-roadmap",
    ],
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
    title: "project.portfolio-website.title",
    summary: "project.portfolio-website.summary",
    type: "web",
    year: 2025,
    tech: ["Next.js", "Tailwind", "Framer Motion", "shadcn/ui"],
    tags: [
      "project.portfolio-website.tags.seo",
      "project.portfolio-website.tags.accesibilidad",
      "project.portfolio-website.tags.animaciones",
    ],
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
    title: "project.qa-automation-playwright.title",
    summary: "project.qa-automation-playwright.summary",
    type: "qa",
    year: 2025,
    tech: ["Playwright", "TypeScript", "CI"],
    tags: [
      "project.qa-automation-playwright.tags.testing",
      "project.qa-automation-playwright.tags.api",
      "project.qa-automation-playwright.tags.ui",
    ],
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
