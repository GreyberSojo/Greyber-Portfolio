// src/components/About.tsx
"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  FaClipboardList,
  FaDatabase,
  FaLayerGroup,
} from "react-icons/fa";
import { fadeUp } from "@/lib/animations";

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

/* --------- Data --------- */
const skillsByCategory: Record<string, { name: string; icon: IconType }[]> = {
  QA: [
    { name: "Manual Testing", icon: FaClipboardCheck },
    { name: "Functional Testing", icon: FaClipboardCheck },
    { name: "Regression Testing", icon: FaClipboardCheck },
    { name: "Exploratory Testing", icon: FaClipboardCheck },
    { name: "User Acceptance Testing (UAT)", icon: FaClipboardCheck },
    { name: "Automatización QA", icon: FaRobot },
    { name: "Tosca (Básico)", icon: FaCogs },
    { name: "Playwright (Básico)", icon: FaPlay },
    { name: "Cypress (En aprendizaje)", icon: FaCode },
    { name: "Postman (APIs)", icon: FaCode },
    { name: "JIRA / Xray", icon: FaClipboardList },
    { name: "Spira", icon: FaClipboardList },
    { name: "Cucumber", icon: FaCode },
    { name: "TestRail", icon: FaClipboardList },
    { name: "Debugging & Logs (PowerShell / Android Dev)", icon: FaBug },
    { name: "SAP Finance (R2R)", icon: FaBriefcase },
    { name: "Agile / Scrum / Kanban", icon: FaLayerGroup },
  ],
  Desarrollo: [
    { name: "JavaScript", icon: FaCode },
    { name: "HTML", icon: FaCode },
    { name: "CSS", icon: FaCode },
    { name: "Node.js", icon: FaCode },
    { name: "Express", icon: FaCode },
    { name: "MongoDB", icon: FaDatabase },
    { name: "SQL", icon: FaDatabase },
    { name: "Unity (C#)", icon: FaGamepad },
    { name: "Godot (GDScript)", icon: FaGamepad },
    { name: "Gameplay Loops", icon: FaPlay },
    { name: "UI/UX en Juegos", icon: FaCode },
    { name: "WordPress", icon: FaCode },
  ],
  Otros: [
    { name: "Inglés (B2)", icon: FaGraduationCap },
    { name: "Portugués (A1)", icon: FaGraduationCap },
    { name: "Administración de Empresas", icon: FaGraduationCap },
  ],
};


const experience: {
  year: string;
  title: string;
  company: string;
  desc: string;
  icon: IconType;
}[] = [
  {
    year: "May 2024 – Jun 2025",
    title: "QA Analyst – SAP Finance",
    company: "Globant",
    desc: "Pruebas funcionales, de regresión y UAT en SAP GUI (Record-to-Report). Validación de transacciones críticas en entornos financieros, diseño de casos de prueba y reporting de defectos en JIRA/Xray. Optimización de dashboards que mejoraron la calidad del proceso en un 15%. Implementación de automatización básica con Tosca y Playwright para reducir tiempos manuales. Colaboración con equipos funcionales y de desarrollo bajo metodología Agile.",
    icon: FaBriefcase,
  },
  {
    year: "Apr 2022 – May 2024",
    title: "QC Analyst – OTT & STB (Device Testing)",
    company: "Globant",
    desc: "Diseño y ejecución de pruebas manuales y end-to-end en OTT y dispositivos STB, validando apps como HBO Max, YouTube, Netflix, Star+ y Spotify. Reporte detallado de bugs en JIRA, logrando reducir en un 20% el tiempo de resolución. Uso de Postman para pruebas de APIs y análisis de logs con PowerShell y Android Developer Options para detección de errores. Gestión de métricas de calidad con Spira en entornos Agile/Scrum.",
    icon: FaBriefcase,
  },
  {
    year: "2023 – Actualidad",
    title: "Game Developer (Freelance)",
    company: "Indie Games",
    desc: "Desarrollo de prototipos 2D/3D en Unity (C#) y Godot (GDScript), con foco en gameplay loops, sistemas de IA, físicas, interfaces de usuario y estabilidad de los juegos. Aplicación de OOP y testing de mecánicas de juego para optimizar la experiencia del jugador.",
    icon: FaGamepad,
  },
  {
    year: "2022 - 2023",
    title: "The Web Developer Bootcamp 2023",
    company: "Udemy – Instructor Colt Steele",
    desc: "Certificación de 74 horas en desarrollo web full-stack. Fundamentos de HTML, CSS, JavaScript, Node.js, Express y MongoDB. Enfoque práctico con proyectos reales, buenas prácticas y despliegue de aplicaciones.",
    icon: FaGraduationCap,
  },
  {
    year: "2012 - 2015",
    title: "T.S.U en Administración de Empresas",
    company: "UPTBAL “Argelia Laya”",
    desc: "Formación en gestión, planificación y control de organizaciones, con énfasis en finanzas, marketing, recursos humanos y estrategia empresarial. Desarrollo de competencias en análisis financiero, liderazgo y toma de decisiones.",
    icon: FaGraduationCap,
  },
];

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
  const reduced = usePrefersReducedMotion();
  const mv = reduced
    ? {}
    : { variants: fadeUp, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-100px" } };

  const [expanded, setExpanded] = useState<{ [key: number]: boolean }>({});

  return (
    <section
      id="about"
      role="region"
      aria-label="Sobre mí"
      className="relative py-20 scroll-mt-24 bg-background text-foreground"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8">
        {/* Título */}
        <motion.h2 {...mv} className="text-3xl md:text-5xl font-extrabold text-center">
          Sobre mí
        </motion.h2>

        {/* Intro extendida */}
       <motion.p
          {...mv}
          className="mx-auto mt-6 max-w-4xl text-lg md:text-xl text-foreground/75 text-center"
        >
          Soy un <span className="font-semibold text-primary">QA Analyst</span> con más de{" "}
          <span className="font-semibold">3 años de experiencia</span> en pruebas{" "}
          <span className="font-semibold">manuales, funcionales y UAT</span>, con conocimientos en{" "}
          <span className="font-semibold">automatización</span> usando Tosca, Playwright y Cypress (en aprendizaje).  
          He trabajado en proyectos de{" "}
          <span className="font-semibold">OTT/STB</span> validando apps como HBO Max, Netflix y Spotify, 
          y en <span className="font-semibold">SAP Finance (R2R)</span>, asegurando la calidad de procesos financieros críticos.  

          Además, complemento mi perfil con{" "}
          <span className="font-semibold">desarrollo de videojuegos</span> en Unity (C#) y Godot (GDScript), 
          y <span className="font-semibold">desarrollo web full-stack</span> con JavaScript, HTML, CSS, Node.js, Express y MongoDB.  

          Me defino como <span className="font-semibold">metódico, detallista y orientado a resultados</span>, 
          siempre buscando entregar software de calidad y mejorar continuamente.
        </motion.p>

        {/* Timeline */}
        <motion.ol
          custom={reduced}
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-20% 0px -20% 0px" }}
          className="relative mt-16"
        >
          {/* Línea central */}
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
            const isExpanded = !!expanded[idx];

            return (
              <motion.li
                key={`${exp.title}-${exp.year}`}
                variants={fadeUp}
                className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-start md:items-center gap-6 md:gap-10 mb-12"
              >
                {/* Card */}
                <div
                  className={`${
                    leftSide
                      ? "md:col-start-1 md:justify-self-end"
                      : "md:col-start-3 md:justify-self-start"
                  } max-w-xl relative`}
                >
                  {/* 🔹 Conector hacia la línea central */}
                  <span
                    aria-hidden
                    className={`hidden md:block absolute top-7 h-[2px] w-10`}
                    style={{
                      background: "color-mix(in oklab, var(--primary) 40%, var(--border))",
                      [leftSide ? "right" : "left"]: "-2.5rem", // Ajusta según ancho de gap
                    } as React.CSSProperties}
                  />

                  <article className="relative p-5 rounded-xl border bg-card/80 backdrop-blur-sm border-border shadow-sm">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border text-primary">
                        <Icon />
                      </span>
                      <div className="leading-tight">
                        <h3 className="text-lg md:text-xl font-semibold">{exp.title}</h3>
                        <p className="text-sm text-foreground/60">{exp.company}</p>
                      </div>
                    </div>
                    <span className="mt-2 block text-sm font-medium text-primary">{exp.year}</span>
                    <div className="mt-2 relative">
                      <p className={`text-foreground/80 ${isExpanded ? "" : "line-clamp-4"}`}>
                        {exp.desc}
                      </p>
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [idx]: !isExpanded }))}
                        className="mt-2 text-primary text-sm font-medium hover:underline"
                      >
                        {isExpanded ? "Ver menos" : "Ver más"}
                      </button>
                    </div>
                  </article>
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
          <h3 className="text-center text-xl font-semibold">Skills y herramientas</h3>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {Object.entries(skillsByCategory).map(([category, items]) => (
              <div key={category} className="rounded-xl border border-border bg-card/60 p-4">
                <h4 className="text-center text-primary font-semibold mb-3">{category}</h4>
                <ul className="flex flex-wrap justify-center gap-2">
                  {items.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li
                        key={s.name}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] leading-none"
                        style={{
                          background: "color-mix(in oklab, var(--primary) 10%, var(--background))",
                          borderColor: "color-mix(in oklab, var(--primary) 35%, var(--border))",
                          color: "color-mix(in oklab, var(--primary) 70%, var(--foreground))",
                        }}
                      >
                        <Icon className="w-3 h-3" />
                        {s.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
