import { Fragment, useEffect, useRef } from "react";
import { Link } from "./Navigation";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Media } from "./Media";
import { ProjectCard } from "./Work";
import { profile, projects, services } from "./data/portfolio";
import aboutWords from "./data/about-words.json";
import { ParallaxImage } from "./ParallaxImage";
import { SkillCards } from "./SkillCards";
import { TechStack } from "./TechStack";

function Hero() {
  const video = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let frame = 0,
      target = 0,
      x = 0,
      hasScrolled = false;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = (e: MouseEvent) => {
      target = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    const update = () => {
      const width = window.innerWidth,
        height = window.innerHeight;
      if (width >= 768) {
        const sectionTop =
          element.parentElement!.getBoundingClientRect().top + window.scrollY;
        hasScrolled = hasScrolled || window.scrollY > 8;
        const progress = Math.min(
          1,
          Math.max(
            0,
            hasScrolled
              ? (window.scrollY - sectionTop + height) / (height * 0.9)
              : 0,
          ),
        );
        const initialOffset =
          width <= 900
            ? -95
            : width <= 1200
              ? -105
              : width <= 1600
                ? -118
                : width <= 2000
                  ? -110
                  : width <= 2500
                    ? -115
                    : -125;
        const initialY = (initialOffset / 100) * height;
        const scale = 0.35 + 0.65 * progress,
          space = ((width - 64) * (1 - scale)) / 2;
        x += (motion.matches ? 0 : target * space - x) * 0.15;
        element.style.transform = `translateY(${initialY * (1 - progress)}px) translateX(${x}px) scale(${scale})`;
      } else element.style.transform = "none";
      frame = requestAnimationFrame(update);
    };
    window.addEventListener("mousemove", mouse, { passive: true });
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", mouse);
    };
  }, []);

  return (
    <>
      <section className="hero" aria-label="A seriously good AI engineer">
        <div className="hero-title">
          <div className="hero-kicker">
            <span>A</span>
            <span>Seriously</span>
            <span>Good</span>
          </div>
          <div className="mobile-hero-video">
            <Media name="hero" controls />
          </div>
          <h1 className="hero-role" aria-label="AI Engineer">
            <span className="hero-initials" aria-hidden="true">
              <span>A</span>
              <span className="hero-slanted-i">I</span>
            </span>
            <span>Engineer</span>
          </h1>
        </div>
        <a className="scroll-prompt scroll-left" href="#about">
          <ArrowDown />
          Scroll for
        </a>
        <a className="scroll-prompt scroll-right" href="#about">
          cool sh*t
          <ArrowDown />
        </a>
      </section>
      <section className="hero-media" aria-label="Showreel">
        <div ref={video} className="hero-video">
          <Media name="hero" controls />
        </div>
      </section>
    </>
  );
}
function About() {
  const text = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const el = text.current;
    if (!el) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const words = el.querySelectorAll<HTMLElement>("span");
      if (reducedMotion.matches) {
        words.forEach((word) => word.style.removeProperty("transform"));
        return;
      }
      // Match the reserved word spacing at each breakpoint, so the same
      // scroll movement stays inside the narrower mobile text column.
      const scale =
        parseFloat(
          getComputedStyle(el).getPropertyValue("--about-word-scale"),
        ) || 1;
      words.forEach((span) => {
        const r = span.getBoundingClientRect(),
          p = Math.max(
            0,
            Math.min(
              1,
              (innerHeight * 0.8 - r.top) / (innerHeight * 0.2 + r.height),
            ),
          );
        const shift = span.classList.contains("word1")
          ? -0.8
          : span.classList.contains("word2")
            ? 1.6
            : span.classList.contains("word3")
              ? -2.4
              : 0;
        span.style.transform = `translateX(${shift * scale * p}em)`;
      });
    };
    const scroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    addEventListener("scroll", scroll, { passive: true });
    addEventListener("resize", scroll);
    reducedMotion.addEventListener("change", scroll);
    update();
    return () => {
      removeEventListener("scroll", scroll);
      removeEventListener("resize", scroll);
      reducedMotion.removeEventListener("change", scroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <section className="about" id="about">
      <div className="about-copy">
        <h2 className="eyebrow">Myself</h2>
        <div className="mobile-about-video">
          <Media name="about" />
        </div>
        <p ref={text} className="about-desktop-copy">
          {profile.about.split(" ").map((word, i) => (
            <Fragment key={i}>
              <span className={aboutWords[i % aboutWords.length].className}>
                {word}
              </span>{" "}
            </Fragment>
          ))}
        </p>
      </div>
      <div className="about-video">
        <div className="about-sticky-video">
          <Media name="about" />
        </div>
      </div>
    </section>
  );
}
function Services() {
  return (
    <section className="services">
      <div className="services-shell">
        <div className="services-intro reveal">
          <h2 className="eyebrow">Services</h2>
          <p>
            Evolving with every brief and built for impact, my process spans
            design, development, and brand strategy—aligning vision with
            execution to bring clarity and edge to every project.
          </p>
        </div>
        <div className="service-list">
          {services.map((s, i) => (
            <article className="service" key={s.title}>
              <span className="service-number">0{i + 1}</span>
              <h3 className="reveal">{s.title}</h3>
              <div className="service-description reveal">
                <p>{s.description}</p>
                <ul className="tags">
                  {s.keywords.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </div>
              <ParallaxImage
                className="reveal"
                src={`/images/services/${s.image}.png`}
                alt={s.title}
                amount={3}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
export function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <section className="selected-work">
        <h2 className="work-title reveal">
          <span>Work</span>
          <span>'25</span>
        </h2>
        <div className="work-grid">
          {projects.slice(0, 2).map((p) => (
            <ProjectCard project={p} key={p.slug} />
          ))}
        </div>
        <Link className="see-all" to="/work">
          See all
          <ArrowRight />
        </Link>
      </section>
      <Services />
      <TechStack />
      <SkillCards />
    </main>
  );
}
