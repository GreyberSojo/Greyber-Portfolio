// src/app/page.tsx
import { Suspense } from "react";

import About from "@/components/About";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";
import ProjectsGames from "@/components/ProjectsGames";
import ProjectsQA from "@/components/ProjectsQA";

export default function Home() {
  return (
    <>
      <section id="home" aria-label="Inicio" className="content-flow">
        <h1 className="sr-only">Greyber Sojo — Portfolio</h1>
        <Hero />
      </section>

      <section id="skills" aria-label="Skills" className="content-flow">
        <h2 className="sr-only">Showcase</h2>
        <ProjectsQA />
        <Suspense
          fallback={
            <div className="text-center text-sm text-foreground/60 py-8">
              Cargando proyectos…
            </div>
          }
        >
          <ProjectsGames />
        </Suspense>
      </section>

      <section id="about" aria-label="Sobre mí" className="content-flow">
        <h2 className="sr-only">Sobre mí</h2>
        <About />
      </section>

      <section id="contact" aria-label="Contacto" className="content-flow">
        <h2 className="sr-only">Contacto</h2>
        <Contact />
      </section>
    </>
  );
}
