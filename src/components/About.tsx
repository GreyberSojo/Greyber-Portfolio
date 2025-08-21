// src/components/About.tsx
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaCogs,
  FaPlay,
  FaCode,
  FaGamepad,
  FaRobot,
  FaClipboardCheck,
  FaBug,
  FaBriefcase,
  FaGraduationCap,
} from "react-icons/fa";
import { fadeUp } from "@/lib/animations";
import { useTranslations } from "@/lib/i18n";

/* --------- Reduced motion --------- */
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

/* --------- Variants --------- */
const container = {
  hidden: { opacity: 0 },
  show: (reduced: boolean) => ({
    opacity: 1,
    transition: reduced
      ? { duration: 0 }
      : { staggerChildren: 0.08, when: "beforeChildren" },
  }),
};

export default function About() {
  const t = useTranslations("about");
  const reduced = usePrefersReducedMotion();
  const mv = reduced
    ? {}
    : { variants: fadeUp, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-100px" } };

  const skillIcons: IconType[] = [
    FaCogs,
    FaPlay,
    FaCode,
    FaGamepad,
    FaGamepad,
    FaRobot,
    FaClipboardCheck,
    FaBug,
  ];
  const skills = (t("skills") as string[]).map((name, i) => ({ name, icon: skillIcons[i] }));

  const expData = t("experience") as {
    year: string;
    title: string;
    company: string;
    desc: string;
  }[];
  const experience = [
    { ...expData[0], icon: FaBriefcase },
    { ...expData[1], icon: FaGamepad },
    { ...expData[2], icon: FaGraduationCap },
  ];

  return (
    <section
      id="about"
      role="region"
      aria-label={t("aria")}
      className="
        relative py-20 scroll-mt-24
        bg-background text-foreground
      "
    >
      {/* Fondo suave con la marca (usa variables del tema) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 5%, var(--background)), var(--background))",
        }}
      />
      {/* Grid sutil */}
      <div
        aria-hidden
        className="
          absolute inset-0
          opacity-[0.035] dark:opacity-[0.06]
          bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_16%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_16%,transparent)_1px,transparent_1px)]
          bg-[size:32px_32px]
        "
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        {/* Título */}
        <motion.h2
          {...mv}
          className="text-3xl md:text-5xl font-extrabold text-center"
        >
          {t("heading")}
        </motion.h2>

        {/* Intro */}
        <motion.p
          {...mv}
          className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-foreground/75 text-center"
          dangerouslySetInnerHTML={{ __html: t("intro") }}
        />

        {/* Timeline */}
        <motion.ol
          custom={reduced}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
          className="relative mt-16"
        >
          {/* Línea central (desktop) */}
          <div
            className="hidden md:block pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, color-mix(in oklab, var(--primary) 70%, transparent), color-mix(in oklab, var(--primary) 25%, transparent), transparent)",
            }}
            aria-hidden
          />

          {experience.map((exp, idx) => {
            const Icon = exp.icon;
            const leftSide = idx % 2 === 0;
            return (
              <motion.li
                key={`${exp.title}-${exp.year}`}
                variants={fadeUp}
                className="
                  relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr]
                  items-start md:items-center gap-6 md:gap-10 mb-12
                "
              >
                {/* Columna (según índice) */}
                <div
                  className={`${
                    leftSide
                      ? "md:col-start-1 md:justify-self-end"
                      : "md:col-start-3 md:justify-self-start"
                  } max-w-xl`}
                >
                  <article
                    className="
                      relative p-5 rounded-xl border bg-card/80 backdrop-blur-sm
                      border-border shadow-sm
                    "
                  >
                    {/* Conector a la línea central (desktop) */}
                    <span
                      aria-hidden
                      className={`hidden md:block absolute top-7 h-[2px] w-10`}
                      style={{
                        background:
                          "color-mix(in oklab, var(--primary) 40%, var(--border))",
                        [leftSide ? "right" : "left"]: "-2.5rem",
                      } as React.CSSProperties}
                    />

                    <div className="flex items-start gap-3">
                      <span
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border"
                        style={{
                          background:
                            "color-mix(in oklab, var(--primary) 12%, var(--background))",
                          borderColor:
                            "color-mix(in oklab, var(--primary) 35%, var(--border))",
                          color:
                            "color-mix(in oklab, var(--primary) 75%, var(--foreground))",
                        }}
                        aria-hidden
                      >
                        <Icon />
                      </span>
                      <div className="leading-tight">
                        <h3 className="text-lg md:text-xl font-semibold">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-foreground/60">{exp.company}</p>
                      </div>
                    </div>

                    <span className="mt-2 block text-sm font-medium text-primary">
                      {exp.year}
                    </span>
                    <p className="mt-2 text-foreground/80">{exp.desc}</p>
                  </article>
                </div>

                {/* Punto central */}
                <div className="hidden md:flex md:col-start-2 items-center justify-center">
                  <div className="relative">
                    {!reduced && (
                      <span
                        className="absolute inset-0 rounded-full blur-md opacity-40 animate-pulse"
                        style={{
                          background:
                            "color-mix(in oklab, var(--primary) 60%, transparent)",
                        }}
                        aria-hidden
                      />
                    )}
                    <div
                      className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center ring-8 shadow-xl"
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                        boxShadow:
                          "0 12px 30px color-mix(in oklab, var(--primary) 35%, transparent)",
                        ringColor: "color-mix(in oklab, var(--background) 70%, transparent)",
                      } as React.CSSProperties}
                      aria-hidden
                    >
                      <Icon />
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* Skills */}
        <motion.div
          custom={reduced}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-center text-xl font-semibold">{t("skillsHeading")}</h3>
          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {skills.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.name}
                  variants={fadeUp}
                  transition={
                    reduced ? { duration: 0 } : { delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                  }
                  className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border transition-colors"
                  style={{
                    background:
                      "color-mix(in oklab, var(--primary) 10%, var(--background))",
                    borderColor:
                      "color-mix(in oklab, var(--primary) 35%, var(--border))",
                    color:
                      "color-mix(in oklab, var(--primary) 70%, var(--foreground))",
                  }}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5">
                    <Icon />
                  </span>
                  <span className="font-medium">{s.name}</span>
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
