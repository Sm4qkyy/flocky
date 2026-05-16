import { useEffect, useMemo, useRef, useState } from "react";

const C = {
  black: "#0a0908",
  charcoal: "#1c1917",
  ash: "#2c2825",
  smoke: "#4a453f",
  taupe: "#8c7b6e",
  cream: "#e8e0d5",
  offwhite: "#f4f0eb",
  white: "#fafaf8",
  rose: "#d4a0a0",
  pink: "#e8b4b8",
  burgundy: "#6b1f2a",
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

const globalCss = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;700;800&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: ${C.black};
  color: ${C.cream};
  font-family: ${F.sans};
  overflow-x: hidden;
}
a { color: inherit; text-decoration: none; }
button, a { -webkit-tap-highlight-color: transparent; }
button { font: inherit; }
img { display: block; max-width: 100%; }

body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9997;
  pointer-events: none;
  opacity: .032;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E");
}

#mrk-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 10px;
  height: 10px;
  pointer-events: none;
  border-radius: 50%;
  background: ${C.rose};
  transform: translate(-50%, -50%);
  transition: width .2s, height .2s;
  mix-blend-mode: difference;
}
#mrk-cursor.big { width: 36px; height: 36px; }

.reveal {
  opacity: 0;
  transform: translateY(34px);
  transition: opacity .7s ease, transform .7s ease;
}
.reveal.in { opacity: 1; transform: translateY(0); }

.mrk-nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.2rem clamp(1rem, 4vw, 3rem);
  background: transparent;
  transition: background .25s, backdrop-filter .25s, border-color .25s;
}
.mrk-nav.scrolled {
  background: rgba(10, 9, 8, .78);
  border-bottom: 1px solid ${C.ash};
  backdrop-filter: blur(18px);
}
.nav-logo {
  font-family: ${F.display};
  font-size: 2rem;
  letter-spacing: .06em;
  color: ${C.offwhite};
}
.nav-links {
  display: flex;
  gap: clamp(1rem, 3vw, 2.5rem);
  padding: 0;
  margin: 0;
  list-style: none;
}
.nav-links a, .nav-cta, .tiny-link {
  font-family: ${F.mono};
  font-size: .65rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: ${C.taupe};
}
.nav-links a:hover, .tiny-link:hover { color: ${C.offwhite}; }
.nav-cta {
  padding: .58rem 1.2rem;
  border: 1px solid ${C.smoke};
  color: ${C.cream};
  transition: background .2s, color .2s, border-color .2s;
}
.nav-cta:hover { background: ${C.rose}; border-color: ${C.rose}; color: ${C.black}; }

.section {
  padding: clamp(4rem, 8vw, 7rem) clamp(1.25rem, 4vw, 3rem);
}
.sec-label {
  margin-bottom: 1rem;
  font-family: ${F.mono};
  font-size: .62rem;
  letter-spacing: .24em;
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
  line-height: 1.7;
}
.surface {
  background: ${C.charcoal};
  border: 1px solid ${C.ash};
  border-radius: 12px;
}
.grid-2 {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(2rem, 5vw, 4rem);
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .6rem;
  min-height: 44px;
  padding: .86rem 1.6rem;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  touch-action: manipulation;
  font-family: ${F.mono};
  font-size: .67rem;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.spotify-button {
  background: ${C.green};
  color: ${C.black};
}
.spotify-button:disabled {
  cursor: wait;
  opacity: .7;
}
.rt-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: .75rem 0;
  border-bottom: 1px solid ${C.ash};
}
.line-clamp {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

@keyframes pulse { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.65); } }
@keyframes progressBar { 0% { transform: scaleX(0); transform-origin: left; } 100% { transform: scaleX(1); transform-origin: left; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
@keyframes lineSweep { 0%,100% { opacity: 0; transform: scaleX(.3) translateX(-30%); } 50% { opacity: 1; transform: scaleX(1); } }
@keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

@media (max-width: 820px) {
  .nav-links { display: none; }
  .nav-logo { font-size: 1.45rem; }
  .nav-cta { padding: .48rem .9rem; font-size: .58rem; }
  .grid-2 { grid-template-columns: 1fr; }
  #hero { min-height: 92vh !important; }
  .sec-title { font-size: clamp(2.2rem, 13vw, 4.4rem); }
  .rt-row { flex-wrap: wrap; }
}

@media (hover: none), (pointer: coarse) {
  body { cursor: auto; }
  body::after, #mrk-cursor { display: none !important; }
}
`;

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

function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return undefined;

    const el = ref.current;
    if (!el) return undefined;

    const move = (event) => {
      el.style.left = `${event.clientX}px`;
      el.style.top = `${event.clientY}px`;
    };
    const over = (event) => {
      if (event.target.closest("a,button,.hov")) el.classList.add("big");
    };
    const out = () => el.classList.remove("big");

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(hover: none), (pointer: coarse)").matches) {
    return null;
  }

  return <div id="mrk-cursor" ref={ref} />;
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`mrk-nav${scrolled ? " scrolled" : ""}`}>
      <a href="#hero" className="nav-logo">FLOCKY</a>
      <ul className="nav-links">
        {["about", "portfolio", "blog", "music", "contact"].map((section) => (
          <li key={section}><a href={`#${section}`}>{section}</a></li>
        ))}
      </ul>
      <a href="#contact" className="nav-cta">Contact Me</a>
    </nav>
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
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 70% 30%, #2a1a1a 0%, ${C.black} 60%)`,
        }}
      />
      {[20, 45, 70].map((top, index) => (
        <div
          key={top}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: `${top}%`,
            height: 1,
            pointerEvents: "none",
            background: "linear-gradient(90deg, transparent, rgba(139,123,110,.15), transparent)",
            animation: `lineSweep 8s ${index * 2}s infinite ease-in-out`,
          }}
        />
      ))}
      {labels.map(({ text, top, right, delay }) => (
        <div
          key={text}
          aria-hidden="true"
          style={{
            position: "absolute",
            top,
            right,
            zIndex: 2,
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

      <div style={{ position: "relative", zIndex: 2, maxWidth: 980 }}>
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
        <p className="muted" style={{ maxWidth: 470, marginTop: "1.3rem", animation: "fadeUp .9s .6s both" }}>
          Creators, coders, collaborators, and curious minds building, dreaming, and flying together.
        </p>
      </div>
    </section>
  );
}

function About() {
  const stats = [
    ["42", "Members"],
    ["∞", "Ideas Hatching"],
    ["24/7", "Coffee Consumed"],
    ["100%", "Open Source"],
  ];

  return (
    <section id="about" className="section grid-2" style={{ background: C.charcoal, borderBlock: `1px solid ${C.ash}` }}>
      <Reveal>
        <div className="sec-label">Who We Are</div>
        <h2 className="sec-title">FLY AS<br />ONE.</h2>
        <p className="muted" style={{ maxWidth: 520 }}>
          A collective of builders, tinkerers, artists, and thinkers. From projects and events to memes and code, FLOCKY is designed to bring talented people together for fun and impact.
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 1, background: C.ash }}>
          {stats.map(([num, label]) => (
            <div key={label} style={{ background: C.charcoal, padding: "2rem 1.4rem" }}>
              <div style={{ fontFamily: F.display, fontSize: "clamp(2.8rem, 8vw, 3.5rem)", lineHeight: 1, color: C.rose }}>
                {num}
              </div>
              <div className="tiny-link" style={{ color: C.smoke, marginTop: ".5rem" }}>{label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const WORKS = [
  ["Open Source", "flocky.dev Platform", "linear-gradient(135deg,#1c1710,#2d1f1f)"],
  ["Event", "Global Flockathon", "linear-gradient(135deg,#0d1220,#1a2340)"],
  ["Art", "Flocky Art Zine", "linear-gradient(135deg,#1a0a0a,#3d1515)"],
  ["Web", "Member Directory", "linear-gradient(135deg,#0e120e,#1f2e1f)"],
  ["Music", "Birds of a Feather", "linear-gradient(135deg,#1a1510,#2e2010)"],
  ["Dev", "Discord Bots", "linear-gradient(135deg,#100d1a,#1e1530)"],
];

function Portfolio() {
  return (
    <section id="portfolio" className="section" style={{ background: C.black }}>
      <Reveal>
        <div className="sec-label">Featured Projects</div>
        <h2 className="sec-title">PORT<br />FOLIO.</h2>
      </Reveal>

      <Reveal delay={100}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: ".75rem", marginTop: "3rem" }}>
          {WORKS.map(([tag, title, bg], index) => (
            <article
              key={title}
              className="surface hov"
              style={{
                minHeight: index === 0 ? 320 : 190,
                gridColumn: index === 0 ? "span 2" : undefined,
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: "1.4rem",
                overflow: "hidden",
                background: bg,
              }}
            >
              <div className="tiny-link" style={{ color: C.rose }}>{tag}</div>
              <h3 style={{ margin: ".35rem 0 0", color: C.white }}>{title}</h3>
            </article>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

const POSTS = [
  ["APR 2025", "How to Hatch Big Ideas with a Flock", "Great things are not built alone. Here is how FLOCKY members collaborate and ship."],
  ["MAR 2025", "Cultivating the Strangest Talents", "From code to art to memes, if it is interesting, we want to see it."],
  ["FEB 2025", "Why Discord is the Best HQ", "The coffee is digital, but the community is real."],
];

function Blog() {
  return (
    <section id="blog" className="section" style={{ background: C.charcoal, borderTop: `1px solid ${C.ash}` }}>
      <Reveal>
        <div className="sec-label">Thoughts and FlockNotes</div>
        <h2 className="sec-title">BLOG.</h2>
      </Reveal>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: ".75rem", marginTop: "3rem" }}>
        {POSTS.map(([date, title, excerpt], index) => (
          <Reveal key={title} delay={index * 90}>
            <article className="surface hov" style={{ height: "100%", padding: "2rem" }}>
              <div className="tiny-link" style={{ color: C.smoke }}>{date}</div>
              <h3 style={{ fontFamily: F.serif, fontSize: "1.45rem", lineHeight: 1.25, color: C.offwhite }}>{title}</h3>
              <p className="muted">{excerpt}</p>
              <div className="tiny-link" style={{ marginTop: "1.5rem", color: C.rose }}>Read More</div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}


function timeAgo(ms) {
  const seconds = Math.floor((Date.now() - ms) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function NowPlaying({ track, isPlaying }) {
  const artists = track?.artists?.map((artist) => artist.name).join(", ");

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
    const intervalId = window.setInterval(load, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
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
                    {item.track?.artists?.map((artist) => artist.name).join(", ")}
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
        <div className="sec-label">Connect on Discord</div>
        <h2 className="sec-title">ADD ME<br />ON<br />DISCORD.</h2>
        <p className="muted" style={{ maxWidth: 520, margin: "1.5rem auto 2rem" }}>
          Want to get in touch? Click below to copy my username, then add me as a friend in Discord.
        </p>
        <button
          type="button"
          className="button hov"
          onClick={copyDiscord}
          style={{
            width: "min(100%, 380px)",
            padding: "1rem 1.4rem",
            border: `2px solid ${copied ? C.teal : C.rose}`,
            background: copied ? C.rose : C.black,
            color: copied ? C.black : C.rose,
            fontSize: "1rem",
          }}
        >
          {copied ? "Copied" : DISCORD_USERNAME}
        </button>
      </Reveal>
    </section>
  );
}

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
        2026 FLOCKY Collective. All rights reserved.
      </div>
      <div style={{ display: "flex", gap: "1.3rem" }}>
        {[
          ["DISCORD", "#contact"],
          ["TW", "#"],
          ["GITHUB", "#"],
          ["YT", "#"],
        ].map(([label, href]) => (
          <a key={label} href={href} className="tiny-link">{label}</a>
        ))}
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <InjectStyles />
      <Cursor />
      <Nav />
      <Hero />
      <About />
      <Portfolio />
      <Blog />
      <Music />
      <Contact />
      <Footer />
    </>
  );
}
