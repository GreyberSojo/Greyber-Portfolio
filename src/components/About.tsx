// src/components/About.tsx
"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animations"; // mantenemos tu animación centralizada
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

const skills: { name: string; icon: IconType }[] = [
  { name: "TOSCA", icon: FaCogs },
  { name: "Playwright", icon: FaPlay },
  { name: "Cypress", icon: FaCode },
  { name: "Godot", icon: FaGamepad },
  { name: "Unity", icon: FaGamepad },
  { name: "Automatización", icon: FaRobot },
  { name: "Testing Manual", icon: FaClipboardCheck },
  { name: "Debugging", icon: FaBug },
];

const experience: {
  year: string;
  title: string;
  company: string;
  desc: string;
  icon: IconType;
}[] = [
  {
    year: "2023 – Actualidad",
    title: "QA Engineer",
    company: "Empresa XYZ",
    desc: "Automatización con Playwright, Cypress y TOSCA. Pruebas manuales/exploratorias, reporte de bugs y soporte en CI.",
    icon: FaBriefcase,
  },
  {
    year: "2021 – 2023",
    title: "Game Developer (Freelance)",
    company: "Proyectos Indie",
    desc: "Prototipos con Godot/Unity, gameplay loops, pipelines simples de build y testing en juegos.",
    icon: FaGamepad,
  },
  {
    year: "2019 – 2021",
    title: "Ingeniería de Software",
    company: "Formación",
    desc: "Bases sólidas de calidad de software, patrones, testing y SDLC.",
    icon: FaGraduationCap,
  },
];

// Stagger para los hijos
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function About() {
  return (
    <section
      id="about"
      role="region"
      aria-label="Sobre mí"
      className="
        relative py-20 scroll-mt-24
        bg-gradient-to-b from-white via-gray-50 to-white
        dark:bg-gradient-to-b dark:from-gray-950 dark:via-gray-800 dark:to-gray-900
      "
    >

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        {/* Título */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="text-3xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white"
        >
          Sobre mí
        </motion.h2>

        {/* Intro */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto mt-6 max-w-3xl text-lg md:text-xl text-gray-700 dark:text-gray-300 text-center"
        >
          Soy <span className="font-semibold text-cyan-600 dark:text-cyan-400">QA Engineer</span> y{" "}
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">Game Developer</span>. Me
          enfoco en automatización, pruebas robustas y experiencias de juego limpias y estables.
        </motion.p>

        {/* TIMELINE */}
        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
          className="relative mt-16"
        >
          {/* Línea central (desktop) */}
          <div className="hidden md:block pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-gradient-to-b from-cyan-400/80 via-cyan-400/30 to-transparent rounded-full" />

          {experience.map((exp, idx) => {
            const Icon = exp.icon;
            const leftSide = idx % 2 === 0;

            return (
              <motion.li
                key={`${exp.title}-${exp.year}`}
                variants={fadeUp}
                className="
                  relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start md:items-center gap-6 md:gap-10 mb-12
                "
              >
                {/* Columna izquierda o derecha (según index) */}
                <div
                  className={`
                    ${leftSide ? "md:col-start-1 md:justify-self-end" : "md:col-start-3 md:justify-self-start"}
                    max-w-xl
                  `}
                >
                  {/* Tarjeta */}
                  <article
                    className="
                      relative p-5 rounded-xl border
                      bg-white/70 backdrop-blur-sm dark:bg-gray-900/60
                      border-gray-200 dark:border-gray-800 shadow-sm
                    "
                  >
                    {/* Conector horizontal hacia la línea central (solo desktop) */}
                    <span
                      aria-hidden
                      className={`
                        hidden md:block absolute top-7 h-[2px] w-10
                        bg-cyan-400/50
                        ${leftSide ? "right-[-2.5rem]" : "left-[-2.5rem]"}
                      `}
                    />

                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                        <Icon />
                      </span>
                      <div className="leading-tight">
                        <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                          {exp.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{exp.company}</p>
                      </div>
                    </div>

                    <span className="mt-2 block text-sm font-medium text-cyan-600 dark:text-cyan-400">
                      {exp.year}
                    </span>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{exp.desc}</p>
                  </article>
                </div>

                {/* Hito central (círculo con icono) */}
                <div className="hidden md:flex md:col-start-2 items-center justify-center">
                  <div className="relative">
                    {/* Glow animado */}
                    <span className="absolute inset-0 rounded-full bg-cyan-400/50 blur-md opacity-40 animate-pulse" aria-hidden />
                    {/* Punto principal */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-cyan-400 dark:bg-cyan-500 flex items-center justify-center ring-8 ring-white/70 dark:ring-gray-900/70 shadow-xl">
                      <Icon className="text-white" />
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        {/* SKILLS */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-center text-xl font-semibold text-gray-900 dark:text-white">
            Skills y herramientas
          </h3>

          <ul className="mt-6 flex flex-wrap justify-center gap-3">
            {skills.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.name}
                  variants={fadeUp}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="
                    group inline-flex items-center gap-2 px-4 py-2 rounded-full
                    bg-cyan-500/10 border border-cyan-500/40
                    text-cyan-700 dark:text-cyan-300
                    hover:bg-cyan-500/20 hover:border-cyan-400
                    transition-colors
                  "
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
