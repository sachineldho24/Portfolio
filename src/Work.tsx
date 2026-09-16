import { CalorieShowcase } from "./CalorieShowcase";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "./Navigation";
import { ArrowUpRight } from "lucide-react";
import { projects, Project, videos } from "./data/portfolio";
import { Media } from "./Media";
import { Marquee } from "./Shell";
import galleries from "./data/galleries.json";
import { ParallaxImage } from "./ParallaxImage";

export function ProjectCard({ project: p }: { project: Project }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      className="work-card"
      to={`/work/${p.slug}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <div className="work-cover">
        <ParallaxImage
          src={p.previewImageUrl || p.backgroundImageUrl}
          alt={p.title}
          className="work-photo"
        />
        <div className="work-blur" aria-hidden="true" />
        <span className="work-preview-label">View project</span>
        {hover && videos[p.video] && (
          <Media
            name={p.video}
            poster={p.previewImageUrl || p.backgroundImageUrl}
            className="work-preview"
          />
        )}
      </div>
      <div className="work-meta">
        <img src={p.icon} alt="" loading="lazy" />
        <h3>{p.title}</h3>
        <span>{p.category}</span>
        <span>{p.year}</span>
      </div>
      <Marquee text={`${p.keywords.join(", ")},`} />
    </Link>
  );
}
export function Work() {
  return (
    <main id="main" className="work-page">
      <div className="work-heading">
        <p>[2022-2025]</p>
        <h1>Selected Work</h1>
      </div>
      <div className="all-work">
        <div className="work-grid">
          {projects.map((p) => (
            <ProjectCard project={p} key={p.slug} />
          ))}
        </div>
      </div>
    </main>
  );
}
/**
 * Projects whose gallery carries a full product film.
 *
 * A film gets more than a still does: a poster, a caption track, a 1440p
 * download, a source link, and chromeless playback while it is on screen. Kept
 * as data so adding the next film is an entry here rather than another slug
 * check threaded through the markup.
 */
const FILMS: Record<
  string,
  {
    poster: string;
    captions: string;
    download: string;
    /** Replaces the default "Visit site" label on the primary link. */
    primaryLabel?: string;
    /** Capture notes, rendered under the summary. */
    note?: string;
    source?: { href: string; label: string };
  }
> = {
  "rag-ai": {
    poster: "/images/posters/ragnition.jpg",
    captions: "/videos/ragnition/captions-en.vtt",
    download: "/videos/ragnition/showcase-1440p.mp4",
    primaryLabel: "Backend source",
    note: "Captured from the actual frontend with small local fixes. Conversations use labeled sample data; the public backend was unavailable during capture.",
    source: {
      href: "https://github.com/Ragnition-AI/rag-ai-frontend",
      label: "Frontend source",
    },
  },
  "career-builder": {
    poster: "/images/posters/career-builder.jpg",
    captions: "/videos/career-builder/captions-en.vtt",
    download: "/videos/career-builder/showcase-1440p.mp4",
    note: "Captured from the deployed app, signed in. The evaluation is a real A–G run against NVIDIA Nemotron 3 Ultra 550B via OpenRouter — a live stream of just over four minutes, time-compressed for the cut. Nothing is re-enacted.",
    source: {
      href: "https://github.com/sachineldho24/Career-Builder",
      label: "Source",
    },
  },
};

export function ProjectDetail() {
  const { slug } = useParams();
  const film = slug ? FILMS[slug] : undefined;
  const filmRef = useRef<HTMLVideoElement>(null);
  const [filmVisible, setFilmVisible] = useState(false);
  useEffect(() => {
    setFilmVisible(false);
    const el = filmRef.current;
    if (!film || !el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFilmVisible(entry.intersectionRatio >= 0.35),
      { threshold: [0, 0.35] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [slug, film]);
  const p = projects.find((p) => p.slug === slug);
  if (!p) return <NotFound />;
  if (p.slug === "calorie-tracker") return <CalorieShowcase />;
  const gallery = galleries[p.slug as keyof typeof galleries];
  return (
    <main
      id="main"
      className="project-page"
      data-film-visible={film && filmVisible ? "true" : undefined}
    >
      <article className="project-shell">
        <h1>{p.title}</h1>
        {(p.summary.length > 0 || gallery.length > 0) && (
          <div className="project-body">
            <div className="project-info">
              <div>
                <h2>Year</h2>
                <p className="project-year">{p.year}</p>
              </div>
              <div>
                <h2>Services</h2>
                <ul className="tags">
                  {p.keywords.map((k) => (
                    <li key={k}>{k}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2>Summary</h2>
                <p>{p.summary.join("")}</p>
                {p.url && (
                  <a
                    className="visit-site"
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {film?.primaryLabel ?? "Visit site"}
                    <ArrowUpRight size={16} />
                  </a>
                )}
                {film?.note && <p>{film.note}</p>}
                {film?.source && (
                  <a
                    className="visit-site"
                    href={film.source.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {film.source.label} <ArrowUpRight size={16} />
                  </a>
                )}
                {film && (
                  <a className="visit-site" href={film.download} download>
                    Download film · 1440p <ArrowUpRight size={16} />
                  </a>
                )}
              </div>
            </div>
            <div className="project-gallery">
              {gallery.map((m, i) => (
                <div
                  key={i}
                  className={`project-image reveal ${m.half ? "project-half" : ""} ${m.url.endsWith(".mp4") ? "project-video" : ""}`}
                >
                  {m.url.endsWith(".mp4") ? (
                    <video
                      ref={film ? filmRef : undefined}
                      src={m.url}
                      poster={
                        film?.poster ??
                        (p.previewImageUrl || p.backgroundImageUrl)
                      }
                      controls
                      playsInline
                      preload="metadata"
                      aria-label={`${p.title} product showcase`}
                    >
                      {film && (
                        <track
                          kind="captions"
                          src={film.captions}
                          srcLang="en"
                          label="English"
                        />
                      )}
                    </video>
                  ) : m.url.endsWith(".m3u8") ? (
                    <Media src={m.url} />
                  ) : (
                    <img
                      src={m.url}
                      alt={`${p.title} — project view ${i + 1}`}
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </main>
  );
}
export function NotFound() {
  return (
    <main id="main" className="not-found">
      <p>404</p>
      <h1>Page not found</h1>
      <Link to="/">
        Back home <ArrowUpRight />
      </Link>
    </main>
  );
}
