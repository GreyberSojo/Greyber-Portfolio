// src/components/ProjectsGames.tsx
"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProjectCard, { type ProjectCardData } from "@/components/ProjectCard";
import { PROJECTS, type Project } from "@/data/projects";
import { useTranslations } from "@/lib/i18n";

// ---- Types & constants ----
export type ProjectType = "game" | "web" | "tool" | "qa";
type Mode = "simple" | "advanced";

const TYPES: { value: ProjectType | "all" }[] = [
  { value: "all" },
  { value: "game" },
  { value: "web" },
  { value: "tool" },
  { value: "qa" },
];

const SORTS = [
  { value: "recent" },
  { value: "oldest" },
  { value: "az" },
  { value: "stars" },
] as const;

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzI4MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjMjIyJy8+PC9zdmc+";

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
  sort: typeof SORTS[number]["value"];
  setSort: (s: typeof SORTS[number]["value"]) => void;
}) {
  const t = useTranslations("projectsGames");
  return (
    <div className="max-w-6xl mx-auto mb-8 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={t("searchAria")}
        />

        <div className="flex flex-wrap gap-2">
          {TYPES.map((tp) => {
            const active = selectedType === tp.value;
            return (
              <button
                key={tp.value}
                onClick={() => setSelectedType(tp.value)}
                className={`px-3 py-2 rounded-xl text-sm border transition ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-foreground/[.03] border-border hover:bg-foreground/[.06]"
                }`}
                aria-pressed={active}
              >
                {t(`types.${tp.value}`)}
              </button>
            );
          })}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={t("sortAria")}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {t(`sorts.${s.value}`)}
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

// ---- Modal de vista rápida ----
function QuickViewModal({
  project,
  onClose,
}: {
  project: Project | null;
  onClose: () => void;
}) {
  const reduce = usePrefersReducedMotion();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      >
        <motion.div
          initial={{ y: reduce ? 0 : 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: reduce ? 0 : 20, opacity: 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
          className="w-full max-w-3xl bg-background rounded-2xl overflow-hidden border border-border shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-[16/9] bg-background">
            <Image
              src={project.cover.src}
              alt={project.title}
              fill
              className="object-cover"
              placeholder="blur"
              blurDataURL={BLUR_DATA_URL}
            />
            <div className="absolute left-2 top-2 text-xs px-2 py-1 rounded-full bg-black/50 text-white">
              {project.type.toUpperCase()} • {project.year}
            </div>
          </div>
          <div className="p-4 md:p-6 flex flex-col gap-3">
            <h3 className="text-xl md:text-2xl font-semibold">{project.title}</h3>
            <p className="text-sm text-foreground/70">{project.summary}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ---- Grilla simple ----
function SimpleGrid({ items }: { items: Project[] }) {
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
        cover: p.cover,
        demo: p.demo,
        repo: p.repo,
        caseStudy: p.caseStudy,
        status: p.status,
        metrics: p.metrics,
      })),
    [items]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {cards.map((p) => (
        <ProjectCard key={p.slug} project={p} onOpen={() => {}} />
      ))}
    </div>
  );
}

// ---- Grilla avanzada ----
function AdvancedGrid({
  items,
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
  items: Project[];
  filtered: Project[];
  search: string;
  setSearch: (v: string) => void;
  selectedType: ProjectType | "all";
  setSelectedType: (t: ProjectType | "all") => void;
  allTags: string[];
  selectedTags: string[];
  toggleTag: (t: string) => void;
  sort: typeof SORTS[number]["value"];
  setSort: (s: typeof SORTS[number]["value"]) => void;
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
        cover: p.cover,
        demo: p.demo,
        repo: p.repo,
        caseStudy: p.caseStudy,
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
  const t = useTranslations("projectsGames");
  const reduce = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>("simple");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ProjectType | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sort, setSort] = useState<(typeof SORTS)[number]["value"]>("recent");
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
      case "stars":
        list = list.sort((a, b) => (b.metrics?.stars ?? 0) - (a.metrics?.stars ?? 0));
        break;
    }
    return list;
  }, [search, selectedType, selectedTags, sort]);

  return (
    <section className="w-full bg-background text-foreground py-16 px-6">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 20 }}
        whileInView={reduce ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-bold mb-3 text-center"
      >
        {t("heading")}
      </motion.h2>

      <div className="text-center mb-8">
        <Button
          variant="outline"
          onClick={() => setMode(mode === "simple" ? "advanced" : "simple")}
        >
          {t("toggle", { mode: t(`modeNames.${mode === "simple" ? "advanced" : "simple"}`) })}
        </Button>
      </div>

      {mode === "advanced" ? (
        <AdvancedGrid
          items={[...PROJECTS]}
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
          onOpen={(p) => setActive(p)}
        />
      ) : (
        <SimpleGrid items={[...PROJECTS]} />
      )}

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a href="https://github.com/greyber" target="_blank" rel="noopener noreferrer">
          <Button variant="outline">{t("github")}</Button>
        </a>
      </div>

      <QuickViewModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
