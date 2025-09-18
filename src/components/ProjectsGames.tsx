// src/components/ProjectsGames.tsx (improved)
"use client";

import { AnimatePresence,motion } from "framer-motion";
import { Github,X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef,useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import ProjectCard, { type ProjectCardData } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { type Media,type Project, PROJECTS } from "@/data/projects";

// ---- Types & constants ----
export type ProjectType = "game" | "web" | "tool" | "qa";
type Mode = "simple" | "advanced";

type SortValue = "recent" | "oldest" | "az" | "stars";

const TYPES: { label: string; value: ProjectType | "all" }[] = [
  { label: "Todos", value: "all" },
  { label: "Juegos", value: "game" },
  { label: "Web", value: "web" },
  { label: "Herramientas", value: "tool" },
  { label: "QA", value: "qa" },
];

const SORTS: { label: string; value: SortValue }[] = [
  { label: "Más recientes", value: "recent" },
  { label: "Más antiguos", value: "oldest" },
  { label: "A–Z", value: "az" },
];

// (blur placeholder constant removed as unused)

// ---- Utils ----
const track = (event: string, data?: Record<string, unknown>) =>
  console.log(`[analytics] ${event}`, data);

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

// ---- Filtros ----
function FiltersBar({
  search,
  setSearch,
  selectedType,
  setSelectedType,
  allTags,
  selectedTags,
  toggleTag,
  sort,
  setSort,
}: {
  search: string;
  setSearch: (v: string) => void;
  selectedType: ProjectType | "all";
  setSelectedType: (t: ProjectType | "all") => void;
  allTags: string[];
  selectedTags: string[];
  toggleTag: (t: string) => void;
  sort: SortValue;
  setSort: (s: SortValue) => void;
}) {
  return (
    <div className="max-w-6xl mx-auto mb-8 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por título o tecnología"
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Buscar proyectos"
        />

        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const active = selectedType === t.value;
            return (
              <button
                key={t.value}
                onClick={() => setSelectedType(t.value)}
                className={`px-3 py-2 rounded-xl text-sm border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-foreground/[.03] border-border hover:bg-foreground/[.06]"
                }`}
                aria-pressed={active}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortValue)}
          className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Ordenar proyectos"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-foreground/[.03] border-border hover:bg-foreground/[.06]"
              }`}
              aria-pressed={active}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- Media component (image / gif / video) ----
function ProjectMedia({ project }: { project: Project }) {
  const medias = Array.isArray(project.cover) ? project.cover : [project.cover];
  const [index, setIndex] = useState(0);

  const current = medias[index];

  return (
    <div className="relative aspect-[16/9] bg-muted">
      {current.type === "video" ? (
        <video
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={current.src}
          src={current.src}
        />
      ) : (
        <Image
          src={current.src}
          alt={project.title}
          fill
          className="object-cover"
        />
      )}

      {/* Botones next/prev si hay varias */}
      {medias.length > 1 && (
        <div className="absolute inset-0 flex justify-between items-center px-2">
          <button
            onClick={() => setIndex((i) => (i - 1 + medias.length) % medias.length)}
            className="bg-black/50 text-white px-2 py-1 rounded-full"
          >
            <FaArrowLeft aria-hidden />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % medias.length)}
            className="bg-black/50 text-white px-2 py-1 rounded-full"
          >
            <FaArrowRight aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}


// ---- Modal de vista rápida ----
function QuickViewModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const reduce = usePrefersReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (project && closeBtnRef.current) closeBtnRef.current.focus();
  }, [project]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={`Vista rápida de ${project.title}`}
      >
        <motion.div
          initial={{ y: reduce ? 0 : 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 20, opacity: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
          className="w-full max-w-3xl bg-background rounded-2xl overflow-hidden border border-border shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-[16/9] bg-muted">
            <ProjectMedia project={project} />
            <div className="absolute left-2 top-2 text-xs px-2 py-1 rounded-full bg-black/50 text-white">
              {project.type.toUpperCase()} • {project.year}
            </div>
            <button
              ref={closeBtnRef}
              aria-label="Cerrar"
              className="absolute right-2 top-2 inline-flex items-center gap-2 rounded-full bg-black/50 text-white px-2 py-1 text-xs hover:bg-black/60"
              onClick={onClose}
            >
              <X className="h-4 w-4" /> Cerrar
            </button>
          </div>

          <div className="p-4 md:p-6 flex flex-col gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold flex items-center gap-2">
                {project.title}
                {project.status && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-foreground/[.03]">
                    {project.status}
                  </span>
                )}
              </h3>
              {project.summary && (
                <p className="mt-1 text-sm text-foreground/70">{project.summary}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {project.tech?.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-1 rounded-full border border-border bg-foreground/[.03]"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {project.repo && (
                <Link href={project.repo} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="secondary" className="inline-flex gap-2">
                    <Github className="h-4 w-4" /> Repo
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function toCardCover(cover: Media | Media[] | undefined): ProjectCardData["cover"] {
  if (!cover) {
    // opcional: un fallback genérico
    return { src: "/placeholder.png", type: "image" } as const;
  }
  const m = Array.isArray(cover) ? cover[0] : cover;
  // Asegurate de que m tiene shape compatible con ProjectCardCover
  return { src: m.src, type: m.type, poster: m.poster } as const;
}

// ---- Grilla simple ----
function SimpleGrid({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  const cards: ProjectCardData[] = useMemo(
    () =>
      items.map((p) => ({
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        year: p.year,
        type: p.type,
        tech: p.tech,
        tags: p.tags,
        cover: toCardCover(p.cover),
        repo: p.repo,
        status: p.status,
        metrics: p.metrics,
      })),
    [items]
  );
  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {cards.map((p) => {
        const full = items.find((f) => f.slug === p.slug)!;
        return <ProjectCard key={p.slug} project={p} onOpen={() => onOpen(full)} />;
      })}
    </div>
  );
}

// ---- Grilla avanzada ----
function AdvancedGrid({
  filtered,
  search,
  setSearch,
  selectedType,
  setSelectedType,
  allTags,
  selectedTags,
  toggleTag,
  sort,
  setSort,
  onOpen,
}: {
  filtered: Project[];
  search: string;
  setSearch: (v: string) => void;
  selectedType: ProjectType | "all";
  setSelectedType: (t: ProjectType | "all") => void;
  allTags: string[];
  selectedTags: string[];
  toggleTag: (t: string) => void;
  sort: SortValue;
  setSort: (s: SortValue) => void;
  onOpen: (p: Project) => void;
}) {
  const cards: ProjectCardData[] = useMemo(
    () =>
      filtered.map((p) => ({
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        year: p.year,
        type: p.type,
        tech: p.tech,
        tags: p.tags,
        cover: toCardCover(p.cover),
        repo: p.repo,
        status: p.status,
        metrics: p.metrics,
      })),
    [filtered]
  );
  
  return (
    <>
      <FiltersBar
        search={search}
        setSearch={setSearch}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        allTags={allTags}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        sort={sort}
        setSort={setSort}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {cards.map((p) => {
          const full = filtered.find((f) => f.slug === p.slug)!;
          return <ProjectCard key={p.slug} project={p} onOpen={() => onOpen(full)} />;
        })}
      </div>
    </>
  );
}

// ---- Principal con botón toggle ----
export default function ProjectsGames() {
  const reduce = usePrefersReducedMotion();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<Mode>("simple");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ProjectType | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortValue>("recent");
  const [active, setActive] = useState<Project | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(PROJECTS.flatMap((p) => p.tags))).sort(),
    []
  );

  const toggleTag = useCallback(
    (t: string) =>
      setSelectedTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])),
    []
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = PROJECTS.filter((p) => {
      const matchType = selectedType === "all" || p.type === selectedType;
      const matchTags = selectedTags.length === 0 || selectedTags.every((t) => p.tags.includes(t));
      const matchSearch =
        !term ||
        p.title.toLowerCase().includes(term) ||
        p.summary.toLowerCase().includes(term) ||
        p.tech.some((t) => t.toLowerCase().includes(term));
      return matchType && matchTags && matchSearch;
    });
    switch (sort) {
      case "recent":
        list = list.sort((a, b) => b.year - a.year);
        break;
      case "oldest":
        list = list.sort((a, b) => a.year - b.year);
        break; 
      case "az":
        list = list.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return list;
  }, [search, selectedType, selectedTags, sort]);

  // Deep-link: ?project=slug to open modal directly
  useEffect(() => {
    const slug = searchParams?.get("project");
    if (!slug || active) return;
    const p = PROJECTS.find((x) => x.slug === slug);
    if (p) setActive(p);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const openProject = useCallback((p: Project) => {
    setActive(p);
    const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    params.set("project", p.slug);
    router.push(`?${params.toString()}`, { scroll: false });
    track("open_project", { slug: p.slug });
  }, [router, searchParams]);

  const closeProject = useCallback(() => {
    setActive(null);
    const params = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    params.delete("project");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  return (
    <section className="w-full bg-background text-foreground py-16 px-6">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={reduce ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-3 text-center"
      >
        Proyectos (Games • Web • QA)
      </motion.h2>

      <p className="text-center text-sm text-foreground/70 max-w-2xl mx-auto mb-6">
        Explora mis proyectos. Haz clic en cualquier tarjeta para una vista rápida con video/imagen,
        una breve descripción y accesos directos a la demo y el repositorio.
      </p>

      <div className="text-center mb-8">
        <Button
          variant="outline"
          onClick={() => setMode(mode === "simple" ? "advanced" : "simple")}
        >
          Cambiar a {mode === "simple" ? "Avanzado" : "Simple"}
        </Button>
      </div>

      {mode === "advanced" ? (
        <AdvancedGrid
          filtered={filtered}
          search={search}
          setSearch={setSearch}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          allTags={allTags}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          sort={sort}
          setSort={setSort}
          onOpen={openProject}
        />
      ) : (
        <SimpleGrid items={[...PROJECTS]} onOpen={openProject} />
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="https://github.com/GreyberSojo?tab=repositories" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="inline-flex gap-2">
            <Github className="h-4 w-4" /> Ver todo en GitHub
          </Button>
        </Link>
      </div>

      <QuickViewModal project={active} onClose={closeProject} />
    </section>
  );
}
