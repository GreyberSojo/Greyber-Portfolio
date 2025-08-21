// src/components/Contact.tsx
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
import { useTranslations } from "next-intl";

/* ==== Config ==== */
const CONTACT_EMAIL = "greybersojo@gmail.com";
const CONTACT_NAME = "Greyber Sojo";

/* ==== Prefers reduced motion ==== */
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

type ContactLink = { name: string; link: string; icon: React.ReactNode };

export default function Contact() {
  const t = useTranslations("contact");
  const reduce = usePrefersReducedMotion();

  // social / quick links
  const contactLinks: ContactLink[] = [
    { name: "Email", link: `mailto:${CONTACT_EMAIL}`, icon: <FaEnvelope /> },
    { name: "LinkedIn", link: "https://linkedin.com/in/greyber-sojo", icon: <FaLinkedin /> },
    { name: "GitHub", link: "https://github.com/GreyberSojo", icon: <FaGithub /> },
    { name: "Itch.io", link: "https://itch.io/profile", icon: <FaItchIo /> },
  ];

  /* ==== Form state ==== */
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

  // Autosave
  useEffect(() => {
    const payload = { name, email, subject, message, savedAt: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota */
    }
  }, [name, email, subject, message]);

  // Validation
  const validateEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());
  function validateForm() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t("validation.nameRequired");
    if (!email.trim()) errs.email = t("validation.emailRequired");
    else if (!validateEmail(email)) errs.email = t("validation.emailInvalid");
    if (!message.trim() || message.trim().length < 10)
      errs.message = t("validation.messageMin");
    if (website.trim()) errs.website = t("validation.websiteSpam");
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // mailto fallback
  function buildMailto(): string {
    const subjectEncoded = encodeURIComponent(subject || `Contacto desde web - ${CONTACT_NAME}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${message}`);
    return `mailto:${CONTACT_EMAIL}?subject=${subjectEncoded}&body=${body}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setStatusMessage(null);
    if (!validateForm()) {
      setStatus("error");
      setStatusMessage(t("status.errorFix"));
      return;
    }

    setSending(true);
    const payload = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        setStatusMessage(t("status.success"));
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        localStorage.removeItem(STORAGE_KEY);
        setErrors({});
      } else {
        const text = await res.text().catch(() => null);
        console.warn("API responded non-OK:", res.status, text);
        setStatus("error");
        setStatusMessage(t("status.serverError"));
        window.setTimeout(() => {
          window.location.href = buildMailto();
        }, 500);
      }
    } catch (err) {
      console.warn("Error enviando a /api/contact:", err);
      setStatus("error");
      setStatusMessage(t("status.noBackend"));
      window.setTimeout(() => {
        window.location.href = buildMailto();
      }, 500);
    } finally {
      setSending(false);
    }
  }

  // Copy email to clipboard
  const handleCopyEmail = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(CONTACT_EMAIL);
      } else {
        const ta = document.createElement("textarea");
        ta.value = CONTACT_EMAIL;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  // vCard
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

  // Success badge
  const SuccessBadge = () => (
    <motion.div
      initial={reduce ? false : { scale: 0.9, opacity: 0 }}
      animate={reduce ? {} : { scale: 1, opacity: 1 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 18 }}
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
      style={{
        background: "color-mix(in oklab, var(--primary) 18%, var(--background))",
        color: "color-mix(in oklab, var(--primary) 75%, var(--foreground))",
        border: "1px solid",
        borderColor: "color-mix(in oklab, var(--primary) 35%, var(--border))",
      }}
      role="status"
      aria-live="polite"
    >
      ✓ Enviado
    </motion.div>
  );

  return (
    <section
      id="contact"
      className="py-20 px-6 scroll-mt-24 bg-background text-foreground"
      aria-labelledby="contact-heading"
    >
      {/* Fondo suave con la marca */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom right, color-mix(in oklab, var(--primary) 5%, var(--background)), var(--background))",
        }}
      />
      {/* Grid muy sutil */}
      <div
        aria-hidden
        className="
          absolute inset-0
          opacity-[0.03] dark:opacity-[0.06]
          bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_16%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_16%,transparent)_1px,transparent_1px)]
          bg-[size:32px_32px]
        "
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <motion.h2
          id="contact-heading"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6 text-center"
        >
          {t("title")} <span className="text-primary">{t("contact")}</span>
        </motion.h2>

        <p className="text-center text-sm text-foreground/70 max-w-2xl mx-auto mb-8">
          {t("intro")}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* FORM */}
          <motion.form
            onSubmit={handleSubmit}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl border shadow-sm bg-card/90 backdrop-blur"
            aria-describedby="contact-form-desc"
            style={{ borderColor: "var(--border)" }}
          >
            <div id="contact-form-desc" className="sr-only">
              {t("formDesc")}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between mb-4 gap-3">
              <div aria-live="polite">
                {status === "success" && <SuccessBadge />}
                {status === "error" && statusMessage && (
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                    style={{
                      background:
                        "color-mix(in oklab, var(--destructive) 12%, var(--background))",
                      color:
                        "color-mix(in oklab, var(--destructive) 70%, var(--foreground))",
                      border: "1px solid",
                      borderColor:
                        "color-mix(in oklab, var(--destructive) 35%, var(--border))",
                    }}
                    role="status"
                  >
                    ⚠ {statusMessage}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm bg-transparent"
                  style={{ borderColor: "var(--border)" }}
                  aria-label={t("aria.copyEmail")}
                >
                  <FaClipboard />
                  {copied ? t("buttons.copied") : t("buttons.copyEmail")}
                </button>

                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md border text-sm bg-transparent"
                  style={{ borderColor: "var(--border)" }}
                >
                  Descargar vCard
                </button>
              </div>
            </div>

            {/* Grid inputs */}
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
                  placeholder={t("placeholders.name")}
                  className="px-3 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.name
                      ? "color-mix(in oklab, var(--destructive) 50%, var(--border))"
                      : "var(--border)",
                    boxShadow: "none",
                    outlineColor: "transparent",
                  }}
                />
                {errors.name && (
                  <span id="error-name" className="text-sm mt-1"
                    style={{ color: "color-mix(in oklab, var(--destructive) 70%, var(--foreground))" }}>
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
                  placeholder={t("placeholders.email")}
                  className="px-3 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2"
                  style={{
                    borderColor: errors.email
                      ? "color-mix(in oklab, var(--destructive) 50%, var(--border))"
                      : "var(--border)",
                  }}
                />
                {errors.email && (
                  <span id="error-email" className="text-sm mt-1"
                    style={{ color: "color-mix(in oklab, var(--destructive) 70%, var(--foreground))" }}>
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
                placeholder={t("placeholders.subject")}
                className="px-3 py-2 rounded-md border bg-transparent focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--border)" }}
              />
            </label>

            {/* honeypot oculto */}
            <label
              style={{
                position: "absolute",
                left: "-9999px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
            >
              {t("honeypotLabel")}
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                name="website"
                tabIndex={-1}
                autoComplete="nope"
              />
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
                placeholder={t("placeholders.message")}
                className="px-3 py-2 rounded-md border bg-transparent resize-none focus:outline-none focus:ring-2"
                style={{
                  borderColor: errors.message
                    ? "color-mix(in oklab, var(--destructive) 50%, var(--border))"
                    : "var(--border)",
                }}
              />
              {errors.message && (
                <span id="error-message" className="text-sm mt-1"
                  style={{ color: "color-mix(in oklab, var(--destructive) 70%, var(--foreground))" }}>
                  {errors.message}
                </span>
              )}
            </label>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-3 px-5 py-2 rounded-md font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                aria-disabled={sending}
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                  boxShadow: "0 10px 25px 0 color-mix(in oklab, var(--primary) 20%, transparent)",
                }}
              >
                {sending ? (
                  <svg
                    className="animate-spin -ml-1 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                {sending ? t("buttons.sending") : t("buttons.sendMessage")}
              </button>

              <button
                type="button"
                onClick={() => (window.location.href = buildMailto())}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border bg-transparent text-sm"
                style={{ borderColor: "var(--border)" }}
              >
                {t("buttons.openClient")}
              </button>

              <div className="ml-auto text-xs text-foreground/60">
                {t("honeypotInfo")}
              </div>
            </div>
          </motion.form>

          {/* CONTACT CARDS / LINKS */}
          <motion.aside
            initial={reduce ? false : { opacity: 0, y: 10 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            viewport={{ once: true }}
            className="space-y-4"
            aria-label={t("aria.contactLinks")}
          >
            <div
              className="p-4 rounded-xl border shadow-sm bg-card/90 backdrop-blur"
              style={{ borderColor: "var(--border)" }}
            >
              <h3 className="text-sm font-semibold mb-2">{t("aside.directContact")}</h3>
              <p className="text-sm text-foreground/70 mb-3">
                {t("aside.alsoContact")}
              </p>

              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md border"
                      style={{
                        borderColor: "color-mix(in oklab, var(--primary) 35%, var(--border))",
                        color: "color-mix(in oklab, var(--primary) 75%, var(--foreground))",
                        background: "color-mix(in oklab, var(--primary) 10%, var(--background))",
                      }}
                    >
                      <FaEnvelope />
                    </span>
                    <div className="text-sm">
                      <div className="font-medium">{CONTACT_EMAIL}</div>
                      <div className="text-xs text-foreground/60">{t("aside.responseTime")}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyEmail}
                      className="px-2 py-1 rounded-md border text-sm bg-transparent"
                      style={{ borderColor: "var(--border)" }}
                      aria-label={t("aria.copyEmail")}
                    >
                      {copied ? t("buttons.copied") : t("buttons.copy")}
                    </button>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="px-2 py-1 rounded-md border text-sm bg-transparent"
                      style={{ borderColor: "var(--border)" }}
                      aria-label={t("aria.openEmail")}
                    >
                      {t("buttons.open")}
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
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md border transition-colors"
                        style={{
                          borderColor: "var(--border)",
                          background:
                            "color-mix(in oklab, var(--foreground) 4%, var(--background))",
                        }}
                        aria-label={`${t("buttons.open")} ${c.name}`}
                      >
                        <span className="text-lg">{c.icon}</span>
                        <span className="text-sm">{c.name}</span>
                      </a>
                    ))}
              </div>
            </div>
            </div>

            <div
              className="p-4 rounded-xl border shadow-sm bg-card/90 backdrop-blur"
              style={{ borderColor: "var(--border)" }}
            >
              <h4 className="text-sm font-semibold mb-2">{t("aside.usefulDetails")}</h4>
              <ul className="text-sm space-y-2 text-foreground/70">
                <li>{t("aside.timezone")}</li>
                <li>{t("aside.availability")}</li>
                <li>{t("aside.languages")}</li>
              </ul>
            </div>

            <div
              className="p-4 rounded-xl shadow-lg"
              style={{
                background:
                  "linear-gradient(90deg, color-mix(in oklab, var(--primary) 85%, transparent), color-mix(in oklab, var(--primary) 60%, transparent))",
                color: "var(--primary-foreground)",
              }}
            >
              <h4 className="text-sm font-semibold mb-1">
                {t("aside.ctaHeading")}
              </h4>
              <p className="text-sm mb-3">
                {t("aside.ctaText")}
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
