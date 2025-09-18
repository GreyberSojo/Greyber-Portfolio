// src/app/page.tsx
import Hero from "@/components/Hero";
import About from "@/components/About";
import Contact from "@/components/Contact";
import ProjectsQA from "@/components/ProjectsQA";
import ProjectsGames from "@/components/ProjectsGames";

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
        <ProjectsGames />
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
