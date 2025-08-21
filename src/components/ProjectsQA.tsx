"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent,
  KeyboardEvent,
} from "react";
import {
  motion,
  MotionValue,
  useAnimationFrame,
  useInView,
  useMotionValue,
} from "framer-motion";
import {
  FaRobot,
  FaCode,
  FaClipboardList,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBug,
  FaCheckCircle,
  FaStopwatch,
  FaLayerGroup,
} from "react-icons/fa";
import { SiPostman, SiTypescript, SiJavascript } from "react-icons/si";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";

// ------------------------------
// HOOKS
// ------------------------------
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

// ------------------------------
// TIPOS
// ------------------------------
type ProjectLevel = "Smoke" | "Regression" | "E2E";
type ProjectStatus = "passed" | "failed";
type ProjectType = "Automation" | "Manual" | "API";

type Project = {
  title: string;
  description: string;
  icon: React.ReactNode;
  details: string[];
  code?: string;
  steps?: string[];
  expected?: string;
  gif?: string;
  demoUrl?: string;
  tech: string[];
  type: ProjectType;
  accent: string; // hex ej: "#3b82f6" (solo para glow suave)
  metrics: {
    durationSec: number;
    status: ProjectStatus;
    level: ProjectLevel;
  };
};

// ------------------------------
// DATA (mock)
// ------------------------------
export const projects: Project[] = [
  {
    title: "Login Exitoso - Playwright",
    description:
      "Automatización que valida un login exitoso usando credenciales válidas en Playwright con TypeScript.",
    icon: <FaRobot className="text-primary text-2xl" />,
    details: [
      "📄 Escenario en Gherkin",
      "🤖 Código real TypeScript",
      "✅ Valida encabezado 'Bienvenido'",
    ],
    expected: "Usuario autenticado y encabezado 'Bienvenido' visible.",
    code: `import { test, expect } from '@playwright/test';

test('Login exitoso con credenciales válidas', async ({ page }) => {
  await page.goto('https://example.com/login');
  await page.fill('input[name="email"]', 'user@test.com');
  await page.fill('input[name="password"]', 'Password123');
  await page.click('button[type="submit"]');
  await expect(page.locator('h1')).toHaveText('Bienvenido');
});`,
    gif: "/playwright-demo.gif",
    demoUrl: "https://stackblitz.com/edit/playwright-demo",
    tech: ["Playwright", "TypeScript", "QA Automation"],
    type: "Automation",
    accent: "#06b6d4",
    metrics: { durationSec: 6, status: "passed", level: "Smoke" },
  },
  {
    title: "Login Fallido - Manual",
    description:
      "Caso de prueba manual que valida que se muestre el mensaje de error al ingresar credenciales inválidas.",
    icon: <FaClipboardList className="text-primary text-2xl" />,
    details: [
      "📄 TC-002: Usuario inválido",
      "🔑 Contraseña: `ClaveIncorrecta`",
      "❌ Mensaje 'Credenciales inválidas'",
    ],
    expected:
      "Mensaje de error 'Credenciales inválidas' mostrado bajo el formulario.",
    steps: [
      "Scenario: Login fallido con credenciales inválidas",
      "Given el usuario está en la página de login",
      "When ingresa email 'user@test.com' y contraseña 'ClaveIncorrecta'",
      "And hace clic en 'Login'",
      "Then debería ver un error 'Credenciales inválidas'",
    ],
    tech: ["Manual Testing", "Gherkin", "QA Documentation"],
    type: "Manual",
    accent: "#22c55e",
    metrics: { durationSec: 15, status: "passed", level: "Regression" },
  },
  {
    title: "API Login - Postman",
    description:
      "Automatización de login vía API usando Postman; verifica código 200 y el mensaje de bienvenida.",
    icon: <FaCode className="text-primary text-2xl" />,
    details: [
      "📄 Test en colección Postman",
      "🔑 POST con credenciales válidas",
      "✅ Verifica 200 + mensaje",
    ],
    expected: "Respuesta 200 y body con { message: 'Bienvenido' }.",
    code: `POST https://example.com/api/login
Headers:
  Content-Type: application/json
Body:
{
  "email": "user@test.com",
  "password": "Password123"
}

Tests (Postman):
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});
pm.test("Response has welcome message", function () {
  pm.expect(pm.response.json().message).to.eql("Bienvenido");
});`,
    demoUrl: "https://www.postman.com/",
    tech: ["Postman", "API Testing", "JavaScript"],
    type: "API",
    accent: "#a855f7",
    metrics: { durationSec: 2, status: "passed", level: "Smoke" },
  },
];

// ------------------------------
// UTILS
// ------------------------------
const GAP_PX = 24;
const DUPLICATES = 2;

function hexToRgba(hex: string, alpha = 0.25) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function secondsToHuman(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

function TechIcon({ name }: { name: string }) {
  const base = "inline-block align-middle mr-1";
  if (/playwright/i.test(name)) return <FaRobot className={base} title="Playwright" />;
  if (/postman/i.test(name)) return <SiPostman className={base} title="Postman" />;
  if (/typescript/i.test(name)) return <SiTypescript className={base} title="TypeScript" />;
  if (/javascript/i.test(name)) return <SiJavascript className={base} title="JavaScript" />;
  if (/gherkin|documentation/i.test(name)) return <FaCheckCircle className={base} />;
  if (/automation|api|manual/i.test(name)) return <FaLayerGroup className={base} />;
  return <FaBug className={base} />;
}

// ------------------------------
// HOOK: carrusel infinito reutilizable
// ------------------------------
function useInfiniteCarousel({
  baseSpeed = 180,
  pauseWhenOutOfView = true,
}: {
  baseSpeed?: number; // px/s
  pauseWhenOutOfView?: boolean;
}) {
  const x: MotionValue<number> = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const [speedFactor, setSpeedFactor] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { margin: "-10% 0px -10% 0px" });
  const prefersReduced = usePrefersReducedMotion();

  const [itemWidth, setItemWidth] = useState<number>(360);
  const [visibleWidth, setVisibleWidth] = useState<number>(0);

  const measure = useCallback(() => {
    if (itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      setItemWidth(rect.width);
    }
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setVisibleWidth(rect.width);
    }
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(() => measure());
    if (containerRef.current) ro.observe(containerRef.current);
    if (itemRef.current) ro.observe(itemRef.current);
    return () => ro.disconnect();
  }, [measure]);

  useAnimationFrame((_t, delta) => {
    const shouldPause = paused || (pauseWhenOutOfView && !inView) || prefersReduced;
    if (shouldPause) return;
    const pxPerMs = (baseSpeed * speedFactor) / 1000;
    const next = x.get() - delta * pxPerMs;
    x.set(next);
  });

  return {
    x,
    paused,
    setPaused,
    speedFactor,
    setSpeedFactor,
    containerRef,
    itemRef,
    itemWidth,
    visibleWidth,
    shiftByItems: (n: number) => {
      x.set(x.get() - n * (itemWidth + GAP_PX));
    },
    resetIfNeeded: (contentLength: number) => {
      const loopWidth = contentLength * (itemWidth + GAP_PX);
      if (Math.abs(x.get()) >= loopWidth) x.set(0);
    },
    prefersReduced,
  };
}

// ------------------------------
// COMPONENTE
// ------------------------------
export default function ProjectsQA() {
  const t = useTranslations("projectsQA");
  const [filter, setFilter] = useState<"All" | ProjectType>("All");
  const [timeline, setTimeline] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (filter === "All") return projects;
    return projects.filter((p) => p.type === filter);
  }, [filter]);

  const {
    x,
    setPaused,
    speedFactor,
    setSpeedFactor,
    containerRef,
    itemRef,
    itemWidth,
    shiftByItems,
    resetIfNeeded,
    prefersReduced,
  } = useInfiniteCarousel({ baseSpeed: 80 });

  const contentLength = filtered.length;
  const loopWidth = contentLength * (itemWidth + GAP_PX);
  const totalLoopWidth = loopWidth * DUPLICATES;

  useAnimationFrame(() => {
    resetIfNeeded(contentLength);
    const raw = Math.abs(x.get()) / (itemWidth + GAP_PX);
    const idx = Math.floor(raw) % (contentLength || 1);
    if (idx !== activeIndex) setActiveIndex(idx);
  });

  const handlePrev = () => shiftByItems(-1);
  const handleNext = () => shiftByItems(1);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      handlePrev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      handleNext();
    }
  };

  const progress =
    totalLoopWidth > 0 ? (Math.abs(x.get() % totalLoopWidth) / totalLoopWidth) * 100 : 0;

  const onDragStart = () => setPaused(true);
  const onDragEnd = () => setPaused(false);

  // tilt (pausado si reduceMotion)
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const onCardMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 10;
    const rx = -(py - 0.5) * 10;
    setTilt({ rx, ry });
  };
  const onCardMouseLeave = () => setTilt({ rx: 0, ry: 0 });

  const renderTimeline = () => (
    <div className="relative">
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-muted" />
      <div className="grid md:grid-cols-3 gap-8 relative">
        {filtered.map((p, i) => (
          <div key={`timeline-${p.title}-${i}`} className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-3 h-3 rounded-full bg-primary shadow" />
            <Card
              className="shadow-lg hover:shadow-xl transition-all duration-300"
              style={{ boxShadow: `0 12px 30px ${hexToRgba(p.accent, 0.2)}` }}
            >
              <CardHeader className="flex items-center gap-3">
                {p.icon}
                <CardTitle className="text-lg font-semibold">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectMeta p={p} />
                <p className="text-sm text-muted-foreground mb-4">{p.description}</p>
                <TechBadges tech={p.tech} />
                <div className="mt-4 flex items-center gap-2">
                  {p.demoUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a href={p.demoUrl} target="_blank" rel="noreferrer">
                        Ver demo <FaExternalLinkAlt className="ml-2" />
                      </a>
                    </Button>
                  )}
                  <Button size="sm" onClick={() => setOpenIndex(i)}>
                    Ver detalles
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );

  const items = useMemo(() => {
    const base = filtered.map((p, idx) => ({ p, key: `${p.title}-${idx}` }));
    const dup: { p: Project; key: string }[] = [];
    for (let d = 0; d < DUPLICATES; d++) {
      dup.push(...base.map((b, i) => ({ ...b, key: `${b.key}-dup-${d}-${i}` })));
    }
    return dup;
  }, [filtered]);

  const statusText = useMemo(() => {
    const curr = filtered[activeIndex];
    if (!curr) return "";
    return `Proyecto ${activeIndex + 1} de ${filtered.length}: ${curr.title}`;
  }, [activeIndex, filtered]);

  return (
    <section id="projects" className="py-20 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold">{t("heading")}</h2>

          {/* Filtros */}
          <div className="flex items-center gap-2">
            {(["All", "Automation", "Manual", "API"] as const).map((f, i) => (
              <Button
                key={f}
                size="sm"
                variant={filter === f ? "default" : "outline"}
                onClick={() => setFilter(f)}
              >
                {(t("filters") as string[])[i]}
              </Button>
            ))}
          </div>
        </div>

        {/* Controles globales */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {/* velocidad */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t("speed")}</span>
            <div className="flex rounded-md overflow-hidden border border-border">
              {[0.5, 1, 2].map((sf) => (
                <button
                  key={sf}
                  onClick={() => setSpeedFactor(sf)}
                  className={`px-3 py-1 text-sm ${
                    speedFactor === sf ? "bg-primary text-primary-foreground" : "bg-background"
                  }`}
                  aria-label={t("speedAria", { value: String(sf) })}
                >
                  {sf}x
                </button>
              ))}
            </div>
          </div>

          {/* Timeline toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Timeline</span>
            <Switch checked={timeline} onCheckedChange={setTimeline} />
          </div>

          {/* Progress */}
          {!timeline && (
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-[width]"
                style={{ width: `${progress}%` }}
                aria-hidden
              />
            </div>
          )}
        </div>

        {/* Estado live */}
        <div className="sr-only" aria-live="polite">
          {statusText}
        </div>

        {/* TIMELINE / CARRUSEL */}
        {timeline ? (
          renderTimeline()
        ) : (
          <>
            <div
              className="relative overflow-hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="Carrusel de proyectos QA"
              tabIndex={0}
              onKeyDown={onKeyDown}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              ref={containerRef}
            >
              {/* Flechas */}
              <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between z-20">
                <div className="pointer-events-auto pl-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Anterior"
                    onClick={handlePrev}
                  >
                    <FaChevronLeft />
                  </Button>
                </div>
                <div className="pointer-events-auto pr-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    aria-label="Siguiente"
                    onClick={handleNext}
                  >
                    <FaChevronRight />
                  </Button>
                </div>
              </div>

              {/* Difuminado bordes basado en tema */}
              <div className="absolute top-0 left-0 w-16 h-full z-10 pointer-events-none bg-gradient-to-r from-background" />
              <div className="absolute top-0 right-0 w-16 h-full z-10 pointer-events-none bg-gradient-to-l from-background" />

              {/* TRACK */}
              <motion.div
                style={{ x }}
                className="flex gap-6 whitespace-nowrap py-2"
                onHoverStart={() => setPaused(true)}
                onHoverEnd={() => setPaused(false)}
                drag="x"
                dragMomentum={false}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
              >
                {items.map(({ p, key }, idx) => (
                  <motion.div
                    key={key}
                    className="min-w-[340px] sm:min-w-[360px] md:min-w-[380px] lg:min-w-[400px] flex-shrink-0 will-change-transform"
                    ref={idx === 0 ? itemRef : undefined}
                    style={{
                      perspective: 1000,
                      transformStyle: "preserve-3d",
                    }}
                    onMouseMove={onCardMouseMove}
                    onMouseLeave={onCardMouseLeave}
                  >
                    <motion.div
                      style={{
                        rotateX: tilt.rx,
                        rotateY: tilt.ry,
                        transformStyle: "preserve-3d",
                      }}
                    >
                      <Card
                        className="shadow-lg border hover:shadow-xl transition-all duration-300 bg-card text-card-foreground"
                        style={{
                          boxShadow: `0 12px 30px ${hexToRgba(p.accent, 0.22)}`,
                        }}
                      >
                        <CardHeader className="flex items-center gap-3">
                          {p.icon}
                          <CardTitle className="text-lg font-semibold">{p.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ProjectMeta p={p} />

                          <p className="text-sm text-muted-foreground mb-4">{p.description}</p>

                          <TechBadges tech={p.tech} />

                          {/* Tabs */}
                          <div className="mt-4">
                            <Tabs defaultValue={p.code ? "code" : p.steps ? "steps" : "expected"}>
                              <TabsList>
                                {p.code && <TabsTrigger value="code">Código</TabsTrigger>}
                                {p.steps && <TabsTrigger value="steps">Pasos</TabsTrigger>}
                                {p.expected && <TabsTrigger value="expected">Esperado</TabsTrigger>}
                              </TabsList>
                              {p.code && (
                                <TabsContent value="code">
                                  <CodeBlock code={p.code} />
                                </TabsContent>
                              )}
                              {p.steps && (
                                <TabsContent value="steps">
                                  <ul className="list-disc list-inside text-sm p-2 rounded-md bg-muted">
                                    {p.steps.map((s, i) => (
                                      <li key={`${p.title}-step-${i}`}>{s}</li>
                                    ))}
                                  </ul>
                                </TabsContent>
                              )}
                              {p.expected && (
                                <TabsContent value="expected">
                                  <div className="text-sm p-3 rounded-md border"
                                       style={{
                                         background:
                                           "color-mix(in oklab, var(--primary) 8%, var(--background))",
                                         borderColor:
                                           "color-mix(in oklab, var(--primary) 22%, var(--border))",
                                       }}
                                  >
                                    {p.expected}
                                  </div>
                                </TabsContent>
                              )}
                            </Tabs>
                          </div>

                          {/* Acciones */}
                          <div className="mt-4 flex items-center gap-2">
                            {p.demoUrl && (
                              <Button asChild variant="outline" size="sm">
                                <a href={p.demoUrl} target="_blank" rel="noreferrer">
                                  Ver demo <FaExternalLinkAlt className="ml-2" />
                                </a>
                              </Button>
                            )}
                            <Button size="sm" onClick={() => setOpenIndex(idx % contentLength)}>
                              Ver detalles
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Dots */}
              <div className="mt-6 flex justify-center gap-2">
                {filtered.map((p, i) => (
                  <button
                    key={`dot-${p.title}-${i}`}
                    onClick={() => {
                      const current = Math.floor(Math.abs(x.get()) / (itemWidth + GAP_PX));
                      const delta = i - (current % contentLength);
                      shiftByItems(delta);
                    }}
                    aria-label={`Ir a ${p.title}`}
                    className={`h-2.5 rounded-full transition-all ${
                      activeIndex === i
                        ? "w-6 bg-primary"
                        : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Modal Detalle */}
        <Dialog open={openIndex !== null} onOpenChange={(v) => !v && setOpenIndex(null)}>
          <DialogContent className="max-w-1xl w-full flex flex-col overflow-hidden rounded-2xl shadow-xl">
            {openIndex !== null && filtered[openIndex] && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {filtered[openIndex].icon}
                    {filtered[openIndex].title}
                  </DialogTitle>
                  <DialogDescription>{filtered[openIndex].description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <ProjectMeta p={filtered[openIndex]} compact />
                  <GifWithSkeleton src={filtered[openIndex].gif} />

                  <Tabs
                    defaultValue={
                      filtered[openIndex].code
                        ? "code"
                        : filtered[openIndex].steps
                        ? "steps"
                        : "expected"
                    }
                  >
                    <TabsList className="mb-2">
                      {filtered[openIndex].code && <TabsTrigger value="code">Código</TabsTrigger>}
                      {filtered[openIndex].steps && <TabsTrigger value="steps">Pasos</TabsTrigger>}
                      {filtered[openIndex].expected && (
                        <TabsTrigger value="expected">Esperado</TabsTrigger>
                      )}
                      <TabsTrigger value="details">Detalles</TabsTrigger>
                    </TabsList>

                    {filtered[openIndex].code && (
                      <TabsContent value="code">
                        <CodeBlock code={filtered[openIndex].code!} />
                      </TabsContent>
                    )}

                    {filtered[openIndex].steps && (
                      <TabsContent value="steps">
                        <ul className="list-disc list-inside text-sm p-3 rounded-md bg-muted">
                          {filtered[openIndex].steps!.map((s, i) => (
                            <li key={`modal-step-${i}`}>{s}</li>
                          ))}
                        </ul>
                      </TabsContent>
                    )}

                    {filtered[openIndex].expected && (
                      <TabsContent value="expected">
                        <div
                          className="text-sm p-3 rounded-md border"
                          style={{
                            background:
                              "color-mix(in oklab, var(--primary) 8%, var(--background))",
                            borderColor:
                              "color-mix(in oklab, var(--primary) 22%, var(--border))",
                          }}
                        >
                          {filtered[openIndex].expected}
                        </div>
                      </TabsContent>
                    )}

                    <TabsContent value="details">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {filtered[openIndex].details.map((d, i) => (
                          <Badge key={`detail-${i}`} variant="outline">
                            {d}
                          </Badge>
                        ))}
                      </div>
                      <TechBadges tech={filtered[openIndex].tech} />
                      {filtered[openIndex].demoUrl && (
                        <div className="mt-4">
                          <Button asChild>
                            <a
                              href={filtered[openIndex].demoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center"
                            >
                              {t("openDemo")} <FaExternalLinkAlt className="ml-2" />
                            </a>
                          </Button>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

// ------------------------------
// SUBCOMPONENTES
// ------------------------------
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="rounded-md border border-border bg-[color-mix(in_oklab,var(--primary)_6%,var(--background))] text-[0.875rem] leading-relaxed font-mono overflow-x-auto">
      <pre className="p-3 text-foreground/90">
        {code}
      </pre>
    </div>
  );
}

function TechBadges({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tech.map((t) => (
        <Badge
          key={t}
          variant="outline"
          className="flex items-center border-border"
        >
          <TechIcon name={t} />
          {t}
        </Badge>
      ))}
    </div>
  );
}

function ProjectMeta({ p, compact = false }: { p: Project; compact?: boolean }) {
  const t = useTranslations("projectsQA");
  const statusColor =
    p.metrics.status === "passed"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-red-600 dark:text-red-400";

  const levelClasses =
    p.metrics.level === "Smoke"
      ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      : p.metrics.level === "Regression"
      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
      : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${compact ? "mb-2" : "mb-3"}`}>
      <span className={`inline-flex items-center gap-1 text-xs ${statusColor}`}>
        <FaCheckCircle aria-hidden /> {t(`status.${p.metrics.status}`)}
      </span>
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <FaStopwatch aria-hidden /> {secondsToHuman(p.metrics.durationSec)}
      </span>
      <span className={`px-2 py-0.5 rounded-full text-xs ${levelClasses}`}>{p.metrics.level}</span>
      <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
        {p.type}
      </span>
    </div>
  );
}

function GifWithSkeleton({ src }: { src?: string }) {
  const [loaded, setLoaded] = useState(false);
  if (!src) return null;
  return (
    <div className="w-full overflow-hidden rounded-lg border border-border">
      {!loaded && <Skeleton className="w-full h-64" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Demo de ejecución"
        className={`w-full ${loaded ? "block" : "hidden"}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
