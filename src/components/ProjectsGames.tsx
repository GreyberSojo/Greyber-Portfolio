// src/components/ProjectsGames.tsx
"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROJECTS, type Project } from "@/data/projects";

/** Blur tiny placeholder para <Image> */
const BLUR = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNTAwJyBoZWlnaHQ9JzI4MCcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJz48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWxsPScjMjIyJy8+PC9zdmc+";

/* ---------- MODO SIMPLE (0–4 proyectos) ---------- */
function SimpleGrid({ items }: { items: readonly Project[] }) {
  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto text-center rounded-2xl border border-border bg-foreground/[.02] p-10">
        <h3 className="text-xl font-semibold mb-2">Aún no hay proyectos</h3>
        <p className="text-foreground/70 mb-6">
          Estoy construyendo cosas nuevas. Vuelve pronto o mira mi GitHub.
        </p>
        <div className="flex gap-3 justify-center">
          <a href="https://github.com/greyber" target="_blank" rel="noopener noreferrer">
            <Button variant="outline">Ir a GitHub</Button>
          </a>
          <Link href="#contact">
            <Button>Contactar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
      {items.map((p) => (
        <Card
          key={p.slug}
          className="overflow-hidden hover:shadow-lg transition-shadow"
          style={{
            borderColor: "color-mix(in oklab, var(--primary) 12%, var(--border))",
          }}
        >
          <div className="relative aspect-[16/9] bg-foreground/[.03]">
            {p.cover.type === "image" ? (
              <Image
                src={p.cover.src}
                alt={p.title}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              // Si es video, mostramos el poster (evita peso extra en un portfolio pequeño)
              <Image
                src={p.cover.poster ?? "/covers/fallback.webp"}
                alt={p.title}
                fill
                className="object-cover"
                placeholder="blur"
                blurDataURL={BLUR}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}
            <div
              className="absolute left-2 top-2 text-[11px] px-2 py-0.5 rounded-full border"
              style={{
                background: "color-mix(in oklab, var(--foreground) 7%, var(--background))",
                borderColor: "var(--border)",
              }}
            >
              {p.type.toUpperCase()} • {p.year}
            </div>
          </div>

          <CardHeader className="pb-2">
            <CardTitle className="text-base md:text-lg">{p.title}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-foreground/70 line-clamp-2">{p.summary}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              {p.tech.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded-full border"
                  style={{
                    background: "color-mix(in oklab, var(--foreground) 4%, var(--background))",
                    borderColor: "var(--border)",
                  }}
                >
                  {t}
                </span>
              ))}
              {p.tech.length > 3 && (
                <span className="text-[11px] px-2 py-0.5 rounded-full border border-transparent text-foreground/50">
                  +{p.tech.length - 3}
                </span>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              {p.demo && (
                <Link href={p.demo} target={p.demo.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                  <Button size="sm">Demo</Button>
                </Link>
              )}
              {p.repo && (
                <a href={p.repo} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" variant="outline">Repo</Button>
                </a>
              )}
              {p.caseStudy && (
                <Link href={p.caseStudy}>
                  <Button size="sm" variant="secondary">Caso de estudio</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ---------- MODO AVANZADO (5+ proyectos) ----------
   Reusa tu UI actual pero MUY resumida: filtros básicos + grid. */
function AdvancedGrid({ items }: { items: readonly Project[] }) {
  // Orden por año desc (sencillo y útil)
  const ordered = useMemo(() => [...items].sort((a, b) => b.year - a.year), [items]);

  return (
    <>
      <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-10">
        Explora todos mis proyectos. Puedes ver más detalles en cada tarjeta.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {ordered.map((p) => (
          <Card
            key={p.slug}
            className="overflow-hidden hover:shadow-lg transition-shadow"
            style={{ borderColor: "color-mix(in oklab, var(--primary) 12%, var(--border))" }}
          >
            <div className="relative aspect-[16/9] bg-foreground/[.03]">
              {p.cover.type === "image" ? (
                <Image
                  src={p.cover.src}
                  alt={p.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              ) : (
                <Image
                  src={p.cover.poster ?? "/covers/fallback.webp"}
                  alt={p.title}
                  fill
                  className="object-cover"
                  placeholder="blur"
                  blurDataURL={BLUR}
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              )}
            </div>

            <CardHeader className="pb-2">
              <CardTitle className="text-base md:text-lg">{p.title}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-foreground/70 line-clamp-2">{p.summary}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {p.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full border"
                    style={{
                      borderColor: "color-mix(in oklab, var(--primary) 35%, var(--border))",
                      background: "color-mix(in oklab, var(--primary) 6%, var(--background))",
                      color: "color-mix(in oklab, var(--primary) 85%, var(--foreground))",
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                {p.demo && (
                  <Link href={p.demo} target={p.demo.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
                    <Button size="sm">Demo</Button>
                  </Link>
                )}
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline">Repo</Button>
                  </a>
                )}
                {p.caseStudy && (
                  <Link href={p.caseStudy}>
                    <Button size="sm" variant="secondary">Caso</Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

/* ---------- Componente principal adaptativo ---------- */
export default function ProjectsGames() {
  const count = PROJECTS.length;
  const simpleMode = count <= 4;

  const schema = useMemo(() => {
    const items = PROJECTS.map((p) => ({
      "@context": "https://schema.org",
      "@type": p.type === "game" ? "VideoGame" : "CreativeWork",
      name: p.title,
      description: p.summary,
      url: p.caseStudy || p.demo || "/",
      inLanguage: "es",
      dateCreated: `${p.year}-01-01`,
      keywords: [...p.tech, ...p.tags].join(", "),
    }));
    return JSON.stringify(items);
  }, []);

  return (
    <section id="game-dev" className="w-full bg-background text-foreground py-16 px-6" aria-labelledby="projects-heading">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
      <motion.h2
        id="projects-heading"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="text-3xl md:text-4xl font-bold mb-3 text-center"
      >
        Proyectos
      </motion.h2>

      {simpleMode ? (
        <>
          <p className="text-center text-foreground/70 max-w-xl mx-auto mb-10">
            Un vistazo rápido a lo que estoy construyendo.
          </p>
          <SimpleGrid items={[...PROJECTS]} />
          {/* CTA global visible solo si hay proyectos */}
          {PROJECTS.length > 0 && (
            <div className="mt-10 flex items-center justify-center gap-3">
              <a href="https://github.com/greyber" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">Ver GitHub</Button>
              </a>
              <Link href="#contact">
                <Button>Hablemos</Button>
              </Link>
            </div>
          )}
        </>
      ) : (
        <AdvancedGrid items={[...PROJECTS]} />
      )}
    </section>
  );
}
