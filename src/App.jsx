import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MagicRings from "./MagicRings/MagicRings";
import RotatingText from "./RotatingText/RotatingText";

const C = {
  black: "#080810",
  charcoal: "#0e0e18",
  ash: "#1a1a28",
  smoke: "#2e2e42",
  taupe: "#6b6b88",
  cream: "#e8e2dc",
  offwhite: "#f5f0eb",
  white: "#fafaf8",
  rose: "#c9956c",
  pink: "#e8c4b0",
  burgundy: "#8b5e3c",
  teal: "#2a8a8a",
  green: "#1db954",
};

const F = {
  display: "'Bebas Neue', sans-serif",
  serif: "'DM Serif Display', serif",
  sans: "'Syne', sans-serif",
  mono: "'Space Mono', monospace",
};

const DISCORD_USERNAME = "flocky._";

/* ─────────────── DATA ─────────────── */

const SKILLS = [
  { cat: "Code", items: ["React", "TypeScript", "Node.js", "Python", "Rust", "SQL"] },
  { cat: "Design", items: ["Figma", "Three.js", "CSS", "Blender", "GSAP"] },
  { cat: "Music", items: ["FL Studio", "Ableton", "Logic Pro", "Max/MSP"] },
  { cat: "Infra", items: ["Vercel", "Docker", "Git", "Linux", "Cloudflare"] },
];

/* ─────────────── STYLES ─────────────── */

const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600&family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html, body { scroll-behavior: smooth; }
body {
  margin: 0;
  background: ${C.black};
  color: ${C.cream};
  font-family: 'Inter', ${F.sans};
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; text-decoration: none; }
button, a { -webkit-tap-highlight-color: transparent; }
button { font: inherit; }
img { display: block; max-width: 100%; }

/* grain overlay */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  opacity: .055;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ambient glow behind page */
body::before {
  content: "";
  position: fixed;
  top: -20%;
  left: 50%;
  transform: translateX(-50%);
  width: 80vw;
  height: 60vh;
  background: radial-gradient(ellipse at center, rgba(201,149,108,.07) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* ── REVEAL / PAGE TRANSITIONS ── */
.reveal {
  opacity: 0;
  transform: translateY(28px) scale(.99);
  filter: blur(3px);
  transition: opacity .7s ease, transform .7s ease, filter .7s ease;
}
.reveal.in {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
}

/* ── NAV ── */
.mrk-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem clamp(1rem, 4vw, 3rem);
  background: transparent;
  transition: background .3s, backdrop-filter .3s, border-color .3s;
}
.mrk-nav.scrolled {
  background: rgba(8,8,16,.72);
  border-bottom: 1px solid rgba(201,149,108,.12);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
}
.nav-logo {
  font-family: ${F.display};
  font-size: 1.9rem;
  letter-spacing: .08em;
  color: ${C.offwhite};
  background: linear-gradient(135deg, ${C.offwhite} 40%, ${C.rose});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nav-links {
  display: flex;
  gap: clamp(1rem, 3vw, 2.2rem);
  padding: 0; margin: 0;
  list-style: none;
}
.nav-links a, .nav-cta, .tiny-link {
  font-family: ${F.mono};
  font-size: .62rem;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: ${C.taupe};
  transition: color .2s;
}
.nav-links a:hover, .tiny-link:hover { color: ${C.offwhite}; }
.nav-cta {
  padding: .52rem 1.1rem;
  border-radius: 9999px;
  border: 1px solid rgba(201,149,108,.35);
  color: ${C.pink};
  background: rgba(201,149,108,.08);
  transition: background .2s, border-color .2s, box-shadow .2s, color .2s;
}
.nav-cta:hover {
  background: ${C.rose};
  border-color: ${C.rose};
  color: ${C.black};
  box-shadow: 0 0 18px rgba(201,149,108,.5), 0 0 36px rgba(201,149,108,.2);
}

/* ── MOBILE HAMBURGER ── */
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  width: 42px; height: 42px;
  background: rgba(201,149,108,.08);
  border: 1px solid rgba(201,149,108,.2);
  border-radius: 10px;
  cursor: pointer;
  flex-shrink: 0;
  padding: 0;
}
.menu-bar {
  width: 18px; height: 1.5px;
  background: ${C.rose};
  border-radius: 2px;
  transition: transform .3s, opacity .3s;
  display: block;
}
.mobile-menu-btn.open .menu-bar:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.mobile-menu-btn.open .menu-bar:nth-child(2) { opacity: 0; transform: scaleX(0); }
.mobile-menu-btn.open .menu-bar:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ── MOBILE DRAWER ── */
.mobile-drawer {
  position: fixed;
  inset: 0;
  z-index: 990;
  background: rgba(8,8,16,.97);
  backdrop-filter: blur(28px);
  -webkit-backdrop-filter: blur(28px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity .35s ease, visibility .35s ease;
}
.mobile-drawer.open {
  opacity: 1;
  visibility: visible;
}
.mobile-drawer a {
  font-family: ${F.display};
  font-size: clamp(2.5rem, 10vw, 4rem);
  letter-spacing: .06em;
  color: ${C.offwhite};
  transition: color .2s;
}
.mobile-drawer a:hover { color: ${C.rose}; }
.mobile-drawer-sub {
  margin-top: 1rem;
  display: flex;
  gap: 2rem;
}
.mobile-drawer-sub a {
  font-family: ${F.mono};
  font-size: .62rem;
  letter-spacing: .18em;
  font-size: .62rem;
  color: ${C.smoke};
}

/* ── SECTIONS ── */
.section {
  padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 3rem);
  position: relative;
}
.sec-label {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  margin-bottom: 1.2rem;
  padding: .28rem .9rem;
  border-radius: 9999px;
  border: 1px solid rgba(201,149,108,.25);
  background: rgba(201,149,108,.07);
  font-family: ${F.mono};
  font-size: .58rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: ${C.rose};
}
.sec-title {
  margin: 0;
  font-family: ${F.display};
  font-size: clamp(3rem, 9vw, 7.5rem);
  line-height: .9;
  letter-spacing: .02em;
  color: ${C.offwhite};
}
.muted {
  color: ${C.taupe};
  line-height: 1.75;
  font-size: .95rem;
}
.text-rotate-hero {
  color: ${C.rose};
  font-family: ${F.serif};
  font-style: italic;
  overflow: hidden;
}

/* ── CARDS ── */
.surface {
  background: rgba(14,14,24,.8);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 16px;
  backdrop-filter: blur(8px);
}
.grid-2 {
  display: grid;
  grid-template-columns: minmax(0,1fr) minmax(0,1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
}

/* ── BUTTONS ── */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .6rem;
  min-height: 44px;
  padding: .8rem 1.6rem;
  border: 0;
  border-radius: 9999px;
  cursor: pointer;
  touch-action: manipulation;
  font-family: ${F.mono};
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  transition: box-shadow .2s, transform .15s, background .2s;
}
.button:hover { transform: translateY(-1px); }

.spotify-button {
  background: ${C.green};
  color: ${C.black};
  box-shadow: 0 0 14px rgba(29,185,84,.3);
}
.spotify-button:disabled { cursor: wait; opacity: .7; }

/* ── MUSIC ROWS ── */
.rt-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: .75rem 0;
  border-bottom: 1px solid rgba(255,255,255,.05);
}
.line-clamp {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* ── SECTION DIVIDERS ── */
.section + .section,
section + section {
  border-top: 1px solid rgba(255,255,255,.05);
}

/* ── JOIN CTA ── */
.join-cta {
  position: relative;
  text-align: center;
  overflow: hidden;
}
.join-cta::before {
  content: "";
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 700px; height: 700px;
  background: radial-gradient(ellipse, rgba(201,149,108,.06) 0%, transparent 70%);
  pointer-events: none;
}

/* ── SKILLS ── */
.skill-group { margin-bottom: 2.5rem; }
.skill-group-label {
  font-family: ${F.mono};
  font-size: .6rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: ${C.rose};
  margin-bottom: 1rem;
}
.skills-chips {
  display: flex;
  flex-wrap: wrap;
  gap: .55rem;
}
.skill-chip {
  padding: .42rem 1rem;
  border-radius: 9999px;
  border: 1px solid rgba(255,255,255,.1);
  background: rgba(255,255,255,.04);
  font-family: ${F.mono};
  font-size: .65rem;
  letter-spacing: .06em;
  color: ${C.cream};
  transition: border-color .2s, background .2s, color .2s, transform .15s;
  cursor: default;
}
.skill-chip:hover {
  border-color: rgba(201,149,108,.5);
  background: rgba(201,149,108,.1);
  color: ${C.rose};
  transform: translateY(-2px);
}

/* ── ANIMATIONS ── */
@keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.4; transform:scale(.65); } }
@keyframes progressBar { 0% { transform:scaleX(0); transform-origin:left; } 100% { transform:scaleX(1); transform-origin:left; } }
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes floatY { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
@keyframes glowPulse { 0%,100% { box-shadow:0 0 18px rgba(201,149,108,.4); } 50% { box-shadow:0 0 32px rgba(201,149,108,.7), 0 0 60px rgba(201,149,108,.25); } }

/* ── RESPONSIVE ── */
@media (max-width: 820px) {
  .nav-links { display: none; }
  .nav-logo { font-size: 1.4rem; }
  .nav-cta { padding: .44rem .9rem; font-size: .58rem; }
  .mobile-menu-btn { display: flex; }
  .grid-2 { grid-template-columns: 1fr; }
  #hero { min-height: 92vh !important; }
  .sec-title { font-size: clamp(2.2rem, 13vw, 4.4rem); }
  .rt-row { flex-wrap: wrap; }
}

@media (hover: none), (pointer: coarse) {
  body::after { display: none !important; }
}
`;

/* ─────────────── UTILITIES ─────────────── */

function InjectStyles() {
  useEffect(() => {
    const id = "mrk-global-styles";
    if (document.getElementById(id)) return undefined;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = globalCss;
    document.head.appendChild(style);
    return () => document.getElementById(id)?.remove();
  }, []);
  return null;
}

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

function NavLink({ id, children, className, onClick }) {
  const handleClick = (e) => {
    e.preventDefault();
    scrollTo(id);
    onClick?.();
  };
  return (
    <a href={`#${id}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
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

/* ─────────────── NAV ─────────────── */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const NAV_SECTIONS = ["skills", "music", "contact"];

  return (
    <>
      <nav className={`mrk-nav${scrolled ? " scrolled" : ""}`}>
        <NavLink id="hero" className="nav-logo" onClick={close}>FLOCKY</NavLink>
        <ul className="nav-links">
          {NAV_SECTIONS.map((s) => (
            <li key={s}><NavLink id={s}>{s}</NavLink></li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: ".75rem" }}>
          <NavLink id="contact" className="nav-cta">Work With Me</NavLink>
          <button
            type="button"
            className={`mobile-menu-btn${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className="menu-bar" />
            <span className="menu-bar" />
            <span className="menu-bar" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`mobile-drawer${menuOpen ? " open" : ""}`}>
        {NAV_SECTIONS.map((s) => (
          <NavLink key={s} id={s} onClick={close}>{s.toUpperCase()}</NavLink>
        ))}
        <div className="mobile-drawer-sub">
          <a href="mailto:flocky88@outlook.com" className="tiny-link">EMAIL</a>
          <a href="#contact" className="tiny-link" onClick={close}>DISCORD</a>
          <a href="https://github.com/Sm4qkyy" target="_blank" rel="noreferrer" className="tiny-link">GITHUB</a>
        </div>
      </div>
    </>
  );
}

/* ─────────────── HERO ─────────────── */

function Hero() {
  const labels = [
    { text: "Tokyo", top: "22%", right: "8%", delay: "0s" },
    { text: "Cyberspace", top: "52%", right: "4%", delay: "2s" },
    { text: "The Flock", top: "68%", right: "12%", delay: "4s" },
  ];

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 clamp(1.25rem, 4vw, 3rem) 5rem",
        overflow: "hidden",
        background: C.black,
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", inset: "-60px", zIndex: 2, pointerEvents: "none" }}>
        <MagicRings
          color="#c9956c"
          colorTwo="#8b5e3c"
          ringCount={8}
          speed={0.6}
          attenuation={2.5}
          lineThickness={12}
          baseRadius={0.1}
          radiusStep={0.18}
          scaleRate={0.35}
          opacity={0.85}
          blur={40}
          noiseAmount={0.05}
          ringGap={1.2}
          fadeIn={0.5}
          fadeOut={0.4}
          followMouse
          mouseInfluence={0.15}
          parallax={0.03}
          clickBurst
        />
      </div>

      {labels.map(({ text, top, right, delay }) => (
        <div
          key={text}
          aria-hidden="true"
          style={{
            position: "absolute",
            top,
            right,
            zIndex: 3,
            userSelect: "none",
            pointerEvents: "none",
            padding: ".32rem .75rem",
            border: `1px solid ${C.ash}`,
            background: "rgba(10,9,8,.6)",
            backdropFilter: "blur(8px)",
            fontFamily: F.mono,
            fontSize: ".58rem",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: C.smoke,
            animation: `floatY 6s ${delay} ease-in-out infinite`,
          }}
        >
          {text}
        </div>
      ))}

      <div style={{ position: "relative", zIndex: 1, maxWidth: 980 }}>
        <div className="sec-label" style={{ animation: "fadeUp .9s .2s both" }}>
          Creative Playground and Cultivation
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: F.display,
            fontSize: "clamp(5rem, 15vw, 13rem)",
            lineHeight: 0.92,
            letterSpacing: ".02em",
            color: C.offwhite,
            animation: "fadeUp .9s .4s both",
          }}
        >
          FLOCKY
          <br />
          <span style={{ fontFamily: F.serif, fontStyle: "italic", color: C.rose, fontSize: ".68em" }}>
            Collective
          </span>
        </h1>
        <p className="muted" style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: ".5rem", marginTop: "1.3rem", animation: "fadeUp .9s .6s both" }}>
          We are
          <RotatingText
            texts={["Creators.", "Coders.", "Collaborators.", "Curious Minds.", "Dream Builders.", "Open Source."]}
            splitBy="characters"
            staggerFrom="last"
            staggerDuration={0.025}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-120%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={2200}
            mainClassName="text-rotate-hero"
            splitLevelClassName="overflow-hidden"
          />
        </p>
      </div>
    </section>
  );
}

/* ─────────────── SKILLS ─────────────── */

function Skills() {
  return (
    <section
      id="skills"
      className="section"
      style={{ background: C.charcoal, borderTop: `1px solid ${C.ash}` }}
    >
      <Reveal>
        <div className="sec-label">Toolkit</div>
        <h2 className="sec-title">STACK.</h2>
      </Reveal>
      <Reveal delay={120}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            marginTop: "3rem",
          }}
        >
          {SKILLS.map(({ cat, items }) => (
            <div key={cat} className="skill-group">
              <div className="skill-group-label">{cat}</div>
              <div className="skills-chips">
                {items.map((item) => (
                  <span key={item} className="skill-chip">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── JOIN CTA ─────────────── */

const DISCORD_INVITE = ""; // TODO: paste real https://discord.gg/... invite here

function JoinCTA() {
  return (
    <section
      className="section join-cta"
      style={{ background: C.charcoal, borderTop: `1px solid ${C.ash}`, textAlign: "center" }}
    >
      <Reveal>
        <div className="sec-label">Hang Out</div>
        <h2
          className="sec-title"
          style={{ fontSize: "clamp(3.5rem, 12vw, 10rem)", lineHeight: .88 }}
        >
          FIND<br />
          <span style={{ fontFamily: F.serif, fontStyle: "italic", color: C.rose, fontSize: ".75em" }}>
            me online.
          </span>
        </h2>
        <p className="muted" style={{ maxWidth: 520, margin: "1.5rem auto 2.5rem" }}>
          I build things, listen to music, and tinker with shaders. If any of that sounds fun — say hi.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          {DISCORD_INVITE && (
            <a
              href={DISCORD_INVITE}
              target="_blank"
              rel="noreferrer"
              className="button hov"
              style={{
                background: C.rose,
                color: C.black,
                fontSize: ".75rem",
                padding: "1rem 2.5rem",
                boxShadow: `0 0 20px rgba(201,149,108,.4), 0 0 45px rgba(201,149,108,.15)`,
              }}
            >
              Join Discord
            </a>
          )}
          <a
            href="https://github.com/Sm4qkyy"
            target="_blank"
            rel="noreferrer"
            className="button hov"
            style={{
              background: "transparent",
              color: C.cream,
              fontSize: ".75rem",
              padding: "1rem 2.5rem",
              border: `1px solid rgba(255,255,255,.12)`,
            }}
          >
            GitHub →
          </a>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── MUSIC ─────────────── */

function timeAgo(ms) {
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function NowPlaying({ track, isPlaying }) {
  const artists = track?.artists?.map((a) => a.name).join(", ");

  return (
    <div className="surface" style={{ padding: "2rem", position: "relative", overflow: "hidden" }}>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "0 0 auto",
          height: 2,
          background: `linear-gradient(90deg, ${C.burgundy}, ${C.rose}, ${C.pink})`,
          animation: "progressBar 30s linear infinite",
        }}
      />
      <div className="tiny-link" style={{ display: "flex", alignItems: "center", gap: ".5rem", color: C.rose, marginBottom: "1.5rem" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.rose, animation: "pulse 2s infinite" }} />
        {isPlaying ? "Now Playing" : "Last Played"}
      </div>
      <div
        style={{
          aspectRatio: "1",
          display: "grid",
          placeItems: "center",
          marginBottom: "1.4rem",
          overflow: "hidden",
          borderRadius: 10,
          background: `linear-gradient(135deg, ${C.ash}, ${C.smoke})`,
        }}
      >
        {track?.album?.images?.[0]?.url ? (
          <img src={track.album.images[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.taupe, opacity: .28 }} />
        )}
      </div>
      <h3 className="line-clamp" style={{ margin: 0, color: C.offwhite }}>{track?.name || "Nothing playing"}</h3>
      <div className="line-clamp" style={{ marginTop: ".35rem", color: C.taupe, fontFamily: F.mono, fontSize: ".75rem" }}>
        {artists || "—"}
      </div>
      {track?.external_urls?.spotify && (
        <a className="button spotify-button" href={track.external_urls.spotify} target="_blank" rel="noreferrer" style={{ marginTop: "1.5rem", width: "100%" }}>
          Open on Spotify
        </a>
      )}
    </div>
  );
}

function Music() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const demoNow = useMemo(() => ({
    name: "Welcome To The Flock",
    artists: [{ name: "FLOCKY Band" }],
    album: { images: [{ url: "" }] },
    external_urls: { spotify: "#" },
  }), []);

  const demoRecent = useMemo(() => [
    ["Birdcode Jam", "FLOCKY Sound", 1800000],
    ["Feathered Loops", "Lo Fi Flock", 3600000],
    ["Digital Roost", "NestNet", 7200000],
    ["Sunrise Singalong", "The Collective", 10800000],
  ].map(([name, artist, age]) => ({
    track: { name, artists: [{ name: artist }], album: { images: [{ url: "" }] } },
    played_at: new Date(Date.now() - age).toISOString(),
  })), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) throw new Error("Could not load music data.");
        const json = await res.json();
        if (cancelled) return;
        setData(json);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(err.message || "Could not load music data.");
      }
    };
    load();
    const id = window.setInterval(load, 30000);
    return () => { cancelled = true; window.clearInterval(id); };
  }, []);

  const activeNow = data?.nowPlaying ?? demoNow;
  const activeRecent = data?.recent ?? demoRecent;
  const activePlaying = data?.isPlaying ?? true;

  return (
    <section id="music" className="section" style={{ background: C.black, borderTop: `1px solid ${C.ash}` }}>
      <Reveal>
        <div className="sec-label">Sound and Taste</div>
        <h2 className="sec-title" style={{ marginBottom: "3rem" }}>MUSIC.</h2>
      </Reveal>

      {error && (
        <div className="surface" style={{ padding: "1rem", marginBottom: "2rem", color: C.rose, fontFamily: F.mono, fontSize: ".75rem" }}>
          {error}
        </div>
      )}

      <Reveal>
        <div className="grid-2">
          <NowPlaying track={activeNow} isPlaying={activePlaying} />
          <div>
            <div className="tiny-link" style={{ color: C.smoke, marginBottom: "1rem" }}>Recently Played</div>
            {activeRecent.length === 0 && <p className="muted">No recent tracks found yet.</p>}
            {activeRecent.map((item, index) => (
              <div key={`${item.played_at}-${index}`} className="rt-row">
                <div style={{ width: 24, color: C.smoke, fontFamily: F.mono, fontSize: ".62rem", textAlign: "right", flexShrink: 0 }}>
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div style={{ width: 42, height: 42, flexShrink: 0, overflow: "hidden", borderRadius: 6, background: C.ash }}>
                  {item.track?.album?.images?.[2]?.url && (
                    <img src={item.track.album.images[2].url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="line-clamp" style={{ color: C.cream, fontWeight: 700 }}>{item.track?.name}</div>
                  <div className="line-clamp" style={{ color: C.taupe, fontFamily: F.mono, fontSize: ".58rem", marginTop: ".15rem" }}>
                    {item.track?.artists?.map((a) => a.name).join(", ")}
                  </div>
                </div>
                <div style={{ color: C.smoke, fontFamily: F.mono, fontSize: ".58rem", flexShrink: 0 }}>
                  {timeAgo(new Date(item.played_at).getTime())}
                </div>
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
  const [copied, setCopied] = useState(false);

  const copyDiscord = async () => {
    try {
      await navigator.clipboard.writeText(DISCORD_USERNAME);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="section" style={{ background: C.charcoal, borderTop: `1px solid ${C.ash}`, textAlign: "center" }}>
      <Reveal>
        <div className="sec-label">Open to Collabs</div>
        <h2 className="sec-title">WORK<br />WITH ME.</h2>
        <p className="muted" style={{ maxWidth: 520, margin: "1.5rem auto 2.5rem" }}>
          Got a project, collab, or opportunity? Reach out via email or Discord — I'd love to hear from you.
        </p>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <a
            href="mailto:flocky88@outlook.com"
            className="button hov"
            style={{
              width: "min(100%, 380px)",
              padding: "1rem 1.4rem",
              border: `2px solid ${C.rose}`,
              background: C.rose,
              color: C.black,
              fontSize: "1rem",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            flocky88@outlook.com
          </a>
          <button
            type="button"
            className="button hov"
            onClick={copyDiscord}
            style={{
              width: "min(100%, 380px)",
              padding: "1rem 1.4rem",
              border: `2px solid ${copied ? C.teal : C.ash}`,
              background: copied ? C.teal : "transparent",
              color: copied ? C.black : C.taupe,
              fontSize: "1rem",
            }}
          >
            {copied ? "Copied!" : `Discord: ${DISCORD_USERNAME}`}
          </button>
        </div>
      </Reveal>
    </section>
  );
}

/* ─────────────── FOOTER ─────────────── */

function Footer() {
  return (
    <footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
        padding: "2.5rem clamp(1.25rem, 4vw, 3rem)",
        borderTop: `1px solid ${C.ash}`,
        background: C.black,
      }}
    >
      <div style={{ fontFamily: F.display, fontSize: "2.2rem", color: C.ash }}>FLOCKY</div>
      <div style={{ color: C.smoke, fontFamily: F.mono, fontSize: ".58rem", letterSpacing: ".15em" }}>
        © {new Date().getFullYear()} FLOCKY Collective. All rights reserved.
      </div>
      <div style={{ display: "flex", gap: "1.3rem" }}>
        {[["DISCORD", "#contact"], ["GITHUB", "https://github.com/Sm4qkyy"], ["EMAIL", "mailto:flocky88@outlook.com"]].map(([label, href]) => (
          <a key={label} href={href} className="tiny-link">{label}</a>
        ))}
      </div>
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
      <Skills />
      <JoinCTA />
      <Music />
      <Contact />
      <Footer />
    </>
  );
}
