"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaItchIo,
  FaClipboard,
} from "react-icons/fa";

type ContactLink = { name: string; link: string; icon: React.ReactNode };

const CONTACT_EMAIL = "greybersojo@gmail.com";
const CONTACT_NAME = "Greyber Sojo";

export default function Contact() {
  // social / quick links (editar)
  const contactLinks: ContactLink[] = [
    { name: "Email", link: `mailto:${CONTACT_EMAIL}`, icon: <FaEnvelope /> },
    {
      name: "LinkedIn",
      link: "https://linkedin.com/in/greyber-sojo",
      icon: <FaLinkedin />,
    },
    { name: "GitHub", link: "https://github.com/GreyberSojo", icon: <FaGithub /> },
    {
      name: "Itch.io",
      link: "https://itch.io/profile",
      icon: <FaItchIo />,
    },
  ];

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const mountedRef = useRef(false);

  // autosave key
  const STORAGE_KEY = "contact_form_autosave_v1";

  // Load saved draft on mount
  useEffect(() => {
    mountedRef.current = true;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name) setName(parsed.name);
        if (parsed?.email) setEmail(parsed.email);
        if (parsed?.subject) setSubject(parsed.subject);
        if (parsed?.message) setMessage(parsed.message);
      }
    } catch {
      /* ignore */
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // autosave to localStorage when fields change
  useEffect(() => {
    const payload = { name, email, subject, message, savedAt: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore quota issues
    }
  }, [name, email, subject, message]);

  // simple email validator
  const validateEmail = (e: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

  function validateForm() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "El nombre es requerido.";
    if (!email.trim()) errs.email = "El correo es requerido.";
    else if (!validateEmail(email)) errs.email = "Introduce un correo válido.";
    if (!message.trim() || message.trim().length < 10)
      errs.message = "El mensaje debe tener al menos 10 caracteres.";
    // honeypot: if filled, it's spam
    if (website.trim()) errs.website = "Spam detectado.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // fallback mailto builder
  function buildMailto(): string {
    const subjectEncoded = encodeURIComponent(
      subject || `Contacto desde web - ${CONTACT_NAME}`
    );
    const body = encodeURIComponent(
      `Nombre: ${name}\nEmail: ${email}\n\n${message}`
    );
    return `mailto:${CONTACT_EMAIL}?subject=${subjectEncoded}&body=${body}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setStatusMessage(null);

    if (!validateForm()) {
      setStatus("error");
      setStatusMessage("Corrige los errores antes de enviar.");
      return;
    }

    setSending(true);

    // payload
    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    // 1) intento llamar a /api/contact (si existe)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setStatusMessage("Mensaje enviado. ¡Gracias! Te respondo pronto.");
        // clear
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        localStorage.removeItem(STORAGE_KEY);
        setErrors({});
      } else {
        // servidor devolvió error -> fallback a mailto
        const text = await res.text().catch(() => null);
        console.warn("API responded non-OK:", res.status, text);
        setStatus("error");
        setStatusMessage(
          "No fue posible enviar desde el servidor. Abriéndose cliente de correo como alternativa."
        );
        window.setTimeout(() => {
          window.location.href = buildMailto();
        }, 600);
      }
    } catch (err) {
      // probablemente no exista la API (404) o network error -> fallback mailto
      console.warn("Error enviando a /api/contact:", err);
      setStatus("error");
      setStatusMessage(
        "No hay backend disponible. Se abrirá tu cliente de correo para enviar el mensaje."
      );
      window.setTimeout(() => {
        window.location.href = buildMailto();
      }, 600);
    } finally {
      setSending(false);
    }
  }

  // copy email to clipboard
  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        // fallback
        const textArea = document.createElement("textarea");
        textArea.value = CONTACT_EMAIL;
        // avoid scrolling to bottom
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  // create and download vCard (.vcf)
  const handleDownloadVCard = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${CONTACT_NAME}`,
      `EMAIL;TYPE=INTERNET:${CONTACT_EMAIL}`,
      "END:VCARD",
    ].join("\n");
    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${CONTACT_NAME.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // small animated check (success)
  const SuccessBadge = () => (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm"
      role="status"
      aria-live="polite"
    >
      ✓ Enviado
    </motion.div>
  );

  return (
    <section
      id="contact"
      className="py-20 px-6 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white scroll-mt-24"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          id="contact-heading"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center"
        >
          ¿Hablamos? <span className="text-cyan-500">Contacto</span>
        </motion.h2>

        <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto mb-8">
          Si tienes un proyecto, una duda técnica o quieres colaborar, escribeme. Respondere lo antes posible.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* FORM */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
            aria-describedby="contact-form-desc"
          >
            <div id="contact-form-desc" className="sr-only">
              Formulario de contacto: nombre, email, asunto y mensaje.
            </div>

            {/* status messages */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <div>
                {status === "success" && <SuccessBadge />}
                {status === "error" && statusMessage && (
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm"
                    role="status"
                    aria-live="polite"
                  >
                    ⚠ {statusMessage}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm bg-gray-50 dark:bg-gray-900"
                  aria-label="Copiar email"
                >
                  <FaClipboard />
                  {copied ? "Copiado" : "Copiar email"}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm bg-gray-50 dark:bg-gray-900"
                >
                  Descargar vCard
                </button>
              </div>
            </div>

            {/* GRID INPUTS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Nombre</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  name="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "error-name" : undefined}
                  placeholder="Tu nombre"
                  className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-transparent ${
                    errors.name ? "border-rose-500" : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.name && (
                  <span id="error-name" className="text-rose-600 text-sm mt-1">
                    {errors.name}
                  </span>
                )}
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium mb-1">Correo</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  name="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "error-email" : undefined}
                  placeholder="tu@correo.com"
                  className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-transparent ${
                    errors.email ? "border-rose-500" : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.email && (
                  <span id="error-email" className="text-rose-600 text-sm mt-1">
                    {errors.email}
                  </span>
                )}
              </label>
            </div>

            <label className="flex flex-col mt-3">
              <span className="text-sm font-medium mb-1">Asunto (opcional)</span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                type="text"
                name="subject"
                placeholder="Sobre..."
                className="px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-transparent"
              />
            </label>

            {/* honeypot (oculto para usuarios reales) */}
            <label style={{ position: "absolute", left: "-9999px", top: "auto", width: "1px", height: "1px", overflow: "hidden" }}>
              Si ves este campo, no envíes.
              <input value={website} onChange={(e) => setWebsite(e.target.value)} name="website" tabIndex={-1} autoComplete="nope" />
            </label>

            <label className="flex flex-col mt-3">
              <span className="text-sm font-medium mb-1">Mensaje</span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                name="message"
                rows={6}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "error-message" : undefined}
                placeholder="Contame sobre tu proyecto, la duda o la propuesta..."
                className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-transparent resize-none ${
                  errors.message ? "border-rose-500" : "border-gray-200 dark:border-gray-700"
                }`}
              />
              {errors.message && (
                <span id="error-message" className="text-rose-600 text-sm mt-1">
                  {errors.message}
                </span>
              )}
            </label>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-md bg-cyan-600 text-white font-medium hover:bg-cyan-500 disabled:opacity-60 disabled:cursor-not-allowed"
                aria-disabled={sending}
              >
                {sending ? (
                  <svg
                    className="animate-spin -ml-1 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                {sending ? "Enviando..." : "Enviar mensaje"}
              </button>

              <button
                type="button"
                onClick={() => {
                  // quick fallback to mail client
                  window.location.href = buildMailto();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-transparent text-sm"
              >
                Abrir cliente
              </button>

              <div className="ml-auto text-xs text-muted-foreground">Protegido por honeypot • Sin spam</div>
            </div>
          </motion.form>

          {/* CONTACT CARDS / LINKS */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            viewport={{ once: true }}
            className="space-y-4"
            aria-label="Enlaces de contacto"
          >
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold mb-2">Contacto directo</h3>
              <p className="text-sm text-muted-foreground mb-3">También podés contactarme directamente por estos canales:</p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-cyan-600" />
                    <div className="text-sm">
                      <div className="font-medium">{CONTACT_EMAIL}</div>
                      <div className="text-xs text-muted-foreground">Respuesta en ~4h</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="px-2 py-1 rounded-md border text-sm"
                      aria-label="Copiar email"
                    >
                      {copied ? "Copiado" : "Copiar"}
                    </button>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="px-2 py-1 rounded-md border text-sm"
                      aria-label="Enviar email"
                    >
                      Abrir
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {contactLinks
                    .filter((c) => c.name !== "Email")
                    .map((c) => (
                      <a
                        key={c.name}
                        href={c.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-gray-50 dark:hover:bg-gray-700"
                        aria-label={`Abrir ${c.name}`}
                      >
                        <span className="text-lg">{c.icon}</span>
                        <span className="text-sm">{c.name}</span>
                      </a>
                    ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-semibold mb-2">Detalles útiles</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>Zona horaria: Argentina (GMT-3)</li>
                <li>Disponibilidad: Freelance / remoto / hibrido</li>
                <li>Idiomas: Español (nativo), Inglés (avanzado)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-cyan-600 to-cyan-400 text-white p-4 rounded-xl shadow-lg">
              <h4 className="text-sm font-semibold mb-1">¿Buscas QA, Automation o Dev?</h4>
              <p className="text-sm mb-3">Puedo ayudarte con el testing de tu app/web con pipelines CI, E2E, API o desarrollando. No dudes en contactarme!</p>

            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
