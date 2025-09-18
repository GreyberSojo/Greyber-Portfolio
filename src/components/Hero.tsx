"use client";

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaArrowRight, FaCheckCircle,FaDownload } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import { prefix } from "@/lib/prefix"


import animationData from "../../public/lotties/qa-automation.json";

export default function Hero() {
  // Respeta reduced motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  const mv = reduceMotion ? {} : { variants: fadeUp, initial: "hidden", animate: "show" };

  return (
    <section
      id="home"
      role="banner"
      className="
        relative w-full min-h-[86vh] md:min-h-screen overflow-hidden
        flex items-center
        bg-background text-foreground 
      "
    >
      {/* Fondo: gradiente sutil con la marca */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 380px at 14% -8%, color-mix(in oklab, var(--primary) 10%, transparent), transparent), linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 4%, var(--background)), var(--background))",
        }}
      />
      {/* Grid sutil */}
      <div
        aria-hidden
        className="
          absolute inset-0
          opacity-[0.035] dark:opacity-[0.06]
          bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_80%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_16%,transparent)_1px,transparent_1px)]
          bg-[size:32px_32px]
        "
      />
      {/* Glow suave */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 260px at 90% 18%, color-mix(in oklab, var(--primary) 7%, transparent), transparent)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Izquierda */}
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div {...mv} className="relative mb-6">
              <span
                className="absolute -inset-3 rounded-full blur-2xl"
                style={{ background: "color-mix(in oklab, var(--primary) 18%, transparent)" }}
                aria-hidden
              />
              <div className="relative w-32 h-32 md:w-44 md:h-44 rounded-full ring-4 ring-[var(--primary)] overflow-hidden shadow-xl">
                <Image
                  src={`${prefix}/images/avatar.png`}
                  alt="Foto de Greyber Sojo"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover"
                  priority
                />
              </div>
            </motion.div>

            <motion.h1 {...mv} className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Hola, soy <span className="text-primary">Greyber</span>
            </motion.h1>

            <motion.p {...mv} className="mt-3 text-lg sm:text-xl md:text-2xl text-foreground/70 max-w-xl">
              QA Engineer · Automation · Game Dev
            </motion.p>

            {/* CTAs */}
            <motion.div {...mv} className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4">
              <Button
                asChild
                variant="default"
                className="shadow-[0_10px_25px_0_color-mix(in_oklab,var(--primary)_20%,transparent)]"
              >
                <a href="#skills" aria-label="Ir a Skills" className="inline-flex items-center gap-2">
                  Explora mi trabajo <FaArrowRight />
                </a>
              </Button>

              <Button asChild variant="outline">
                <a
                  href="/CV.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Descargar CV"
                  className="inline-flex items-center gap-2"
                >
                  <FaDownload /> Descargar CV
                </a>
              </Button>
            </motion.div>

            {/* Badges */}
            <motion.ul {...mv} className="mt-6 flex flex-wrap gap-3 text-sm">
              {["+3 años en QA", "Automation & Manual", "2 prototipos de juegos"].map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
                  style={{
                    background: "color-mix(in oklab, var(--primary) 9%, var(--background))",
                    color: "color-mix(in oklab, var(--primary) 60%, var(--foreground))",
                    borderColor: "color-mix(in oklab, var(--primary) 30%, var(--border))",
                  }}
                >
                  <FaCheckCircle className="opacity-80" />
                  {item}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Derecha: Lottie en card */}
          <motion.div {...mv} className="hidden lg:flex items-center justify-center">
            <div
              className="
                relative aspect-[16/10] w-full rounded-xl overflow-hidden
                border p-6 flex items-center justify-center
                shadow-[0_20px_50px_-20px_color-mix(in_oklab,black_25%,transparent)]
                bg-card
              "
              style={{
                borderColor: "color-mix(in oklab, var(--primary) 18%, var(--border))",
              }}
            >
              <Lottie
                animationData={animationData}
                loop={!reduceMotion}
                autoplay={!reduceMotion}
                className="w-full h-full"
                aria-hidden
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
