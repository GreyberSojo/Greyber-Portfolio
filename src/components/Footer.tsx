import { FaEnvelope,FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  const footerInfo = {
    rights: "Todos los derechos reservados",
    extra: "Hecho con ❤️ y café",
    lastUpdate: "Septiembre 2025",
    location: "Argentina 🇦🇷",
  };

  // (removed unused scrollToTop)

  return (
    <footer
      role="contentinfo"
      className="relative py-10 bg-background text-foreground border-t border-border"
    >
      {/* Glow border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-pulse" />

      {/* Wrapper centrado */}
      <div className="max-w-6xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Col 1 - Frase y ubicación */}
        <div>
          <p className="text-sm">{footerInfo.extra}</p>
          <p className="text-xs mt-1">
            {footerInfo.location} • Última actualización: {footerInfo.lastUpdate}
          </p>
        </div>

        {/* Col 2 - Navegación */}
        <nav aria-label="Enlaces de pie" className="text-sm">
          <ul className="flex flex-wrap items-center gap-6">
            <li>
              <a
                href="#projects"
                className="hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                🚀 Showcase
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                🙋 Sobre mí
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-blue-500 dark:hover:text-blue-400 transition"
              >
                ✉️ Contacto
              </a>
            </li>
          </ul>
        </nav>

        {/* Col 3 - Redes */}
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex gap-4 text-2xl">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition transform hover:scale-110"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition transform hover:scale-110"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>
            <a
              href="mailto:greybersojo@gmail.com"
              className="hover:text-red-500 transition transform hover:scale-110"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      {/* Copy final */}
      <div className="mt-5 text-center text-xs text-foreground/70">
        &copy; {new Date().getFullYear()}. {footerInfo.rights}.
      </div>

    </footer>
  );
}
