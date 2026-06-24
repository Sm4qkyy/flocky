import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Particles from "./Particles/Particles";

/* ─────────────── PALETTE — FACE · МОЙ КАЛАШНИКОВ ─────────────── */

const C = {
  black: "#0b0b0b",
  ink: "#141414",
  ink2: "#1c1c1c",
  red: "#e10600",
  redBright: "#ff2b1c",
  redDeep: "#9c0400",
  cream: "#efe7d6",
  creamDim: "#b3aa97",
  creamFaint: "#6f6757",
};

const F = {
  display: "'Anton', 'Oswald', sans-serif",
  cond: "'Oswald', sans-serif",
  mono: "'Space Mono', monospace",
};

const GITHUB_URL = "https://github.com/Sm4qkyy";
const DISCORD_INVITE = "https://discord.gg/2faKNKjDPv";
const EMAIL = "flocky88@outlook.com";

/* ─────────────── DATA ─────────────── */

const ROLES = [
  { label: "Software Development", icon: "code" },
  { label: "Full Stack Web", icon: "web" },
  { label: "Creative Coding", icon: "spark" },
  { label: "3D & Shaders", icon: "cube" },
  { label: "Music & Audio", icon: "wave" },
];

const TECH = [
  "react", "javascript", "typescript", "nodedotjs", "python", "vite",
  "css", "html5", "git", "github", "vercel", "npm", "docker", "linux",
];

const PROJECTS = [
  {
    name: "Voyage Bot",
    tag: "WhatsApp + AI",
    desc: "Live booking bot for a car rental — n8n + Claude, real-time pricing.",
    link: GITHUB_URL,
    accent: "#e10600",
    preview: "chat",
  },
  {
    name: "FLOCKY Site",
    tag: "Portfolio",
    desc: "This site. React + Vite, WebGL particles, full constructivist redesign.",
    link: GITHUB_URL,
    accent: "#efe7d6",
    preview: "browser",
  },
  {
    name: "MARKPC Telegram",
    tag: "Remote Control",
    desc: "Telegram bot that controls a Windows PC: screenshot, lock, sleep.",
    link: GITHUB_URL,
    accent: "#ff2b1c",
    preview: "terminal",
  },
];

const STATS = [
  { label: "Years coding", value: 5, suffix: "+" },
  { label: "Projects shipped", value: 24, suffix: "" },
  { label: "Coffees", value: 9000, suffix: "+" },
  { label: "Hours debugging", value: 2400, suffix: "" },
];

const SLOGANS = ["FLOCKY", "DEVELOPER", "CREATOR", "CODE", "SHADERS", "MUSIC", "SHIP IT"];

/* ─────────────── GLOBAL CSS ─────────────── */

const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Oswald:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html, body { scroll-behavior: smooth; }
body {
  margin: 0;
  background: ${C.black};
  color: ${C.cream};
  font-family: ${F.cond};
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; }
img { display: block; max-width: 100%; }
input, textarea { font: inherit; color: inherit; }
::selection { background: ${C.red}; color: ${C.cream}; }

/* ── BACKGROUND LAYERS ── */
.particles-bg {
  position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: .5;
}
.bg-beams { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
.bg-beams::before {
  content: "";
  position: absolute; inset: -60%;
  background: repeating-linear-gradient(118deg, transparent 0 86px, rgba(225,6,0,.05) 86px 88px);
  animation: beamShift 22s linear infinite;
}
@keyframes beamShift { to { transform: translateX(120px); } }

.bg-vignette {
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 0%, rgba(225,6,0,.10), transparent 55%),
              radial-gradient(ellipse at 50% 120%, rgba(0,0,0,.85), transparent 60%);
}
body::after {
  content: ""; position: fixed; inset: 0; z-index: 9997; pointer-events: none; opacity: .06;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ── REVEAL ── */
.reveal { opacity: 0; transform: translateY(34px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
.reveal.in { opacity: 1; transform: translateY(0); }

/* ── HAZARD STRIPE ── */
.hazard {
  height: 14px;
  width: 100%;
  background: repeating-linear-gradient(45deg, ${C.red} 0 22px, ${C.black} 22px 44px);
  position: relative;
  z-index: 1;
}

/* ── NAV ── */
.nav {
  position: fixed; inset: 0 0 auto; z-index: 1000;
  display: flex; align-items: center; justify-content: space-between;
  padding: .9rem clamp(1rem, 4vw, 2.6rem);
  transition: background .3s, border-color .3s;
  border-bottom: 2px solid transparent;
}
.nav.scrolled {
  background: rgba(11,11,11,.86);
  border-bottom: 2px solid ${C.red};
  backdrop-filter: blur(8px);
}
.nav-logo {
  display: flex; align-items: center; gap: .6rem;
  font-family: ${F.display}; font-size: 1.7rem; letter-spacing: .04em; color: ${C.cream};
}
.nav-logo .star { color: ${C.red}; animation: spinZ 8s linear infinite; display: inline-flex; }
.nav-links { display: flex; gap: 1.6rem; }
.nav-link {
  font-family: ${F.cond}; font-weight: 600; font-size: .82rem; letter-spacing: .14em; text-transform: uppercase;
  color: ${C.creamDim}; position: relative; padding: .2rem 0;
  transition: color .2s;
}
.nav-link::after {
  content: ""; position: absolute; left: 0; bottom: -2px; height: 2px; width: 0; background: ${C.red};
  transition: width .25s;
}
.nav-link:hover { color: ${C.cream}; }
.nav-link:hover::after { width: 100%; }
.nav-cta {
  font-family: ${F.cond}; font-weight: 700; font-size: .82rem; letter-spacing: .12em; text-transform: uppercase;
  padding: .5rem 1.1rem; background: ${C.red}; color: ${C.cream};
  border: 2px solid ${C.red}; display: inline-flex; align-items: center; gap: .5rem;
  transition: background .2s, color .2s, transform .12s;
}
.nav-cta:hover { background: transparent; color: ${C.red}; transform: translateY(-1px); }

/* ── SECTION ── */
.section { position: relative; z-index: 1; padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 5vw, 4rem); }
.kicker {
  display: inline-flex; align-items: center; gap: .6rem;
  font-family: ${F.mono}; font-size: .72rem; letter-spacing: .26em; text-transform: uppercase;
  color: ${C.red}; margin-bottom: 1rem;
}
.kicker::before { content: "★"; }
.heading {
  margin: 0; font-family: ${F.display};
  font-size: clamp(3rem, 11vw, 9rem); line-height: .86; letter-spacing: .005em;
  text-transform: uppercase; color: ${C.cream};
}
.heading .red { color: ${C.red}; }
.outline {
  color: transparent;
  -webkit-text-stroke: 2px ${C.creamDim};
}

/* ── HERO ── */
.hero {
  position: relative; min-height: 100vh; z-index: 1;
  display: flex; flex-direction: column; justify-content: center;
  padding: 7rem clamp(1.25rem, 5vw, 4rem) 4rem;
  overflow: hidden;
}
.hero-star {
  position: absolute; right: -4vw; top: 50%; transform: translateY(-50%);
  width: min(60vw, 620px); aspect-ratio: 1; z-index: 0;
  pointer-events: none; opacity: .9;
  perspective: 900px;
}
.hero-star svg { width: 100%; height: 100%; animation: spin3d 16s linear infinite; transform-style: preserve-3d; }
@keyframes spin3d {
  0% { transform: rotateY(0deg) rotateZ(0deg); }
  100% { transform: rotateY(360deg) rotateZ(360deg); }
}
@keyframes spinZ { 100% { transform: rotate(360deg); } }

.hero-inner { position: relative; z-index: 2; max-width: 1100px; }
.hero-tag {
  font-family: ${F.mono}; font-size: .78rem; letter-spacing: .3em; text-transform: uppercase;
  color: ${C.red}; margin-bottom: 1rem; display: flex; align-items: center; gap: .8rem;
}
.hero-tag .bar { width: 48px; height: 2px; background: ${C.red}; display: inline-block; }
.hero-name {
  margin: 0; font-family: ${F.display};
  font-size: clamp(5rem, 22vw, 19rem); line-height: .8; letter-spacing: .01em;
  text-transform: uppercase; color: ${C.cream};
}
.hero-sub {
  margin: 1.4rem 0 .4rem; font-family: ${F.cond}; font-weight: 600;
  font-size: clamp(1rem, 2.4vw, 1.5rem); letter-spacing: .08em; text-transform: uppercase; color: ${C.cream};
}
.hero-typeline {
  font-family: ${F.mono}; font-size: .82rem; letter-spacing: .04em; color: ${C.creamDim}; min-height: 1.4em;
}
.cursor-blink { display: inline-block; width: .6em; background: ${C.red}; margin-left: 2px; animation: blink 1.05s steps(1) infinite; }
@keyframes blink { 0%,50%{opacity:1;} 50.01%,100%{opacity:0;} }

.hero-socials { display: flex; gap: .7rem; margin-top: 2rem; }
.social-link {
  width: 46px; height: 46px; display: grid; place-items: center;
  border: 2px solid ${C.creamFaint}; color: ${C.cream}; background: transparent;
  transition: background .18s, color .18s, border-color .18s, transform .18s;
}
.social-link:hover { background: ${C.red}; border-color: ${C.red}; color: ${C.cream}; transform: translate(-2px,-2px); box-shadow: 4px 4px 0 ${C.black}; }

/* ── GLITCH ── */
.glitch { position: relative; display: inline-block; }
.glitch::before, .glitch::after {
  content: attr(data-text); position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: hidden;
}
.glitch::before { color: ${C.red}; z-index: -1; animation: glitchA 2.6s infinite steps(2); }
.glitch::after { color: ${C.creamDim}; z-index: -2; animation: glitchB 3.2s infinite steps(2); }
@keyframes glitchA {
  0%,92%,100% { transform: translate(0,0); opacity:.9; }
  93% { transform: translate(-5px,2px); }
  96% { transform: translate(4px,-2px); }
}
@keyframes glitchB {
  0%,90%,100% { transform: translate(0,0); opacity:.6; }
  94% { transform: translate(5px,1px); }
  97% { transform: translate(-4px,-1px); }
}

/* ── MARQUEE ── */
.marquee {
  position: relative; z-index: 1; overflow: hidden;
  background: ${C.red}; border-top: 3px solid ${C.black}; border-bottom: 3px solid ${C.black};
  padding: .7rem 0;
}
.marquee.alt { background: ${C.black}; border-top: 3px solid ${C.red}; border-bottom: 3px solid ${C.red}; }
.marquee-track { display: flex; gap: 0; width: max-content; animation: marquee 24s linear infinite; }
.marquee.alt .marquee-track { animation: marquee-rev 28s linear infinite; }
@keyframes marquee { to { transform: translateX(-50%); } }
@keyframes marquee-rev { from { transform: translateX(-50%); } to { transform: translateX(0); } }
.marquee-word {
  font-family: ${F.display}; font-size: 2rem; letter-spacing: .04em; text-transform: uppercase;
  color: ${C.black}; padding: 0 1.4rem; display: inline-flex; align-items: center; gap: 1.4rem; white-space: nowrap;
}
.marquee.alt .marquee-word { color: ${C.cream}; }
.marquee-word::after { content: "★"; color: ${C.cream}; font-size: 1.1rem; }
.marquee.alt .marquee-word::after { color: ${C.red}; }

/* ── ABOUT ── */
.about-wrap { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(2rem,5vw,4rem); align-items: center; max-width: 1100px; margin: 0 auto; }
.about-text { font-family: ${F.cond}; font-weight: 300; font-size: clamp(1.05rem, 1.8vw, 1.35rem); line-height: 1.7; color: ${C.creamDim}; }
.about-text b { color: ${C.cream}; font-weight: 700; }
.roles-list { display: flex; flex-direction: column; gap: .2rem; }
.role-row {
  display: flex; align-items: center; gap: 1rem; padding: .9rem .4rem;
  border-bottom: 2px solid ${C.ink2}; transition: padding-left .2s, background .2s, color .2s;
}
.role-row:hover { padding-left: 1.2rem; background: ${C.red}; color: ${C.cream}; border-color: ${C.red}; }
.role-row:hover .role-num, .role-row:hover .role-ic { color: ${C.cream}; }
.role-num { font-family: ${F.mono}; font-size: .8rem; color: ${C.red}; width: 32px; }
.role-ic { color: ${C.red}; display: inline-flex; }
.role-name { font-family: ${F.display}; font-size: clamp(1.2rem, 3vw, 1.9rem); text-transform: uppercase; letter-spacing: .02em; }

/* ── STATS ── */
.stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 0; max-width: 1100px; margin: 3rem auto 0; border: 2px solid ${C.ink2}; }
.stat { padding: 1.8rem 1rem; text-align: center; border-right: 2px solid ${C.ink2}; }
.stat:last-child { border-right: none; }
.stat-num { font-family: ${F.display}; font-size: clamp(2rem,5vw,3.4rem); color: ${C.red}; line-height: 1; }
.stat-lbl { font-family: ${F.mono}; font-size: .64rem; letter-spacing: .2em; text-transform: uppercase; color: ${C.creamDim}; margin-top: .6rem; }

/* ── STACK ── */
.tech-marquee { position: relative; overflow: hidden; -webkit-mask-image: linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); mask-image: linear-gradient(90deg,transparent,#000 10%,#000 90%,transparent); }
.tech-track { display: flex; width: max-content; animation: marquee 34s linear infinite; padding: 1rem 0; }
.tech-track.rev { animation: marquee-rev 40s linear infinite; }
.tech-tile {
  flex-shrink: 0; width: 84px; height: 84px; margin-right: 1rem; display: grid; place-items: center;
  border: 2px solid ${C.ink2}; background: ${C.ink}; transition: border-color .2s, background .2s, transform .15s;
}
.tech-tile:hover { border-color: ${C.red}; background: ${C.black}; transform: translateY(-4px); }
.tech-tile img { width: 50%; height: 50%; opacity: .85; }

/* ── PROJECTS ── */
.projects-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; max-width: 1180px; margin: 0 auto; perspective: 1200px; }
.tilt-card {
  position: relative; display: flex; flex-direction: column;
  border: 2px solid ${C.ink2}; background: ${C.ink};
  transition: transform .2s ease-out, border-color .2s, box-shadow .2s;
  transform-style: preserve-3d; cursor: pointer; --accent: ${C.red};
}
.tilt-card:hover { border-color: var(--accent); box-shadow: 10px 10px 0 ${C.black}; }
.tilt-preview { position: relative; aspect-ratio: 1.4; overflow: hidden; border-bottom: 2px solid ${C.ink2}; transform: translateZ(30px); }
.tilt-card:hover .tilt-preview { border-color: var(--accent); }
.preview-svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
.tilt-body { padding: 1.3rem; }
.tilt-tag {
  display: inline-block; font-family: ${F.mono}; font-size: .62rem; letter-spacing: .16em; text-transform: uppercase;
  color: ${C.black}; background: var(--accent); padding: .2rem .5rem; margin-bottom: .7rem;
}
.tilt-title { margin: 0; font-family: ${F.display}; font-size: 1.5rem; text-transform: uppercase; letter-spacing: .02em; color: ${C.cream}; transform: translateZ(20px); }
.tilt-desc { margin: .5rem 0 0; font-family: ${F.cond}; font-weight: 300; font-size: .9rem; line-height: 1.55; color: ${C.creamDim}; }
.tilt-foot { display: flex; align-items: center; justify-content: space-between; margin-top: 1.1rem; }
.tilt-src { font-family: ${F.mono}; font-size: .62rem; letter-spacing: .14em; color: ${C.creamFaint}; }
.tilt-link { width: 34px; height: 34px; display: grid; place-items: center; border: 2px solid ${C.creamFaint}; color: ${C.cream}; transition: background .2s, color .2s; }
.tilt-link:hover { background: var(--accent); border-color: var(--accent); color: ${C.black}; }

/* ── SPOTIFY ── */
.spotify-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; max-width: 1040px; margin: 0 auto; }
.sp-now { position: relative; padding: 2rem; border: 2px solid ${C.ink2}; background: ${C.ink}; overflow: hidden; }
.sp-now::after { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: ${C.red}; }
.sp-pill { display: inline-flex; align-items: center; gap: .5rem; font-family: ${F.mono}; font-size: .66rem; letter-spacing: .18em; text-transform: uppercase; color: ${C.red}; margin-bottom: 1.5rem; }
.sp-pulse { width: 9px; height: 9px; background: ${C.red}; animation: pulse 1.3s ease-in-out infinite; }
@keyframes pulse { 0%,100%{opacity:1; transform:scale(1);} 50%{opacity:.45; transform:scale(.6);} }
.vinyl {
  position: relative; width: clamp(170px,30vw,230px); aspect-ratio: 1; margin: 0 auto 1.4rem; border-radius: 50%;
  background: radial-gradient(circle at center, #0a0a0a 0 30%, #1a1a1a 31%, #0a0a0a 33%, #1a1a1a 35%, #0a0a0a 37%, #1a1a1a 39%, #0a0a0a 41%, #1a1a1a 43%, #0a0a0a 45%);
  box-shadow: 0 14px 36px rgba(0,0,0,.6); animation: spinZ 11s linear infinite;
}
.vinyl.paused { animation-play-state: paused; }
.vinyl-label { position: absolute; inset: 33%; border-radius: 50%; background: ${C.red}; background-size: cover; background-position: center; border: 3px solid #000; }
.vinyl-hole { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 8px; height: 8px; border-radius: 50%; background: ${C.black}; z-index: 2; }
.sp-track { margin: 0; font-family: ${F.display}; font-size: 1.2rem; text-transform: uppercase; text-align: center; color: ${C.cream}; }
.sp-artist { margin-top: .25rem; font-family: ${F.mono}; font-size: .76rem; color: ${C.creamDim}; text-align: center; }
.eq { display: flex; align-items: end; justify-content: center; gap: 3px; height: 26px; margin-top: 1.1rem; }
.eq span { width: 4px; background: ${C.red}; animation: eq 1s ease-in-out infinite; }
.eq span:nth-child(1){animation-delay:-1.1s} .eq span:nth-child(2){animation-delay:-.6s} .eq span:nth-child(3){animation-delay:-.9s} .eq span:nth-child(4){animation-delay:-.4s} .eq span:nth-child(5){animation-delay:-1.2s} .eq span:nth-child(6){animation-delay:-.7s} .eq span:nth-child(7){animation-delay:-.5s}
@keyframes eq { 0%,100%{height:20%} 50%{height:100%} }
.eq.paused span { animation-play-state: paused; height: 16%; }
.sp-recent { padding: 2rem; border: 2px solid ${C.ink2}; background: ${C.ink}; }
.sp-rlabel { font-family: ${F.mono}; font-size: .66rem; letter-spacing: .18em; text-transform: uppercase; color: ${C.creamDim}; margin-bottom: 1.1rem; }
.rrow { display: flex; align-items: center; gap: .8rem; padding: .6rem 0; border-bottom: 1px solid ${C.ink2}; }
.rrow:last-child { border-bottom: none; }
.rnum { width: 22px; font-family: ${F.mono}; font-size: .7rem; color: ${C.red}; text-align: right; }
.rart { width: 38px; height: 38px; background: ${C.ink2}; background-size: cover; background-position: center; flex-shrink: 0; }
.rtrack { flex: 1; min-width: 0; }
.rname { font-family: ${F.cond}; font-weight: 600; font-size: .86rem; color: ${C.cream}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.rartist { font-family: ${F.mono}; font-size: .64rem; color: ${C.creamFaint}; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: .15rem; }
.rtime { font-family: ${F.mono}; font-size: .62rem; color: ${C.creamFaint}; flex-shrink: 0; }
.sp-open { display: inline-flex; align-items: center; gap: .5rem; margin-top: 1.2rem; padding: .55rem 1.1rem; background: ${C.red}; color: ${C.cream}; font-family: ${F.cond}; font-weight: 700; font-size: .76rem; letter-spacing: .1em; text-transform: uppercase; }

/* ── CONTACT ── */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem,5vw,4rem); max-width: 1040px; margin: 0 auto; align-items: center; }
.contact-head { margin: 0; font-family: ${F.display}; font-size: clamp(2.4rem,6vw,4.6rem); line-height: .9; text-transform: uppercase; color: ${C.cream}; }
.contact-head .red { color: ${C.red}; }
.contact-form { display: flex; flex-direction: column; gap: 1.1rem; }
.field { border: 2px solid ${C.ink2}; padding: .7rem .9rem; background: ${C.ink}; transition: border-color .2s; }
.field:focus-within { border-color: ${C.red}; }
.field label { display: block; font-family: ${F.mono}; font-size: .66rem; letter-spacing: .14em; text-transform: uppercase; color: ${C.creamFaint}; margin-bottom: .3rem; }
.field input, .field textarea { width: 100%; background: transparent; border: none; outline: none; font-family: ${F.cond}; font-size: .95rem; color: ${C.cream}; }
.field textarea { resize: vertical; min-height: 56px; }
.mag-btn {
  align-self: flex-start; padding: .9rem 1.8rem; background: ${C.red}; color: ${C.cream};
  border: 2px solid ${C.red}; font-family: ${F.cond}; font-weight: 700; font-size: .86rem; letter-spacing: .1em; text-transform: uppercase;
  transition: background .18s, color .18s, box-shadow .18s; position: relative; overflow: hidden;
}
.mag-btn:hover { background: ${C.black}; color: ${C.red}; box-shadow: 6px 6px 0 ${C.red}; }

/* ── FOOTER ── */
.footer { position: relative; z-index: 1; padding: 3.5rem 1.5rem 7rem; text-align: center; border-top: 3px solid ${C.red}; }
.footer-big { font-family: ${F.display}; font-size: clamp(3rem,12vw,8rem); line-height: .9; text-transform: uppercase; color: ${C.cream}; }
.footer-big .red { color: ${C.red}; }
.footer-sub { font-family: ${F.mono}; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase; color: ${C.creamFaint}; margin-top: .6rem; }

/* ── DOCK ── */
.dock { position: fixed; bottom: 1.3rem; left: 50%; transform: translateX(-50%); z-index: 950; display: flex; gap: .35rem; padding: .45rem; background: rgba(11,11,11,.85); border: 2px solid ${C.red}; backdrop-filter: blur(8px); }
.dock-item { position: relative; width: 44px; height: 44px; display: grid; place-items: center; color: ${C.cream}; transition: background .18s, color .18s, transform .18s; }
.dock-item:hover { background: ${C.red}; color: ${C.cream}; transform: translateY(-6px); }
.dock-tip { position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); font-family: ${F.mono}; font-size: .58rem; letter-spacing: .14em; text-transform: uppercase; color: ${C.cream}; background: ${C.black}; border: 1px solid ${C.red}; padding: .3rem .55rem; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .18s; }
.dock-item:hover .dock-tip { opacity: 1; }

/* ── SCROLL RAIL ── */
.scroll-rail { position: fixed; right: 20px; top: 0; height: 100vh; width: 16px; z-index: 940; pointer-events: none; opacity: 0; transition: opacity .4s ease; }
.scroll-rail.visible { opacity: 1; pointer-events: auto; }
.scroll-rail-track { position: absolute; left: 50%; top: 14vh; height: 72vh; width: 2px; transform: translateX(-50%); background: ${C.ink2}; }
.scroll-rail-fill { position: absolute; left: 0; top: 0; width: 100%; height: 100%; transform-origin: top; transform: scaleY(0); background: ${C.red}; }
.scroll-rail-dot { position: absolute; left: 50%; top: 0; width: 12px; height: 12px; transform: translate(-50%,-50%) rotate(45deg); background: ${C.red}; box-shadow: 0 0 10px ${C.red}; }
.scroll-rail-dot-label { position: absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%) rotate(-45deg); font-family: ${F.mono}; font-size: .58rem; letter-spacing: .14em; text-transform: uppercase; color: ${C.cream}; background: ${C.black}; border: 1px solid ${C.red}; padding: .28rem .55rem; white-space: nowrap; }
.scroll-rail-tick { position: absolute; left: 50%; top: 0; width: 8px; height: 8px; padding: 0; transform: translate(-50%,-50%) rotate(45deg); background: ${C.ink}; border: 1px solid ${C.creamFaint}; cursor: pointer; transition: background .2s, transform .2s; }
.scroll-rail-tick:hover { background: ${C.red}; border-color: ${C.red}; transform: translate(-50%,-50%) rotate(45deg) scale(1.3); }
.scroll-rail-tick.active { background: ${C.red}; border-color: ${C.red}; }
.scroll-rail-tick-label { position: absolute; right: calc(100% + 10px); top: 50%; transform: translateY(-50%) rotate(-45deg); font-family: ${F.mono}; font-size: .56rem; letter-spacing: .12em; text-transform: uppercase; color: ${C.cream}; background: ${C.black}; border: 1px solid ${C.red}; padding: .25rem .5rem; white-space: nowrap; opacity: 0; pointer-events: none; transition: opacity .2s; }
.scroll-rail-tick:hover .scroll-rail-tick-label { opacity: 1; }

/* ── RESPONSIVE ── */
@media (max-width: 980px) {
  .about-wrap { grid-template-columns: 1fr; }
  .spotify-grid { grid-template-columns: 1fr; }
  .stats { grid-template-columns: repeat(2,1fr); }
  .stat:nth-child(2) { border-right: none; }
  .stat:nth-child(1), .stat:nth-child(2) { border-bottom: 2px solid ${C.ink2}; }
}
@media (max-width: 860px) {
  .nav-links { display: none; }
  .projects-grid { grid-template-columns: 1fr; }
  .contact-grid { grid-template-columns: 1fr; }
  .hero-star { opacity: .35; right: -20vw; }
}
@media (max-width: 900px) {
  .scroll-rail { right: 9px; width: 12px; }
  .scroll-rail-track { top: 16vh; height: 62vh; }
  .scroll-rail-tick-label { display: none; }
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
      { threshold: 0.12 }
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

function Typewriter({ phrases, typeSpeed = 60, deleteSpeed = 35, holdMs = 1500 }) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = phrases[idx];
    if (!del && text === cur) { const t = setTimeout(() => setDel(true), holdMs); return () => clearTimeout(t); }
    if (del && text === "") { setDel(false); setIdx((i) => (i + 1) % phrases.length); return undefined; }
    const t = setTimeout(() => {
      setText((c) => (del ? c.slice(0, -1) : cur.slice(0, c.length + 1)));
    }, del ? deleteSpeed : typeSpeed);
    return () => clearTimeout(t);
  }, [text, del, idx, phrases, typeSpeed, deleteSpeed, holdMs]);
  return <>{text}<span className="cursor-blink" /></>;
}

function CountUp({ to, duration = 1500, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const ob = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min((t - start) / duration, 1);
        setVal(Math.floor(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick); else setVal(to);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    ob.observe(el);
    return () => ob.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function TiltCard({ children, accent, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return (
    <div ref={ref} className="tilt-card" onMouseMove={onMove} onMouseLeave={onLeave} style={{ "--accent": accent }} {...rest}>
      {children}
    </div>
  );
}

function MagneticButton({ children, strength = 0.3, ...rest }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`;
  };
  const onLeave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <button ref={ref} className="mag-btn" onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>{children}</button>;
}

/* ─────────────── ICONS ─────────────── */

const Icon = ({ name, size = 18 }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "github": return <svg {...p}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 6.77 5.07 5.07 0 0 0 19.91 3S18.73 2.65 16 4.55a13.38 13.38 0 0 0-7 0C6.27 2.65 5.09 3 5.09 3A5.07 5.07 0 0 0 5 6.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 20.13V24"/></svg>;
    case "discord": return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.74 19.74 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.058a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>;
    case "mail": return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "code": return <svg {...p}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
    case "web": return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "spark": return <svg {...p}><path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M5 19l4-4M15 9l4-4"/></svg>;
    case "cube": return <svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
    case "wave": return <svg {...p}><path d="M3 12h2l2-6 4 12 4-12 2 6h4"/></svg>;
    case "external": return <svg {...p}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>;
    case "home": return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "send": return <svg {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
    case "star": return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.95 6.7 7.05.6-5.4 4.7 1.7 7L12 17.8 5.7 21.7l1.7-7L2 10l7.05-.6z"/></svg>;
    default: return null;
  }
};

/* ─────────────── BACKGROUND ─────────────── */

function Background() {
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  return (
    <>
      <div className="bg-vignette" aria-hidden="true" />
      <div className="bg-beams" aria-hidden="true" />
      <div className="particles-bg" aria-hidden="true">
        <Particles
          particleColors={["#e10600", "#efe7d6", "#9c0400"]}
          particleCount={130}
          particleSpread={16}
          speed={0.05}
          particleBaseSize={60}
          sizeRandomness={1}
          alphaParticles
          disableRotation={false}
          moveParticlesOnHover={false}
          pixelRatio={dpr}
        />
      </div>
    </>
  );
}

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
      <a href="#hero" className="nav-logo">
        <span className="star"><Icon name="star" size={22} /></span> FLOCKY
      </a>
      <div className="nav-links">
        {[["About", "about"], ["Stack", "stack"], ["Work", "projects"], ["Music", "music"], ["Contact", "contact"]].map(([l, id]) => (
          <a key={id} href={`#${id}`} className="nav-link">{l}</a>
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
    <section id="hero" className="hero">
      <div className="hero-star" aria-hidden="true">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 6l24 55 60 5-45 39 14 59-53-32-53 32 14-59L16 66l60-5z"
            fill="none" stroke={C.red} strokeWidth="3" />
          <path d="M100 30l16 38 41 3-31 27 9 40-35-22-35 22 9-40-31-27 41-3z"
            fill={C.red} fillOpacity="0.12" stroke={C.redDeep} strokeWidth="1.5" />
        </svg>
      </div>
      <div className="hero-inner">
        <div className="hero-tag"><span className="bar" /> Creative Playground · MMXXVI</div>
        <h1 className="hero-name">
          <span className="glitch" data-text="FLOCKY">FLOCKY</span>
        </h1>
        <div className="hero-sub">Developer · Creator · Curious Mind</div>
        <div className="hero-typeline">
          <Typewriter phrases={[
            "Converting caffeine into code.",
            "Shipping shaders and side projects.",
            "Building loud, useful things.",
            "Code · Sound · Pixels.",
          ]} />
        </div>
        <div className="hero-socials">
          <a className="social-link" href={GITHUB_URL} target="_blank" rel="noreferrer" aria-label="GitHub"><Icon name="github" /></a>
          <a className="social-link" href={DISCORD_INVITE} target="_blank" rel="noreferrer" aria-label="Discord"><Icon name="discord" /></a>
          <a className="social-link" href={`mailto:${EMAIL}`} aria-label="Email"><Icon name="mail" /></a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────── MARQUEE ─────────────── */

function Marquee({ alt }) {
  const words = [...SLOGANS, ...SLOGANS];
  return (
    <div className={`marquee${alt ? " alt" : ""}`} aria-hidden="true">
      <div className="marquee-track">
        {words.map((w, i) => <span key={i} className="marquee-word">{w}</span>)}
      </div>
    </div>
  );
}

/* ─────────────── ABOUT ─────────────── */

function About() {
  return (
    <section id="about" className="section">
      <Reveal>
        <div className="kicker">About</div>
        <h2 className="heading">WHO <span className="red">AM&nbsp;I</span></h2>
      </Reveal>
      <Reveal delay={120}>
        <div className="about-wrap" style={{ marginTop: "3rem" }}>
          <p className="about-text">
            I'm <b>Flocky</b> — a developer who builds for the web, plays with shaders,
            and tinkers with sound. I care about <b>clean code</b>, <b>bold design</b>,
            and the tiny details that make products feel alive. I move fast, ship often,
            and I'm always down to collaborate on something loud.
          </p>
          <div className="roles-list">
            {ROLES.map((r, i) => (
              <div key={r.label} className="role-row">
                <span className="role-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="role-ic"><Icon name={r.icon} size={20} /></span>
                <span className="role-name">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
      <Reveal delay={160}>
        <div className="stats">
          {STATS.map((s) => (
            <div key={s.label} className="stat">
              <div className="stat-num"><CountUp to={s.value} suffix={s.suffix} /></div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── STACK ─────────────── */

function Stack() {
  const a = useMemo(() => TECH, []);
  const b = useMemo(() => [...TECH].reverse(), []);
  return (
    <section id="stack" className="section">
      <Reveal>
        <div className="kicker">Toolkit</div>
        <h2 className="heading"><span className="outline">STACK</span></h2>
      </Reveal>
      <Reveal delay={80} style={{ marginTop: "2.5rem" }}>
        <div className="tech-marquee">
          <div className="tech-track">
            {[...a, ...a].map((s, i) => (
              <div key={`a${i}`} className="tech-tile" title={s}>
                <img src={`https://cdn.simpleicons.org/${s}/efe7d6`} alt={s} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="tech-track rev">
            {[...b, ...b].map((s, i) => (
              <div key={`b${i}`} className="tech-tile" title={s}>
                <img src={`https://cdn.simpleicons.org/${s}/efe7d6`} alt={s} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── PROJECT PREVIEWS ─────────────── */

function ProjectPreview({ type, accent }) {
  const ink = "#141414";
  if (type === "chat") {
    return (
      <svg className="preview-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill={ink} />
        <rect x="26" y="40" width="150" height="36" fill="rgba(239,231,214,0.1)" />
        <rect x="40" y="52" width="92" height="5" fill="rgba(239,231,214,0.5)" />
        <rect x="40" y="63" width="58" height="5" fill="rgba(239,231,214,0.28)" />
        <rect x="144" y="96" width="150" height="36" fill={accent} />
        <rect x="158" y="108" width="104" height="5" fill="rgba(11,11,11,0.55)" />
        <rect x="158" y="119" width="72" height="5" fill="rgba(11,11,11,0.35)" />
        <rect x="26" y="150" width="112" height="30" fill="rgba(239,231,214,0.1)" />
        <rect x="40" y="162" width="74" height="5" fill="rgba(239,231,214,0.4)" />
        <g transform="translate(244,30)" stroke={accent} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 20 L7 9 L33 9 L38 20" /><rect x="-1" y="20" width="42" height="13" />
          <circle cx="11" cy="35" r="3.5" fill={ink} /><circle cx="29" cy="35" r="3.5" fill={ink} />
        </g>
      </svg>
    );
  }
  if (type === "browser") {
    return (
      <svg className="preview-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
        <rect width="320" height="200" fill={ink} />
        <rect x="0" y="0" width="320" height="28" fill="rgba(239,231,214,0.06)" />
        <rect x="14" y="11" width="8" height="6" fill="#e10600" />
        <rect x="28" y="11" width="8" height="6" fill="rgba(239,231,214,0.3)" />
        <rect x="42" y="11" width="8" height="6" fill="rgba(239,231,214,0.18)" />
        <rect x="64" y="8" width="234" height="12" fill="rgba(239,231,214,0.05)" />
        <text x="160" y="120" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="50" letterSpacing="2" fill={accent}>FLOCKY</text>
        <rect x="120" y="138" width="80" height="5" fill="rgba(239,231,214,0.2)" />
      </svg>
    );
  }
  return (
    <svg className="preview-svg" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <rect width="320" height="200" fill={ink} />
      <rect x="34" y="34" width="252" height="132" fill="rgba(11,11,11,0.7)" stroke="rgba(239,231,214,0.1)" />
      <rect x="34" y="34" width="252" height="26" fill="rgba(239,231,214,0.06)" />
      <rect x="46" y="44" width="8" height="6" fill="#e10600" />
      <rect x="60" y="44" width="8" height="6" fill="rgba(239,231,214,0.3)" />
      <text x="48" y="84" fontFamily="'Space Mono', monospace" fontSize="11" fill={accent}>&gt; <tspan fill="rgba(239,231,214,0.7)">/screenshot</tspan></text>
      <text x="48" y="104" fontFamily="'Space Mono', monospace" fontSize="11" fill="rgba(239,231,214,0.4)">  capturing…</text>
      <text x="48" y="124" fontFamily="'Space Mono', monospace" fontSize="11" fill={accent}>&gt; <tspan fill="rgba(239,231,214,0.7)">/lock</tspan></text>
      <text x="48" y="144" fontFamily="'Space Mono', monospace" fontSize="11" fill="rgba(239,231,214,0.4)">  pc locked</text>
      <g transform="translate(236,96)" fill={accent}><path d="M40 2 L2 20 L16 24 L20 40 L26 28 L38 38 Z" /></g>
    </svg>
  );
}

/* ─────────────── PROJECTS ─────────────── */

function Projects() {
  return (
    <section id="projects" className="section">
      <Reveal>
        <div className="kicker">Selected Work</div>
        <h2 className="heading">PRO<span className="red">JECTS</span></h2>
      </Reveal>
      <Reveal delay={80} style={{ marginTop: "3rem" }}>
        <div className="projects-grid">
          {PROJECTS.map((p) => (
            <TiltCard key={p.name} accent={p.accent}>
              <div className="tilt-preview"><ProjectPreview type={p.preview} accent={p.accent} /></div>
              <div className="tilt-body">
                <span className="tilt-tag">{p.tag}</span>
                <h3 className="tilt-title">{p.name}</h3>
                <p className="tilt-desc">{p.desc}</p>
                <div className="tilt-foot">
                  <span className="tilt-src">VIEW SOURCE</span>
                  <a className="tilt-link" href={p.link} target="_blank" rel="noreferrer" aria-label="Source"><Icon name="external" size={13} /></a>
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
  const s = Math.floor((Date.now() - ms) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

function Spotify() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const demoNow = useMemo(() => ({ name: "Мой Калашников", artists: [{ name: "FACE" }], album: { images: [{ url: "" }] }, external_urls: { spotify: "#" } }), []);
  const demoRecent = useMemo(() => [
    ["Мой Калашников", "FACE", 1800000],
    ["Юморист", "FACE", 3600000],
    ["Бургер", "FACE", 7200000],
    ["Гоша Рубчинский", "FACE", 10800000],
    ["Скейт", "FACE", 21600000],
  ].map(([n, a, age]) => ({ track: { name: n, artists: [{ name: a }], album: { images: [{ url: "" }] } }, played_at: new Date(Date.now() - age).toISOString() })), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) throw new Error("no");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
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
        <div className="kicker">Sound & Taste</div>
        <h2 className="heading">MU<span className="red">SIC</span></h2>
      </Reveal>
      <Reveal delay={80} style={{ marginTop: "3rem" }}>
        <div className="spotify-grid">
          <div className="sp-now">
            <div className="sp-pill"><span className="sp-pulse" />{isPlaying ? "Now Playing" : "Last Played"}</div>
            <div className={`vinyl${isPlaying ? "" : " paused"}`}>
              <div className="vinyl-label" style={cover ? { backgroundImage: `url(${cover})` } : undefined} />
              <div className="vinyl-hole" />
            </div>
            <h3 className="sp-track">{loading ? "Loading…" : (now?.name || "Nothing playing")}</h3>
            <div className="sp-artist">{artists || "—"}</div>
            <div className={`eq${isPlaying ? "" : " paused"}`} aria-hidden="true">
              {Array.from({ length: 7 }).map((_, i) => <span key={i} />)}
            </div>
            {now?.external_urls?.spotify && now.external_urls.spotify !== "#" && (
              <div style={{ textAlign: "center" }}>
                <a className="sp-open" href={now.external_urls.spotify} target="_blank" rel="noreferrer">
                  Open on Spotify <Icon name="external" size={12} />
                </a>
              </div>
            )}
          </div>
          <div className="sp-recent">
            <div className="sp-rlabel">Recently Played</div>
            {recent.slice(0, 6).map((it, i) => (
              <div key={`${it.played_at}-${i}`} className="rrow">
                <div className="rnum">{String(i + 1).padStart(2, "0")}</div>
                <div className="rart" style={it.track?.album?.images?.[2]?.url ? { backgroundImage: `url(${it.track.album.images[2].url})` } : undefined} />
                <div className="rtrack">
                  <div className="rname">{it.track?.name}</div>
                  <div className="rartist">{it.track?.artists?.map((a) => a.name).join(", ")}</div>
                </div>
                <div className="rtime">{timeAgo(new Date(it.played_at).getTime())}</div>
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
    const body = encodeURIComponent(`Name: ${form.name}\nWhatsApp: ${form.whatsapp}\nEmail: ${form.email}\n\n${form.note}`);
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  }, [form]);

  return (
    <section id="contact" className="section">
      <Reveal><div className="kicker">Get In Touch</div></Reveal>
      <div className="contact-grid" style={{ marginTop: "1.5rem" }}>
        <Reveal>
          <h2 className="contact-head">FILL UP<br /><span className="red">YOUR DETAILS,</span><br />I'LL REACH OUT.</h2>
        </Reveal>
        <Reveal delay={100}>
          <form className="contact-form" onSubmit={onSubmit}>
            <div className="field"><label htmlFor="name">Your name</label><input id="name" type="text" required value={form.name} onChange={onChange("name")} /></div>
            <div className="field"><label htmlFor="whatsapp">WhatsApp No.</label><input id="whatsapp" type="tel" value={form.whatsapp} onChange={onChange("whatsapp")} /></div>
            <div className="field"><label htmlFor="email">Email Address</label><input id="email" type="email" required value={form.email} onChange={onChange("email")} /></div>
            <div className="field"><label htmlFor="note">Note</label><textarea id="note" rows={2} value={form.note} onChange={onChange("note")} /></div>
            <MagneticButton type="submit"><span style={{ display: "inline-flex", alignItems: "center", gap: ".5rem" }}>Let's schedule a meet <Icon name="send" size={13} /></span></MagneticButton>
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
      <div className="footer-big">BYE<span className="red">.</span></div>
      <div className="footer-sub">Do Visit Again · © {new Date().getFullYear()} FLOCKY</div>
    </footer>
  );
}

/* ─────────────── DOCK ─────────────── */

function Dock() {
  const items = [
    { name: "Home", href: "#hero", icon: "home" },
    { name: "GitHub", href: GITHUB_URL, icon: "github", ext: true },
    { name: "Discord", href: DISCORD_INVITE, icon: "discord", ext: true },
    { name: "Email", href: `mailto:${EMAIL}`, icon: "mail" },
  ];
  return (
    <div className="dock">
      {items.map((it) => (
        <a key={it.name} href={it.href} target={it.ext ? "_blank" : undefined} rel={it.ext ? "noreferrer" : undefined} className="dock-item" aria-label={it.name}>
          <Icon name={it.icon} size={18} /><span className="dock-tip">{it.name}</span>
        </a>
      ))}
    </div>
  );
}

/* ─────────────── SCROLL RAIL ─────────────── */

const RAIL_SECTIONS = [["hero", "Top"], ["about", "About"], ["stack", "Stack"], ["projects", "Work"], ["music", "Music"], ["contact", "Contact"]];

function ScrollRail() {
  const railRef = useRef(null);
  const fillRef = useRef(null);
  const dotRef = useRef(null);
  const topsRef = useRef([]);
  const idleRef = useRef(null);
  const [fracs, setFracs] = useState([]);
  const [active, setActive] = useState(0);

  const show = useCallback(() => {
    railRef.current?.classList.add("visible");
    if (idleRef.current) clearTimeout(idleRef.current);
    idleRef.current = setTimeout(() => railRef.current?.classList.remove("visible"), 1300);
  }, []);

  useEffect(() => {
    const measure = () => {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const tops = []; const fr = [];
      RAIL_SECTIONS.forEach(([id]) => {
        const el = document.getElementById(id);
        const top = el ? el.offsetTop : 0;
        tops.push(top); fr.push(Math.min(Math.max(top / max, 0), 1));
      });
      topsRef.current = tops; setFracs(fr);
    };
    const onScroll = () => {
      const max = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      if (fillRef.current) fillRef.current.style.transform = `scaleY(${p})`;
      if (dotRef.current) dotRef.current.style.top = `${p * 100}%`;
      const mark = window.scrollY + window.innerHeight * 0.35;
      let idx = 0;
      for (let i = 0; i < topsRef.current.length; i++) if (topsRef.current[i] <= mark) idx = i;
      setActive((prev) => (prev === idx ? prev : idx));
      show();
    };
    measure(); onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 800);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      clearTimeout(t);
      if (idleRef.current) clearTimeout(idleRef.current);
    };
  }, [show]);

  const go = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  const keep = () => { railRef.current?.classList.add("visible"); if (idleRef.current) clearTimeout(idleRef.current); };

  return (
    <div className="scroll-rail" ref={railRef} onMouseEnter={keep} onMouseLeave={show}>
      <div className="scroll-rail-track">
        <div className="scroll-rail-fill" ref={fillRef} />
        {RAIL_SECTIONS.map(([id, label], i) => (
          <button key={id} type="button" className={`scroll-rail-tick${i === active ? " active" : ""}`} style={{ top: `${(fracs[i] ?? 0) * 100}%` }} onClick={() => go(id)} aria-label={label}>
            <span className="scroll-rail-tick-label">{label}</span>
          </button>
        ))}
        <div className="scroll-rail-dot" ref={dotRef}>
          <span className="scroll-rail-dot-label">{RAIL_SECTIONS[active]?.[1]}</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── APP ─────────────── */

export default function App() {
  return (
    <>
      <InjectStyles />
      <Background />
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Marquee alt />
      <Stack />
      <div className="hazard" />
      <Projects />
      <Spotify />
      <Marquee />
      <Contact />
      <Footer />
      <ScrollRail />
      <Dock />
    </>
  );
}
