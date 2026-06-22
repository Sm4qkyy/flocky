import { useEffect, useRef, useState, useCallback } from "react";
import MagicRings from "./MagicRings/MagicRings";

/* ─────────────── TOKENS ─────────────── */

const C = {
  bg: "#060a1a",
  bgDeep: "#04071a",
  bgAlt: "#0a0f24",
  surface: "rgba(16, 22, 44, 0.55)",
  surfaceSolid: "#0d1226",
  border: "rgba(136, 197, 255, 0.08)",
  borderSoft: "rgba(136, 197, 255, 0.18)",
  borderStrong: "rgba(136, 197, 255, 0.32)",
  text: "#dbe9ff",
  textBright: "#ffffff",
  textMuted: "#5a6582",
  textSubtle: "#7d8db0",
  accent: "#88c5ff",
  accentBright: "#aedcff",
  accentDeep: "#3d7dc8",
};

const F = {
  display: "'Sora', 'Plus Jakarta Sans', sans-serif",
  sans: "'Plus Jakarta Sans', 'Inter', sans-serif",
  mono: "'Space Mono', monospace",
};

const GITHUB_URL = "https://github.com/Sm4qkyy";
const DISCORD_INVITE = "https://discord.gg/2faKNKjDPv";
const EMAIL = "flocky88@outlook.com";
const DISCORD_USERNAME = "flocky._";

/* ─────────────── DATA ─────────────── */

const ROLES = [
  { label: "Software Development", icon: "code" },
  { label: "Full Stack Web Dev", icon: "web" },
  { label: "Creative Coding", icon: "spark" },
  { label: "3D & Shaders", icon: "cube" },
  { label: "Music & Audio", icon: "wave" },
];

const TECH = [
  "react", "typescript", "javascript", "nodedotjs", "python", "rust",
  "vite", "tailwindcss", "css3", "html5", "git", "github",
  "vercel", "cloudflare", "docker", "linux", "postgresql", "mongodb",
  "figma", "blender", "threedotjs", "nextdotjs", "express", "npm",
];

const PROJECTS = [
  { name: "Project One", desc: "Coming soon.", link: GITHUB_URL },
  { name: "Project Two", desc: "Coming soon.", link: GITHUB_URL },
  { name: "Project Three", desc: "Coming soon.", link: GITHUB_URL },
];

/* ─────────────── GLOBAL CSS ─────────────── */

const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html, body { scroll-behavior: smooth; }
body {
  margin: 0;
  background: ${C.bg};
  color: ${C.text};
  font-family: ${F.sans};
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
img { display: block; max-width: 100%; }
input, textarea { font: inherit; color: inherit; }

/* ambient backdrop spotlight */
body::before {
  content: "";
  position: fixed;
  top: -10%;
  left: 50%;
  transform: translateX(-50%);
  width: 90vw;
  height: 60vh;
  background: radial-gradient(ellipse at center, rgba(136,197,255,.10) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* grain */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  opacity: .04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity .7s ease, transform .7s ease;
}
.reveal.in { opacity: 1; transform: translateY(0); }

/* ── NAV ── */
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem clamp(1.25rem, 4vw, 3rem);
  transition: background .3s, backdrop-filter .3s, border-color .3s;
}
.nav.scrolled {
  background: rgba(6,10,26,.72);
  border-bottom: 1px solid ${C.border};
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
}
.logo-mark {
  width: 36px; height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(136,197,255,.18), rgba(136,197,255,.04));
  border: 1px solid ${C.borderSoft};
  color: ${C.accent};
}
.nav-cta {
  font-family: ${F.sans};
  font-size: .82rem;
  font-weight: 500;
  padding: .55rem 1.2rem;
  border-radius: 9999px;
  border: 1px solid ${C.borderSoft};
  color: ${C.text};
  background: rgba(136,197,255,.04);
  transition: background .2s, border-color .2s, color .2s, box-shadow .2s;
}
.nav-cta:hover {
  background: rgba(136,197,255,.14);
  border-color: ${C.borderStrong};
  box-shadow: 0 0 24px rgba(136,197,255,.12);
}

/* ── SECTION ── */
.section {
  position: relative;
  padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 3rem);
  z-index: 1;
}
.section-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  font-family: ${F.sans};
  font-size: .82rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: ${C.textSubtle};
}
.section-label::before, .section-label::after {
  content: "";
  flex: 1;
  max-width: 120px;
  height: 1px;
  border-top: 1px dashed ${C.borderSoft};
}

/* ── HERO FRAME ── */
.hero-frame {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem);
  border: 1px solid ${C.border};
  border-radius: 4px;
}
.hero-frame::before,
.hero-frame::after,
.hero-frame > .corner-bl,
.hero-frame > .corner-br {
  content: "";
  position: absolute;
  width: 14px;
  height: 14px;
  background:
    linear-gradient(to right, ${C.borderSoft}, ${C.borderSoft}) center / 100% 1px no-repeat,
    linear-gradient(to bottom, ${C.borderSoft}, ${C.borderSoft}) center / 1px 100% no-repeat;
  transform: rotate(45deg);
}
.hero-frame::before { top: -7px; left: -7px; }
.hero-frame::after  { top: -7px; right: -7px; }
.hero-frame .corner-bl { bottom: -7px; left: -7px; }
.hero-frame .corner-br { bottom: -7px; right: -7px; }

.welcome-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-family: ${F.sans};
  font-size: .78rem;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: ${C.textSubtle};
}
.welcome-label::before, .welcome-label::after {
  content: "";
  flex: 1;
  max-width: 90px;
  height: 1px;
  border-top: 1px dashed ${C.borderSoft};
}

.hero-name {
  margin: 0;
  font-family: ${F.display};
  font-weight: 700;
  font-size: clamp(3.4rem, 9vw, 6.2rem);
  letter-spacing: -.02em;
  line-height: 1;
  text-align: center;
  background: linear-gradient(180deg, ${C.accentBright} 0%, ${C.accent} 60%, ${C.accentDeep} 110%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 18px rgba(136,197,255,.18));
}
.hero-sub {
  margin: 1.4rem 0 .35rem;
  text-align: center;
  font-family: ${F.sans};
  font-size: 1rem;
  font-weight: 500;
  color: ${C.text};
  letter-spacing: .04em;
}
.hero-tagline {
  text-align: center;
  font-family: ${F.mono};
  font-size: .78rem;
  letter-spacing: .04em;
  color: ${C.textMuted};
}
.hero-socials {
  display: flex;
  justify-content: center;
  gap: 1.1rem;
  margin-top: 1.75rem;
}
.social-link {
  width: 38px; height: 38px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  border: 1px solid ${C.borderSoft};
  background: rgba(136,197,255,.04);
  color: ${C.text};
  transition: background .2s, border-color .2s, transform .2s, color .2s;
}
.social-link:hover {
  background: rgba(136,197,255,.14);
  border-color: ${C.borderStrong};
  color: ${C.accentBright};
  transform: translateY(-2px);
}

/* ── ROLES ROW ── */
.roles-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  max-width: 820px;
  margin: 4rem auto 0;
}
.role {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.role::after {
  content: "";
  position: absolute;
  top: 28px;
  left: 60%;
  width: 80%;
  height: 1px;
  border-top: 1px dashed ${C.borderSoft};
  z-index: 0;
}
.role:last-child::after { display: none; }
.role-icon {
  position: relative;
  z-index: 1;
  width: 56px; height: 56px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  border: 1px solid ${C.borderSoft};
  background: linear-gradient(135deg, rgba(136,197,255,.10), rgba(13,18,38,.9));
  color: ${C.accent};
  margin-bottom: .9rem;
  transition: border-color .25s, box-shadow .25s, transform .25s;
}
.role:hover .role-icon {
  border-color: ${C.borderStrong};
  box-shadow: 0 0 24px rgba(136,197,255,.18);
  transform: translateY(-2px);
}
.role-label {
  font-family: ${F.sans};
  font-size: .72rem;
  letter-spacing: .04em;
  color: ${C.textSubtle};
  text-align: center;
  max-width: 110px;
  line-height: 1.3;
}

/* ── ABOUT PARAGRAPH ── */
.about-text {
  max-width: 640px;
  margin: 4rem auto 0;
  text-align: center;
  font-family: ${F.sans};
  font-size: .95rem;
  line-height: 1.85;
  color: ${C.textSubtle};
}

/* ── TECH GRID ── */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: .8rem;
  max-width: 860px;
  margin: 0 auto;
}
.tech-tile {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border-radius: 10px;
  border: 1px solid ${C.border};
  background:
    linear-gradient(135deg, rgba(136,197,255,.06), rgba(13,18,38,.4));
  transition: border-color .25s, background .25s, transform .2s;
}
.tech-tile:hover {
  border-color: ${C.borderStrong};
  background: linear-gradient(135deg, rgba(136,197,255,.12), rgba(13,18,38,.6));
  transform: translateY(-2px);
}
.tech-tile img {
  width: 56%;
  height: 56%;
  opacity: .82;
  filter: brightness(1.1);
}

/* ── SHOWCASE DEVICE ── */
.showcase {
  position: relative;
  max-width: 720px;
  margin: 5rem auto 0;
  aspect-ratio: 1.9;
  border-radius: 18px;
  border: 1px solid ${C.borderSoft};
  background:
    radial-gradient(ellipse at center, rgba(136,197,255,.06), transparent 65%),
    linear-gradient(135deg, #0a1024, #060a1a);
  overflow: hidden;
  display: grid;
  place-items: center;
}
.showcase-rings {
  position: absolute;
  inset: 0;
  opacity: .9;
}
.showcase-screen {
  position: relative;
  z-index: 2;
  width: 60%;
  aspect-ratio: 1.7;
  border-radius: 12px;
  border: 1px solid ${C.borderStrong};
  background: rgba(6,10,26,.85);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  box-shadow: 0 0 60px rgba(136,197,255,.15);
}
.showcase-screen .logo-big {
  font-family: ${F.display};
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 3.4rem);
  letter-spacing: -.02em;
  background: linear-gradient(180deg, ${C.accentBright}, ${C.accentDeep});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* ── PROJECTS ── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  max-width: 980px;
  margin: 0 auto;
}
.project-card {
  position: relative;
  aspect-ratio: 0.75;
  border-radius: 14px;
  border: 1px solid ${C.border};
  background: linear-gradient(180deg, rgba(20,28,55,.65), rgba(10,14,30,.6));
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: border-color .25s, transform .25s, box-shadow .25s;
  overflow: hidden;
}
.project-card::before {
  content: "";
  position: absolute;
  inset: 1.25rem 1.25rem 5.5rem;
  border-radius: 8px;
  background:
    repeating-linear-gradient(45deg, rgba(136,197,255,.03) 0 10px, transparent 10px 20px),
    rgba(8,12,28,.6);
  border: 1px solid ${C.border};
}
.project-card:hover {
  border-color: ${C.borderStrong};
  transform: translateY(-4px);
  box-shadow: 0 14px 50px rgba(0,0,0,.5);
}
.project-bar {
  height: 8px;
  width: 60%;
  border-radius: 4px;
  background: rgba(136,197,255,.18);
  margin-bottom: .6rem;
}
.project-bar.long { width: 80%; }
.project-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: .6rem;
}
.project-gh {
  width: 28px; height: 28px;
  display: grid;
  place-items: center;
  border-radius: 6px;
  background: rgba(136,197,255,.08);
  border: 1px solid ${C.borderSoft};
  color: ${C.text};
  transition: background .2s, color .2s;
}
.project-gh:hover { background: rgba(136,197,255,.2); color: ${C.accentBright}; }

/* ── CONTACT ── */
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 980px;
  margin: 0 auto;
  align-items: center;
}
.contact-heading {
  margin: 0;
  font-family: ${F.display};
  font-weight: 700;
  font-size: clamp(2.1rem, 4.4vw, 3rem);
  line-height: 1.15;
  letter-spacing: -.02em;
  color: ${C.text};
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.field {
  position: relative;
  border-bottom: 1px solid ${C.borderSoft};
  transition: border-color .2s;
}
.field:focus-within { border-color: ${C.accent}; }
.field label {
  display: block;
  font-family: ${F.sans};
  font-size: .78rem;
  color: ${C.textMuted};
  margin-bottom: .35rem;
}
.field input, .field textarea {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  padding: .5rem 0 .85rem;
  font-family: ${F.sans};
  font-size: .95rem;
  color: ${C.text};
}
.field textarea { resize: vertical; min-height: 60px; }
.submit-button {
  align-self: flex-start;
  margin-top: 1rem;
  padding: .85rem 1.6rem;
  border-radius: 9999px;
  border: 1px solid ${C.borderStrong};
  background: linear-gradient(135deg, rgba(136,197,255,.16), rgba(136,197,255,.04));
  color: ${C.accentBright};
  font-family: ${F.sans};
  font-size: .82rem;
  font-weight: 500;
  letter-spacing: .02em;
  transition: background .2s, box-shadow .2s, transform .15s;
}
.submit-button:hover {
  background: linear-gradient(135deg, rgba(136,197,255,.26), rgba(136,197,255,.08));
  box-shadow: 0 0 26px rgba(136,197,255,.2);
  transform: translateY(-1px);
}

/* ── FOOTER ── */
.footer {
  position: relative;
  padding: 4.5rem 1.25rem 3rem;
  text-align: center;
}
.footer::before {
  content: "";
  position: absolute;
  top: 0; left: 50%;
  transform: translateX(-50%);
  width: min(720px, 80%);
  height: 1px;
  border-top: 1px dashed ${C.borderSoft};
}
.footer-bye {
  font-family: ${F.display};
  font-weight: 600;
  font-size: 1.4rem;
  color: ${C.text};
  margin-bottom: .25rem;
}
.footer-sub {
  font-family: ${F.mono};
  font-size: .72rem;
  letter-spacing: .15em;
  color: ${C.textMuted};
  text-transform: uppercase;
}

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .tech-grid { grid-template-columns: repeat(6, 1fr); }
  .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
}
@media (max-width: 720px) {
  .roles-row { grid-template-columns: repeat(2, 1fr); gap: 1.5rem 0; }
  .role::after { display: none; }
  .role-label { max-width: 140px; }
  .projects-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: repeat(5, 1fr); }
  .hero-frame { padding: 2.4rem 1.25rem; }
  .showcase-screen { width: 78%; }
}
`;

/* ─────────────── UTILS ─────────────── */

function InjectStyles() {
  useEffect(() => {
    const id = "flocky-global-styles";
    if (document.getElementById(id)) return undefined;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = globalCss;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);
  return null;
}

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("in");
        observer.unobserve(el);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, style }) {
  const ref = useReveal();
  return (
    <div ref={ref} className="reveal" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ─────────────── ICONS ─────────────── */

const Icon = ({ name, size = 18 }) => {
  const stroke = "currentColor";
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "github":
      return <svg {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 6.77 5.07 5.07 0 0 0 19.91 3S18.73 2.65 16 4.55a13.38 13.38 0 0 0-7 0C6.27 2.65 5.09 3 5.09 3A5.07 5.07 0 0 0 5 6.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 20.13V24"/></svg>;
    case "discord":
      return <svg {...props}><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>;
    case "mail":
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "linkedin":
      return <svg {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
    case "logo":
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 11l3-2 3 2v4l-3 2-3-2v-4z" fill="currentColor" opacity=".9"/></svg>;
    case "code":
      return <svg {...props}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case "web":
      return <svg {...props}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "spark":
      return <svg {...props}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>;
    case "cube":
      return <svg {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
    case "wave":
      return <svg {...props}><path d="M3 12h2l2-6 4 12 4-12 2 6h4"/></svg>;
    case "arrow":
      return <svg {...props}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    default:
      return null;
  }
};

/* ─────────────── NAV ─────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav${scrolled ? " scrolled" : ""}`}>
      <a href="#hero" className="logo-mark" aria-label="Home">
        <Icon name="logo" />
      </a>
      <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="nav-cta">
        View Github
      </a>
    </nav>
  );
}

/* ─────────────── HERO ─────────────── */

function Hero() {
  return (
    <section id="hero" className="section" style={{ paddingTop: "8rem" }}>
      <Reveal>
        <div className="hero-frame">
          <span className="corner-bl" />
          <span className="corner-br" />
          <div className="welcome-label">Welcome to</div>
          <h1 className="hero-name">Flocky's</h1>
          <div className="hero-sub">Developer Portfolio</div>
          <div className="hero-tagline">Converting caffeine into code</div>
          <div className="hero-socials">
            <a className="social-link" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Icon name="github" />
            </a>
            <a className="social-link" href={DISCORD_INVITE} target="_blank" rel="noreferrer" aria-label="Discord">
              <Icon name="discord" />
            </a>
            <a className="social-link" href={`mailto:${EMAIL}`} aria-label="Email">
              <Icon name="mail" />
            </a>
          </div>
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="roles-row">
          {ROLES.map((r) => (
            <div key={r.label} className="role">
              <div className="role-icon"><Icon name={r.icon} size={22} /></div>
              <div className="role-label">{r.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={200}>
        <p className="about-text">
          I'm Flocky — a developer who builds for the web, plays with shaders,
          and tinkers with sound. I care about clean code, thoughtful UI, and the
          tiny details that make products feel alive. Always open to collaborate.
        </p>
      </Reveal>
    </section>
  );
}

/* ─────────────── TECH STACK ─────────────── */

function TechStack() {
  return (
    <section id="tech" className="section">
      <Reveal>
        <div className="section-label">Tech Stack</div>
      </Reveal>
      <Reveal delay={80}>
        <div className="tech-grid">
          {TECH.map((slug) => (
            <div key={slug} className="tech-tile">
              <img
                src={`https://cdn.simpleicons.org/${slug}/dbe9ff`}
                alt={slug}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="showcase">
          <div className="showcase-rings" aria-hidden="true">
            <MagicRings
              color="#88c5ff"
              colorTwo="#3d7dc8"
              ringCount={6}
              speed={0.4}
              attenuation={3}
              lineThickness={10}
              baseRadius={0.15}
              radiusStep={0.16}
              scaleRate={0.3}
              opacity={0.7}
              blur={20}
              noiseAmount={0.04}
              ringGap={1.4}
              fadeIn={0.5}
              fadeOut={0.4}
              followMouse
              mouseInfluence={0.1}
              parallax={0.02}
            />
          </div>
          <div className="showcase-screen">
            <div className="logo-big">FLOCKY</div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── PROJECTS ─────────────── */

function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <div className="section-label">Projects</div>
      </Reveal>
      <Reveal delay={80}>
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <div key={p.name} className="project-card">
              <div className="project-bar long" />
              <div className="project-footer">
                <div className="project-bar" />
                <a className="project-gh" href={p.link} target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Icon name="github" size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── CONTACT ─────────────── */

function Contact() {
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", note: "" });
  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Hi from ${form.name || "the web"}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nWhatsApp: ${form.whatsapp}\nEmail: ${form.email}\n\n${form.note}`
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }, [form]);

  return (
    <section id="contact" className="section">
      <div className="contact-grid">
        <Reveal>
          <h2 className="contact-heading">
            Feel free to fill<br />up your details,<br />
            <span style={{ color: C.textSubtle, fontWeight: 500 }}>
              I will reach out to you asap
            </span>
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="field">
              <label htmlFor="name">Your name</label>
              <input id="name" type="text" required value={form.name} onChange={onChange("name")} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">WhatsApp No.</label>
              <input id="whatsapp" type="tel" value={form.whatsapp} onChange={onChange("whatsapp")} />
            </div>
            <div className="field">
              <label htmlFor="email">Email Address</label>
              <input id="email" type="email" required value={form.email} onChange={onChange("email")} />
            </div>
            <div className="field">
              <label htmlFor="note">Note (optional)</label>
              <textarea id="note" rows={2} value={form.note} onChange={onChange("note")} />
            </div>
            <button type="submit" className="submit-button">
              Let's schedule a meet
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── FOOTER ─────────────── */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-bye">Bye</div>
      <div className="footer-sub">Do Visit Again</div>
    </footer>
  );
}

/* ─────────────── APP ─────────────── */

export default function App() {
  return (
    <>
      <InjectStyles />
      <Nav />
      <Hero />
      <TechStack />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}
