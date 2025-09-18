"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useCallback,useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import DarkModeToggle from "./DarkModeToggle";

type NavItem = { href: `#${string}`; label: string };

const NAV_ITEMS: NavItem[] = [
  { href: "#home", label: "Home" },
  { href: "#showcase", label: "Showcase" },
  { href: "#about", label: "Sobre mí" },
  { href: "#contact", label: "Contacto" },
];

// Subcomponente reutilizable
function NavLink({
  href,
  label,
  isActive,
  onClick,
  className,
}: {
  href: string;
  label: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      aria-label={`Ir a ${label}`}
      className={cn(
        "relative px-3 py-2 rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive ? "text-primary" : "text-foreground/80 hover:text-primary",
        className
      )}
    >
      {label}
      {/* subrayado animado que hereda currentColor */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-3 right-3 -bottom-0.5 h-[2px] origin-left transition-transform duration-300",
          isActive ? "scale-x-100" : "scale-x-0",
          "bg-current"
        )}
      />
    </Link>
  );
}

export default function Navbar() {
  const navItems = useMemo(() => NAV_ITEMS, []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");

  // Barra de progreso superior (usa color de marca)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // Estilo del header al hacer scroll
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // --- NUEVO: Scroll Spy robusto con offset fijo del header ---
  useEffect(() => {
    const ids = navItems.map((i) => i.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (sections.length === 0) return;

    // Altura del header fijo (h-16 = 64px). Sumamos margen de comodidad.
    const HEADER_OFFSET = 72;

    const computeActive = () => {
      const scrollPos = window.scrollY + HEADER_OFFSET + 1; // +1 para evitar bordes exactos
      // Si estamos arriba del todo, marca home
      if (scrollPos <= (sections[0]?.offsetTop ?? 0)) {
        setActive(`#${sections[0].id}`);
        return;
      }
      // Busca la sección cuyo rango contiene el scroll actual
      let current = sections[0].id;
      for (const sec of sections) {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          current = sec.id;
          break;
        }
      }
      setActive(`#${current}`);
    };

    computeActive();
    window.addEventListener("scroll", computeActive, { passive: true });
    window.addEventListener("resize", computeActive);
    return () => {
      window.removeEventListener("scroll", computeActive);
      window.removeEventListener("resize", computeActive);
    };
  }, [navItems]);

  // Scroll suave con compensación por header fijo
  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      const el = document.querySelector(href) as HTMLElement | null;
      if (el) {
        const HEADER_OFFSET = 72;
        const y = el.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
        window.scrollTo({ top: Math.max(y, 0), behavior: "smooth" });
        history.replaceState(null, "", href);
      }
      setMenuOpen(false);
    },
    []
  );

  // ESC para cerrar y bloquear scroll en body cuando menú móvil abierto
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {/* Progress bar superior */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-0.5 origin-left bg-primary z-[60]"
        aria-hidden
      />

      {/* Skip to content */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-primary focus:text-primary-foreground focus:px-3 focus:py-2 focus:rounded-md"
      >
        Saltar al contenido principal
      </a>

        <nav
          className={cn(
            "fixed top-0 left-0 right-0 z-50",
            "transition-colors duration-300",
            "border-b backdrop-blur-md",
            isScrolled ? "bg-background/80 border-border shadow-sm" : "bg-background/0 border-transparent"
          )}
          aria-label="Principal"
          style={{ willChange: "background-color, backdrop-filter" }}
        >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="h-16 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="text-foreground font-extrabold tracking-wide text-lg md:text-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md px-1"
              aria-label="Ir al inicio"
            >
              <span className="text-primary">G</span>reyber Sojo
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  isActive={active === item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                />
              ))}

              {/* CTA + DarkMode + Idioma */}
              <div className="ml-2 flex items-center gap-5">
                <a
                  href="/CV.pdf"
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold border border-border text-foreground hover:text-primary hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Descargar CV
                </a>

                <DarkModeToggle />
              </div>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-3">
              <DarkModeToggle />
              <button
                type="button"
                className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Overlay (cierra menú al click) */}
        <div
          className={cn(
            "md:hidden fixed inset-0 z-40 bg-black/40 transition-opacity",
            menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />

        {/* Mobile menu panel */}
        <div
          id="mobile-menu"
          className={cn(
            "md:hidden fixed top-0 right-0 h-full w-[82%] max-w-sm z-50 transform transition-transform duration-300",
            menuOpen ? "translate-x-0" : "translate-x-full",
            "bg-background border-l border-border shadow-xl"
          )}
          role="dialog"
          aria-modal="true"
        >
          <div className="h-16 px-4 flex items-center justify-between border-b border-border">
            <span className="font-semibold">Navegación</span>
            <button
              className="w-10 h-10 rounded-md border border-border"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú"
            >
              ✕
            </button>
          </div>

          <nav className="px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                label={item.label}
                isActive={active === item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  "block rounded-lg px-4 py-3 text-base",
                  active === item.href ? "bg-primary/10" : "hover:bg-foreground/5"
                )}
              />
            ))}

            <a
              href="/CV.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-3 text-base font-semibold border border-border text-foreground hover:text-primary hover:bg-foreground/5"
              onClick={() => setMenuOpen(false)}
            >
              Descargar CV
            </a>
          </nav>
        </div>
      </nav>
    </>
  );
}
