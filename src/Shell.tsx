import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "./Navigation";
import { Menu, X } from "lucide-react";
import { profile } from "./data/portfolio";
import { useParallax, useReducedMotion } from "./motion";

export function Marquee({ text }: { text: string }) {
  return (
    <div className="marquee">
      <div className="marquee-track">
        <span>{text}&nbsp;</span>
        <span aria-hidden="true">{text}&nbsp;</span>
      </div>
    </div>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="header-location">
        {profile.location}
        <span>{profile.reach}</span>
      </div>
      <div>
        Building and Learning at
        <a
          href={profile.companyUrl}
          target="_blank"
          rel="noreferrer"
          className="roll-link"
        >
          <span>{profile.company}</span>
          <span aria-hidden="true">{profile.company}</span>
        </a>
      </div>
      <div className="header-availability">
        Freelance availability<span>{profile.availability}</span>
      </div>
      <a className="contact-pill" href={`mailto:${profile.email}`}>
        <span className="contact-hand" aria-hidden="true">
          🤙🏼
        </span>
        <span className="contact-label">
          <span>Get in touch</span>
          <span aria-hidden="true">Get in touch</span>
        </span>
      </a>
    </header>
  );
}

export function FloatingNav() {
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false),
    [hidden, setHidden] = useState(false);
  const root = useRef<HTMLDivElement>(null),
    toggle = useRef<HTMLButtonElement>(null);
  const location = useLocation();
  useEffect(() => {
    setOpen(false);
    setHidden(false);
  }, [location.pathname]);
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([e]) => setHidden(e.intersectionRatio >= 0.4),
      { threshold: [0, 0.4] },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const outside = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const keyboard = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", keyboard);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", keyboard);
    };
  }, [open]);
  return (
    <div
      ref={root}
      className={`floating-nav ${open ? "is-open" : ""} ${hidden && !open ? "is-hidden" : ""}`}
    >
      <div className="menu-expand" {...(!open ? { inert: "" } : {})}>
        <nav id="navigation-menu" aria-label="Main navigation">
          {["Home", "Work"].map((title, i) => (
            <Link
              delay={500}
              to={i ? `/${title.toLowerCase()}` : "/"}
              key={title}
              onClick={() => setOpen(false)}
            >
              <img
                src={`/images/pages/${title.toLowerCase()}-icon.png`}
                alt=""
              />
              <span className="menu-label">
                <span>{title}</span>
                <span aria-hidden="true">{title}</span>
              </span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="profile-row">
        <div className="profile-avatar">
          <video
            autoPlay={!reducedMotion}
            loop
            muted
            playsInline
            src="/videos/emoji.mov"
          />
        </div>
        <div className="profile-copy">
          <Link to="/">{profile.name}</Link>
          <Marquee text={profile.roles} />
        </div>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="navigation-menu"
          onClick={() => setOpen((x) => !x)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </div>
  );
}
export function Footer() {
  const footer = useRef<HTMLElement>(null),
    title = useRef<HTMLHeadingElement>(null);
  useParallax(footer, title);
  return (
    <footer ref={footer}>
      <h2 ref={title}>itssachin.indevs.in</h2>
      <div className="footer-grid">
        <Link className="footer-work" to="/work">
          Work
        </Link>
        <div className="footer-small">
          <a href={`mailto:${profile.contactEmail}`}>Contact</a>
          <a
            href="https://github.com/sachineldho24"
            target="_blank"
            rel="noreferrer"
          >
            Github
          </a>
        </div>
        <a
          href="https://www.instagram.com/__sachineldho__"
          target="_blank"
          rel="noreferrer"
        >
          Instagram
        </a>
        <a
          href="https://www.linkedin.com/in/sachin-eldho"
          target="_blank"
          rel="noreferrer"
        >
          LinkedIn
        </a>
        <a
          href="https://x.com/sachin_eldho24"
          target="_blank"
          rel="noreferrer"
        >
          X
        </a>
      </div>
    </footer>
  );
}

export function LoadingScreen() {
  const [value, setValue] = useState(0),
    [done, setDone] = useState(false);
  useEffect(() => {
    const start = performance.now();
    const previousOverflow = document.body.style.overflow;
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      document.body.style.overflow = "hidden";
    let raf = 0;
    const tick = () => {
      const n = Math.min(100, Math.floor((performance.now() - start) / 10));
      setValue(n);
      if (n < 100) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const timer = setTimeout(() => {
      setDone(true);
      document.body.style.overflow = previousOverflow;
    }, 2500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
    };
  }, []);
  return done ? null : (
    <div
      className={`loading-screen ${value === 100 ? "loading-done" : ""}`}
      aria-hidden="true"
    >
      <span>{value}</span>
    </div>
  );
}
