import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import FloatingLines from "./FloatingLines/FloatingLines";

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
  violet: "#c4a5ff",
  cyan: "#88e0d4",
  green: "#1db954",
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
  {
    name: "Voyage Bot",
    tag: "WhatsApp + AI",
    desc: "Live booking bot for a car rental — n8n + Claude, real-time pricing.",
    link: GITHUB_URL,
    accent: "#88c5ff",
  },
  {
    name: "FLOCKY Site",
    tag: "Portfolio",
    desc: "This site. React + Vite, custom WebGL shaders, canvas particles.",
    link: GITHUB_URL,
    accent: "#c4a5ff",
  },
  {
    name: "MARKPC Telegram",
    tag: "Remote control",
    desc: "Telegram bot that controls a Windows PC: screenshot, lock, sleep.",
    link: GITHUB_URL,
    accent: "#88e0d4",
  },
];

const STATS = [
  { label: "Years coding", value: 5, suffix: "+" },
  { label: "Projects shipped", value: 24, suffix: "" },
  { label: "Coffees consumed", value: 9000, suffix: "+" },
  { label: "Hours debugging", value: 2400, suffix: "" },
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

/* ── AURORA BACKDROP ── */
.aurora {
  position: fixed;
  inset: -10%;
  z-index: 0;
  pointer-events: none;
  filter: blur(90px);
  opacity: .55;
}
.aurora-blob {
  position: absolute;
  border-radius: 50%;
  width: 50vw;
  height: 50vw;
  max-width: 800px;
  max-height: 800px;
  mix-blend-mode: screen;
}
.aurora-blob.a {
  background: radial-gradient(circle, rgba(136,197,255,.55), transparent 65%);
  top: -10%;
  left: -10%;
  animation: drift1 28s ease-in-out infinite;
}
.aurora-blob.b {
  background: radial-gradient(circle, rgba(196,165,255,.45), transparent 65%);
  bottom: -10%;
  right: -10%;
  animation: drift2 32s ease-in-out infinite;
}
.aurora-blob.c {
  background: radial-gradient(circle, rgba(136,224,212,.32), transparent 65%);
  top: 30%;
  left: 35%;
  animation: drift3 36s ease-in-out infinite;
}
@keyframes drift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(18vw, 12vh) scale(1.15); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-14vw, -16vh) scale(.9); }
}
@keyframes drift3 {
  0%, 100% { transform: translate(0, 0) scale(.95); }
  50% { transform: translate(8vw, -10vh) scale(1.1); }
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

/* floating lines background + spotlight */
.lines-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: .85;
}
.spotlight-cursor {
  position: fixed;
  top: 0; left: 0;
  width: 360px; height: 360px;
  margin: -180px 0 0 -180px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9995;
  background: radial-gradient(circle, rgba(136,197,255,.16), transparent 60%);
  mix-blend-mode: screen;
  transition: opacity .3s;
}

.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity .8s ease, transform .8s ease;
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
  width: 38px; height: 38px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  background: linear-gradient(135deg, rgba(136,197,255,.22), rgba(196,165,255,.05));
  border: 1px solid ${C.borderSoft};
  color: ${C.accent};
  transition: transform .3s, box-shadow .3s;
}
.logo-mark:hover { transform: rotate(8deg) scale(1.08); box-shadow: 0 0 24px rgba(136,197,255,.3); }

.nav-pills {
  display: flex;
  gap: .25rem;
  padding: .35rem;
  border-radius: 9999px;
  background: rgba(13,18,38,.5);
  border: 1px solid ${C.borderSoft};
  backdrop-filter: blur(10px);
}
.nav-pill {
  font-family: ${F.sans};
  font-size: .78rem;
  font-weight: 500;
  padding: .42rem 1rem;
  border-radius: 9999px;
  color: ${C.textSubtle};
  transition: color .2s, background .2s;
}
.nav-pill:hover { color: ${C.text}; background: rgba(136,197,255,.08); }

.nav-cta {
  font-family: ${F.sans};
  font-size: .82rem;
  font-weight: 500;
  padding: .55rem 1.2rem;
  border-radius: 9999px;
  border: 1px solid ${C.borderSoft};
  color: ${C.text};
  background: linear-gradient(135deg, rgba(136,197,255,.14), rgba(136,197,255,.04));
  transition: background .2s, border-color .2s, box-shadow .2s;
  display: inline-flex;
  align-items: center;
  gap: .5rem;
}
.nav-cta:hover {
  background: linear-gradient(135deg, rgba(136,197,255,.26), rgba(136,197,255,.08));
  border-color: ${C.borderStrong};
  box-shadow: 0 0 24px rgba(136,197,255,.18);
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

/* ── HERO ── */
.hero-frame {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  padding: clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem);
  border: 1px solid ${C.border};
  border-radius: 6px;
  background: linear-gradient(180deg, rgba(13,18,38,.4), rgba(6,10,26,.2));
  backdrop-filter: blur(6px);
}
.hero-frame::before,
.hero-frame::after,
.hero-frame > .corner-bl,
.hero-frame > .corner-br {
  content: "";
  position: absolute;
  width: 16px;
  height: 16px;
  background:
    linear-gradient(to right, ${C.borderStrong}, ${C.borderStrong}) center / 100% 1px no-repeat,
    linear-gradient(to bottom, ${C.borderStrong}, ${C.borderStrong}) center / 1px 100% no-repeat;
  transform: rotate(45deg);
}
.hero-frame::before { top: -8px; left: -8px; }
.hero-frame::after  { top: -8px; right: -8px; }
.hero-frame .corner-bl { bottom: -8px; left: -8px; }
.hero-frame .corner-br { bottom: -8px; right: -8px; }

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
  font-size: clamp(3.6rem, 11vw, 7.4rem);
  letter-spacing: -.02em;
  line-height: 1;
  text-align: center;
  background: linear-gradient(180deg, #ffffff 0%, ${C.accentBright} 35%, ${C.accent} 65%, ${C.accentDeep} 110%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 30px rgba(136,197,255,.25));
}
.hero-sub {
  margin: 1.4rem 0 .4rem;
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
  min-height: 1.2em;
}
.cursor-blink {
  display: inline-block;
  width: .55em;
  background: ${C.accent};
  margin-left: 2px;
  animation: blink 1.1s steps(1) infinite;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

.hero-socials {
  display: flex;
  justify-content: center;
  gap: 1.1rem;
  margin-top: 1.85rem;
}
.social-link {
  width: 40px; height: 40px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  border: 1px solid ${C.borderSoft};
  background: rgba(136,197,255,.04);
  color: ${C.text};
  transition: background .2s, border-color .2s, transform .2s, color .2s, box-shadow .2s;
}
.social-link:hover {
  background: rgba(136,197,255,.16);
  border-color: ${C.borderStrong};
  color: ${C.accentBright};
  transform: translateY(-3px);
  box-shadow: 0 0 22px rgba(136,197,255,.25);
}

.roles-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0;
  max-width: 860px;
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
  border-radius: 13px;
  border: 1px solid ${C.borderSoft};
  background: linear-gradient(135deg, rgba(136,197,255,.10), rgba(13,18,38,.9));
  color: ${C.accent};
  margin-bottom: .9rem;
  transition: border-color .25s, box-shadow .25s, transform .25s;
}
.role:hover .role-icon {
  border-color: ${C.borderStrong};
  box-shadow: 0 0 26px rgba(136,197,255,.25);
  transform: translateY(-3px);
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

.about-text {
  max-width: 640px;
  margin: 4rem auto 0;
  text-align: center;
  font-family: ${F.sans};
  font-size: .95rem;
  line-height: 1.85;
  color: ${C.textSubtle};
}

/* ── STATS ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  max-width: 980px;
  margin: 0 auto;
}
.stat-card {
  position: relative;
  padding: 1.6rem 1.2rem;
  border-radius: 14px;
  border: 1px solid ${C.borderSoft};
  background: linear-gradient(180deg, rgba(16,22,44,.7), rgba(10,14,30,.55));
  text-align: center;
  overflow: hidden;
}
.stat-card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, ${C.borderStrong}, transparent);
}
.stat-number {
  font-family: ${F.display};
  font-weight: 700;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  line-height: 1;
  background: linear-gradient(180deg, ${C.accentBright}, ${C.accent});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat-label {
  margin-top: .65rem;
  font-family: ${F.mono};
  font-size: .68rem;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: ${C.textMuted};
}

/* ── TECH MARQUEE ── */
.marquee-wrap {
  position: relative;
  overflow: hidden;
  padding: 2rem 0;
  border-top: 1px solid ${C.border};
  border-bottom: 1px solid ${C.border};
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.marquee-track {
  display: flex;
  gap: 2.2rem;
  width: max-content;
  animation: marquee 38s linear infinite;
}
.marquee-track.reverse {
  animation: marquee-rev 42s linear infinite;
  margin-top: 1rem;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes marquee-rev {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
.marquee-tile {
  flex-shrink: 0;
  width: 72px; height: 72px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  border: 1px solid ${C.border};
  background: linear-gradient(135deg, rgba(136,197,255,.05), rgba(13,18,38,.5));
  transition: border-color .25s, transform .2s, background .25s;
}
.marquee-tile:hover {
  border-color: ${C.borderStrong};
  background: linear-gradient(135deg, rgba(136,197,255,.14), rgba(13,18,38,.7));
  transform: translateY(-3px);
}
.marquee-tile img {
  width: 52%; height: 52%;
  opacity: .85;
}

/* ── PROJECTS / TILT CARDS ── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 1080px;
  margin: 0 auto;
  perspective: 1200px;
}
.tilt-card {
  position: relative;
  aspect-ratio: 0.82;
  padding: 1.6rem 1.5rem;
  border-radius: 18px;
  border: 1px solid ${C.borderSoft};
  background: linear-gradient(180deg, rgba(20,28,55,.7), rgba(10,14,30,.6));
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform .25s ease-out, border-color .25s, box-shadow .25s;
  transform-style: preserve-3d;
  cursor: pointer;
  overflow: hidden;
  --spot-x: 50%;
  --spot-y: 50%;
  --accent: ${C.accent};
}
.tilt-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 18px;
  background: radial-gradient(circle 250px at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--accent) 25%, transparent), transparent 70%);
  opacity: 0;
  transition: opacity .3s;
  pointer-events: none;
}
.tilt-card:hover {
  border-color: var(--accent);
  box-shadow: 0 24px 60px rgba(0,0,0,.55), 0 0 50px color-mix(in srgb, var(--accent) 22%, transparent);
}
.tilt-card:hover::before { opacity: 1; }
.tilt-preview {
  position: relative;
  flex: 1;
  border-radius: 12px;
  margin-bottom: 1.2rem;
  background:
    repeating-linear-gradient(45deg, rgba(136,197,255,.04) 0 12px, transparent 12px 24px),
    radial-gradient(ellipse at center, color-mix(in srgb, var(--accent) 12%, transparent), rgba(8,12,28,.65));
  border: 1px solid ${C.border};
  overflow: hidden;
  display: grid;
  place-items: center;
  font-family: ${F.display};
  font-weight: 700;
  font-size: 3rem;
  color: rgba(255,255,255,.06);
  letter-spacing: -.04em;
  transform: translateZ(20px);
}
.tilt-tag {
  display: inline-block;
  font-family: ${F.mono};
  font-size: .65rem;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: .55rem;
}
.tilt-title {
  margin: 0;
  font-family: ${F.display};
  font-weight: 600;
  font-size: 1.25rem;
  color: ${C.text};
  letter-spacing: -.01em;
  transform: translateZ(30px);
}
.tilt-desc {
  margin: .5rem 0 0;
  font-family: ${F.sans};
  font-size: .82rem;
  line-height: 1.55;
  color: ${C.textSubtle};
}
.tilt-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}
.tilt-link {
  width: 30px; height: 30px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: rgba(136,197,255,.10);
  border: 1px solid ${C.borderSoft};
  color: ${C.text};
  transition: background .2s, color .2s, transform .2s;
}
.tilt-link:hover { background: rgba(136,197,255,.24); color: ${C.accentBright}; transform: rotate(-12deg); }

/* ── SPOTIFY ── */
.spotify-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 980px;
  margin: 0 auto;
  align-items: stretch;
}
.spotify-now {
  position: relative;
  padding: 2rem;
  border-radius: 18px;
  border: 1px solid ${C.borderSoft};
  background: linear-gradient(160deg, rgba(29,185,84,.06), rgba(16,22,44,.7) 60%);
  overflow: hidden;
}
.spotify-now::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, ${C.green}, ${C.accent}, ${C.violet});
  background-size: 200% 100%;
  animation: nowGradient 4s linear infinite;
}
@keyframes nowGradient {
  0% { background-position: 0 0; }
  100% { background-position: 200% 0; }
}
.spotify-pill {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  font-family: ${F.mono};
  font-size: .68rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: ${C.green};
  margin-bottom: 1.5rem;
}
.spotify-pulse {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${C.green};
  box-shadow: 0 0 12px ${C.green};
  animation: nowPulse 1.4s ease-in-out infinite;
}
@keyframes nowPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(.6); opacity: .55; }
}
.vinyl {
  position: relative;
  width: clamp(180px, 28vw, 240px);
  aspect-ratio: 1;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: radial-gradient(circle at center, #0a0a0a 0%, #0a0a0a 28%, #1a1a1a 29%, #0a0a0a 30%, #1a1a1a 31%, #0a0a0a 32%, #1a1a1a 33%, #0a0a0a 34%, #1a1a1a 35%, #0a0a0a 36%, #1a1a1a 37%, #0a0a0a 38%, #1a1a1a 39%, #0a0a0a 40%, #1a1a1a 41%, #0a0a0a 42%, #1a1a1a 43%, #0a0a0a 44%, #1a1a1a 45%);
  box-shadow: 0 16px 40px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.04);
  animation: spin 14s linear infinite;
}
.vinyl.paused { animation-play-state: paused; }
.vinyl-label {
  position: absolute;
  inset: 32%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  background-color: ${C.bgAlt};
  border: 2px solid #000;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.05);
}
.vinyl-hole {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${C.bg};
  z-index: 2;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.spotify-track-name {
  margin: 0;
  font-family: ${F.display};
  font-weight: 600;
  font-size: 1.05rem;
  color: ${C.text};
  text-align: center;
  letter-spacing: -.01em;
}
.spotify-artist {
  margin-top: .25rem;
  font-family: ${F.sans};
  font-size: .82rem;
  color: ${C.textSubtle};
  text-align: center;
}
.equalizer {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 3px;
  height: 28px;
  margin-top: 1.2rem;
}
.eq-bar {
  width: 4px;
  background: linear-gradient(180deg, ${C.accent}, ${C.green});
  border-radius: 2px;
  animation: eq 1s ease-in-out infinite;
}
.eq-bar:nth-child(1) { animation-delay: -1.1s; }
.eq-bar:nth-child(2) { animation-delay: -.6s; }
.eq-bar:nth-child(3) { animation-delay: -.9s; }
.eq-bar:nth-child(4) { animation-delay: -.4s; }
.eq-bar:nth-child(5) { animation-delay: -1.2s; }
.eq-bar:nth-child(6) { animation-delay: -.7s; }
.eq-bar:nth-child(7) { animation-delay: -.5s; }
@keyframes eq {
  0%, 100% { height: 22%; }
  50% { height: 100%; }
}
.eq-paused .eq-bar { animation-play-state: paused; height: 18%; }

.spotify-recent {
  padding: 2rem;
  border-radius: 18px;
  border: 1px solid ${C.borderSoft};
  background: linear-gradient(160deg, rgba(196,165,255,.04), rgba(16,22,44,.7) 60%);
}
.recent-label {
  font-family: ${F.mono};
  font-size: .68rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: ${C.textSubtle};
  margin-bottom: 1.2rem;
}
.recent-row {
  display: flex;
  align-items: center;
  gap: .85rem;
  padding: .65rem 0;
  border-bottom: 1px solid rgba(136,197,255,.06);
  transition: background .15s;
}
.recent-row:last-child { border-bottom: none; }
.recent-row:hover { background: rgba(136,197,255,.04); }
.recent-num {
  width: 22px;
  font-family: ${F.mono};
  font-size: .7rem;
  color: ${C.textMuted};
  text-align: right;
  flex-shrink: 0;
}
.recent-art {
  width: 38px; height: 38px;
  border-radius: 6px;
  flex-shrink: 0;
  background: linear-gradient(135deg, ${C.bgAlt}, ${C.surfaceSolid});
  background-size: cover;
  background-position: center;
}
.recent-track {
  flex: 1;
  min-width: 0;
}
.recent-name {
  font-family: ${F.sans};
  font-weight: 600;
  font-size: .85rem;
  color: ${C.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recent-artist {
  font-family: ${F.mono};
  font-size: .65rem;
  color: ${C.textMuted};
  margin-top: .15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.recent-time {
  font-family: ${F.mono};
  font-size: .62rem;
  color: ${C.textMuted};
  flex-shrink: 0;
}

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
  transition: border-color .2s, box-shadow .2s;
}
.field:focus-within { border-color: ${C.accent}; box-shadow: 0 1px 0 ${C.accent}, 0 12px 30px -18px ${C.accent}; }
.field label {
  display: block;
  font-family: ${F.sans};
  font-size: .78rem;
  color: ${C.textMuted};
  margin-bottom: .35rem;
  transition: color .2s;
}
.field:focus-within label { color: ${C.accent}; }
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
.magnetic-button {
  position: relative;
  align-self: flex-start;
  margin-top: 1rem;
  padding: .9rem 1.8rem;
  border-radius: 9999px;
  border: 1px solid ${C.borderStrong};
  background: linear-gradient(135deg, rgba(136,197,255,.2), rgba(196,165,255,.08));
  color: ${C.accentBright};
  font-family: ${F.sans};
  font-size: .85rem;
  font-weight: 600;
  letter-spacing: .02em;
  transition: background .2s, box-shadow .25s, transform .15s ease-out;
  overflow: hidden;
}
.magnetic-button:hover {
  background: linear-gradient(135deg, rgba(136,197,255,.34), rgba(196,165,255,.16));
  box-shadow: 0 0 30px rgba(136,197,255,.3);
}
.magnetic-button::after {
  content: "";
  position: absolute;
  top: 0; left: -100%;
  width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
  transition: left .6s;
}
.magnetic-button:hover::after { left: 100%; }

/* ── DOCK ── */
.dock {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 950;
  display: flex;
  gap: .4rem;
  padding: .5rem;
  border-radius: 9999px;
  background: rgba(13,18,38,.65);
  border: 1px solid ${C.borderSoft};
  backdrop-filter: blur(16px) saturate(1.5);
  -webkit-backdrop-filter: blur(16px) saturate(1.5);
  box-shadow: 0 12px 36px rgba(0,0,0,.55);
}
.dock-item {
  position: relative;
  width: 44px; height: 44px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  color: ${C.text};
  background: rgba(136,197,255,.06);
  transition: transform .2s ease-out, background .2s, color .2s;
}
.dock-item:hover {
  background: rgba(136,197,255,.18);
  color: ${C.accentBright};
  transform: translateY(-8px) scale(1.18);
}
.dock-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  font-family: ${F.mono};
  font-size: .62rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: ${C.text};
  background: rgba(13,18,38,.95);
  border: 1px solid ${C.borderSoft};
  padding: .35rem .65rem;
  border-radius: 6px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
}
.dock-item:hover .dock-tooltip { opacity: 1; }

/* ── FOOTER ── */
.footer {
  position: relative;
  padding: 4rem 1.25rem 7rem;
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
  font-weight: 700;
  font-size: 1.6rem;
  background: linear-gradient(135deg, ${C.accentBright}, ${C.violet});
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: .35rem;
}
.footer-sub {
  font-family: ${F.mono};
  font-size: .72rem;
  letter-spacing: .15em;
  color: ${C.textMuted};
  text-transform: uppercase;
}

/* ── RESPONSIVE ── */
@media (max-width: 980px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .spotify-grid { grid-template-columns: 1fr; }
}
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
  .projects-grid { grid-template-columns: 1fr; }
  .spotlight-cursor { display: none; }
  .nav-pills { display: none; }
}
@media (max-width: 720px) {
  .roles-row { grid-template-columns: repeat(2, 1fr); gap: 1.5rem 0; }
  .role::after { display: none; }
  .role-label { max-width: 140px; }
  .hero-frame { padding: 2.4rem 1.25rem; }
  .dock-item { width: 40px; height: 40px; }
}
@media (hover: none), (pointer: coarse) {
  .spotlight-cursor { display: none; }
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

/* ─────────────── DECRYPT TEXT ─────────────── */

function DecryptText({ text, duration = 1400, scramble = "!@#$%&*+-/=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const chars = text.split("");
    const total = chars.length;
    const reveal = 8;
    const tickMs = duration / (total + reveal);
    let frame = 0;
    const interval = setInterval(() => {
      const out = chars.map((c, i) => {
        if (c === " ") return " ";
        if (i < frame - reveal) return c;
        return scramble[Math.floor(Math.random() * scramble.length)];
      }).join("");
      setDisplay(out);
      frame++;
      if (frame > total + reveal) {
        clearInterval(interval);
        setDisplay(text);
      }
    }, tickMs);
    return () => clearInterval(interval);
  }, [text, duration, scramble]);
  return <>{display}</>;
}

/* ─────────────── TYPEWRITER ─────────────── */

function Typewriter({ phrases, typeSpeed = 65, deleteSpeed = 40, holdMs = 1600 }) {
  const [text, setText] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), holdMs);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
      return undefined;
    }
    const t = setTimeout(() => {
      setText((cur) => (deleting ? cur.slice(0, -1) : current.slice(0, cur.length + 1)));
    }, deleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(t);
  }, [text, deleting, phraseIdx, phrases, typeSpeed, deleteSpeed, holdMs]);

  return (
    <>
      {text}
      <span className="cursor-blink" />
    </>
  );
}

/* ─────────────── COUNT UP ─────────────── */

function CountUp({ to, duration = 1600, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.floor(to * eased));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(to);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration]);

  const formatted = val.toLocaleString();
  return <span ref={ref}>{formatted}{suffix}</span>;
}

/* ─────────────── TILT CARD ─────────────── */

function TiltCard({ children, className = "", style, accent = C.accent, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    el.style.setProperty("--spot-x", `${(x + 0.5) * 100}%`);
    el.style.setProperty("--spot-y", `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ "--accent": accent, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
}

/* ─────────────── MAGNETIC BUTTON ─────────────── */

function MagneticButton({ children, className = "", strength = 0.35, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "";
  };
  return (
    <button
      ref={ref}
      className={`magnetic-button ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...rest}
    >
      {children}
    </button>
  );
}

/* ─────────────── SPOTLIGHT CURSOR ─────────────── */

function SpotlightCursor() {
  const ref = useRef(null);
  const pos = useRef({ x: -500, y: -500 });
  const target = useRef({ x: -500, y: -500 });

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.12;
      pos.current.y += (target.current.y - pos.current.y) * 0.12;
      el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="spotlight-cursor" ref={ref} aria-hidden="true" />;
}

/* ─────────────── FLOATING LINES BACKGROUND ─────────────── */

function LinesBackground() {
  return (
    <div className="lines-bg" aria-hidden="true">
      <FloatingLines
        linesGradient={["#88c5ff", "#c4a5ff", "#88e0d4", "#3d7dc8"]}
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={[10, 15, 20]}
        lineDistance={[8, 6, 4]}
        bendRadius={5.0}
        bendStrength={-0.5}
        interactive
        parallax
        parallaxStrength={0.18}
        animationSpeed={0.9}
        mixBlendMode="screen"
      />
    </div>
  );
}

/* ─────────────── ICONS ─────────────── */

const Icon = ({ name, size = 18 }) => {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "github":
      return <svg {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 6.77 5.07 5.07 0 0 0 19.91 3S18.73 2.65 16 4.55a13.38 13.38 0 0 0-7 0C6.27 2.65 5.09 3 5.09 3A5.07 5.07 0 0 0 5 6.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 20.13V24"/></svg>;
    case "discord":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>;
    case "mail":
      return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "logo":
      return <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 7v10l8 5 8-5V7l-8-5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M9 11l3-2 3 2v4l-3 2-3-2v-4z" fill="currentColor" opacity=".9"/></svg>;
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
    case "external":
      return <svg {...props}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
    case "home":
      return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "send":
      return <svg {...props}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
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
      <div className="nav-pills">
        {[["About", "hero"], ["Stack", "tech"], ["Work", "projects"], ["Music", "music"], ["Contact", "contact"]].map(([label, id]) => (
          <a key={id} href={`#${id}`} className="nav-pill">{label}</a>
        ))}
      </div>
      <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="nav-cta">
        <Icon name="github" size={14} /> Github
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
          <h1 className="hero-name">
            <DecryptText text="FLOCKY" duration={1600} />
          </h1>
          <div className="hero-sub">Developer · Creator · Curious mind</div>
          <div className="hero-tagline">
            <Typewriter
              phrases={[
                "Converting caffeine into code.",
                "Shipping shaders and side projects.",
                "Building weird, useful things.",
                "Sound · Pixels · Logic.",
              ]}
            />
          </div>
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
          tiny details that make products feel alive.
        </p>
      </Reveal>
    </section>
  );
}

/* ─────────────── STATS ─────────────── */

function Stats() {
  return (
    <section className="section" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      <Reveal>
        <div className="stats-grid">
          {STATS.map((s) => (
            <div key={s.label} className="stat-card">
              <div className="stat-number">
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── TECH STACK ─────────────── */

function TechStack() {
  const half1 = useMemo(() => TECH.slice(0, 12), []);
  const half2 = useMemo(() => TECH.slice(12), []);
  return (
    <section id="tech" className="section">
      <Reveal>
        <div className="section-label">Tech Stack</div>
      </Reveal>
      <Reveal delay={80}>
        <div className="marquee-wrap">
          <div className="marquee-track">
            {[...half1, ...half1].map((slug, i) => (
              <div key={`a-${slug}-${i}`} className="marquee-tile" title={slug}>
                <img src={`https://cdn.simpleicons.org/${slug}/dbe9ff`} alt={slug} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="marquee-track reverse">
            {[...half2, ...half2].map((slug, i) => (
              <div key={`b-${slug}-${i}`} className="marquee-tile" title={slug}>
                <img src={`https://cdn.simpleicons.org/${slug}/dbe9ff`} alt={slug} loading="lazy" />
              </div>
            ))}
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
        <div className="section-label">Selected Work</div>
      </Reveal>
      <Reveal delay={80}>
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <TiltCard key={p.name} accent={p.accent}>
              <div className="tilt-preview">{p.name.split(" ")[0]}</div>
              <div>
                <div className="tilt-tag">{p.tag}</div>
                <h3 className="tilt-title">{p.name}</h3>
                <p className="tilt-desc">{p.desc}</p>
                <div className="tilt-footer">
                  <span style={{ fontFamily: F.mono, fontSize: ".62rem", color: C.textMuted, letterSpacing: ".1em" }}>
                    VIEW SOURCE
                  </span>
                  <a className="tilt-link" href={p.link} target="_blank" rel="noreferrer" aria-label="GitHub">
                    <Icon name="external" size={13} />
                  </a>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── SPOTIFY ─────────────── */

function timeAgo(ms) {
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function Spotify() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const demoNow = useMemo(() => ({
    name: "Welcome To The Flock",
    artists: [{ name: "FLOCKY" }],
    album: { images: [{ url: "" }] },
    external_urls: { spotify: "#" },
  }), []);

  const demoRecent = useMemo(() => [
    ["Birdcode Jam", "FLOCKY Sound", 1800000],
    ["Feathered Loops", "Lo Fi Flock", 3600000],
    ["Digital Roost", "NestNet", 7200000],
    ["Sunrise Singalong", "The Collective", 10800000],
    ["Sky Patrol", "Flocky", 21600000],
  ].map(([name, artist, age]) => ({
    track: { name, artists: [{ name: artist }], album: { images: [{ url: "" }] } },
    played_at: new Date(Date.now() - age).toISOString(),
  })), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) throw new Error("not ok");
        const json = await res.json();
        if (cancelled) return;
        setData(json);
      } catch {
        if (cancelled) return;
        setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    const id = window.setInterval(load, 30000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, []);

  const now = data?.nowPlaying ?? demoNow;
  const recent = data?.recent ?? demoRecent;
  const isPlaying = data?.isPlaying ?? false;
  const artists = now?.artists?.map((a) => a.name).join(", ");
  const cover = now?.album?.images?.[0]?.url;

  return (
    <section id="music" className="section">
      <Reveal>
        <div className="section-label">Sound & Taste</div>
      </Reveal>
      <Reveal delay={80}>
        <div className="spotify-grid">
          <div className="spotify-now">
            <div className="spotify-pill">
              <span className="spotify-pulse" />
              {isPlaying ? "Now Playing" : "Last Played"}
            </div>
            <div
              className={`vinyl${isPlaying ? "" : " paused"}`}
            >
              <div
                className="vinyl-label"
                style={cover ? { backgroundImage: `url(${cover})` } : undefined}
              />
              <div className="vinyl-hole" />
            </div>
            <h3 className="spotify-track-name">{loading ? "Loading…" : (now?.name || "Nothing playing")}</h3>
            <div className="spotify-artist">{artists || "—"}</div>
            <div className={`equalizer${isPlaying ? "" : " eq-paused"}`} aria-hidden="true">
              {Array.from({ length: 7 }).map((_, i) => <span key={i} className="eq-bar" />)}
            </div>
            {now?.external_urls?.spotify && now.external_urls.spotify !== "#" && (
              <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
                <a
                  href={now.external_urls.spotify}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".5rem",
                    padding: ".6rem 1.2rem",
                    borderRadius: 9999,
                    background: C.green,
                    color: "#000",
                    fontFamily: F.sans,
                    fontSize: ".78rem",
                    fontWeight: 600,
                    letterSpacing: ".02em",
                  }}
                >
                  Open on Spotify <Icon name="external" size={12} />
                </a>
              </div>
            )}
          </div>

          <div className="spotify-recent">
            <div className="recent-label">Recently Played</div>
            {recent.slice(0, 6).map((item, i) => (
              <div key={`${item.played_at}-${i}`} className="recent-row">
                <div className="recent-num">{String(i + 1).padStart(2, "0")}</div>
                <div
                  className="recent-art"
                  style={item.track?.album?.images?.[2]?.url
                    ? { backgroundImage: `url(${item.track.album.images[2].url})` }
                    : undefined}
                />
                <div className="recent-track">
                  <div className="recent-name">{item.track?.name}</div>
                  <div className="recent-artist">{item.track?.artists?.map((a) => a.name).join(", ")}</div>
                </div>
                <div className="recent-time">{timeAgo(new Date(item.played_at).getTime())}</div>
              </div>
            ))}
          </div>
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
      <Reveal>
        <div className="section-label">Get in touch</div>
      </Reveal>
      <div className="contact-grid">
        <Reveal>
          <h2 className="contact-heading">
            Feel free to fill<br />up your details,<br />
            <span style={{ color: C.textSubtle, fontWeight: 500 }}>
              I will reach out to you asap.
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
            <MagneticButton type="submit">
              <span style={{ display: "inline-flex", alignItems: "center", gap: ".55rem" }}>
                Let's schedule a meet <Icon name="send" size={13} />
              </span>
            </MagneticButton>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ─────────────── DOCK ─────────────── */

function Dock() {
  const items = [
    { name: "Home", href: "#hero", icon: "home" },
    { name: "GitHub", href: GITHUB_URL, icon: "github", external: true },
    { name: "Discord", href: DISCORD_INVITE, icon: "discord", external: true },
    { name: "Email", href: `mailto:${EMAIL}`, icon: "mail" },
  ];
  return (
    <div className="dock" aria-label="Quick links">
      {items.map((it) => (
        <a
          key={it.name}
          href={it.href}
          target={it.external ? "_blank" : undefined}
          rel={it.external ? "noreferrer" : undefined}
          className="dock-item"
          aria-label={it.name}
        >
          <Icon name={it.icon} size={18} />
          <span className="dock-tooltip">{it.name}</span>
        </a>
      ))}
    </div>
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

/* ─────────────── AURORA BG ─────────────── */

function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="aurora-blob a" />
      <div className="aurora-blob b" />
      <div className="aurora-blob c" />
    </div>
  );
}

/* ─────────────── APP ─────────────── */

export default function App() {
  return (
    <>
      <InjectStyles />
      <Aurora />
      <LinesBackground />
      <SpotlightCursor />
      <Nav />
      <Hero />
      <Stats />
      <TechStack />
      <Projects />
      <Spotify />
      <Contact />
      <Footer />
      <Dock />
    </>
  );
}
