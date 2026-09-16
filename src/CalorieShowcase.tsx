import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Play,
  RotateCcw,
} from "lucide-react";
import { Link } from "./Navigation";
import { calsnap } from "./data/calsnap";
import "./CalorieShowcase.css";

export function CalorieShowcase() {
  const player = useRef<HTMLVideoElement>(null);
  const [portrait, setPortrait] = useState(
    () => matchMedia("(max-width: 640px)").matches,
  );
  const [playing, setPlaying] = useState(false);
  const [filmVisible, setFilmVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(-1);
  const [message, setMessage] = useState("");
  const resume = useRef({ time: 0, playing: false });

  useEffect(() => {
    const query = matchMedia("(max-width: 640px)");
    const change = () => {
      resume.current = {
        time: player.current?.currentTime || 0,
        playing: !player.current?.paused,
      };
      setPortrait(query.matches);
    };
    query.addEventListener("change", change);
    const pause = () => {
      if (document.hidden) player.current?.pause();
    };
    document.addEventListener("visibilitychange", pause);
    const visibility = new IntersectionObserver(
      ([entry]) => setFilmVisible(entry.isIntersecting),
      { threshold: 0.12 },
    );
    if (player.current) visibility.observe(player.current);
    return () => {
      query.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", pause);
      visibility.disconnect();
    };
  }, []);

  async function play(time = 0) {
    const video = player.current;
    if (!video) return;
    setMessage("");
    if (failed) {
      setFailed(false);
      video.load();
    }
    video.currentTime = time + 0.45;
    video.scrollIntoView({
      block: "center",
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    try {
      await video.play();
    } catch {
      setMessage("Use the video’s play control to start.");
    }
  }

  return (
    <main
      id="main"
      className="calorie-showcase"
      data-playing={playing}
      data-film-visible={filmVisible}
    >
      <header className="calorie-heading">
        <Link to="/work" className="calorie-back">
          <ArrowLeft size={16} /> Work
        </Link>
        <div className="calorie-title-row">
          <div>
            <h1>
              {calsnap.title}
              <span>.</span>
            </h1>
            <p>{calsnap.subtitle}</p>
          </div>
          <button className="calorie-play" onClick={() => void play()}>
            <Play size={16} /> Play film
          </button>
        </div>
      </header>
      <section className="calorie-film" aria-label="CalSnap product showcase">
        <div className={`calorie-player ${portrait ? "is-portrait" : ""}`}>
          <video
            ref={player}
            src={portrait ? calsnap.portrait : calsnap.film}
            poster={portrait ? calsnap.portraitPoster : calsnap.poster}
            controls
            playsInline
            preload="auto"
            aria-label="CalSnap onboarding, meal scan and nutrition results on Samsung Galaxy S24 Ultra"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => {
              setFailed(true);
              setPlaying(false);
            }}
            onLoadedData={() => setFailed(false)}
            onLoadedMetadata={() => {
              const video = player.current;
              if (!video) return;
              if (resume.current.time > 0)
                video.currentTime = resume.current.time;
              if (resume.current.playing) void video.play().catch(() => {});
              resume.current = { time: 0, playing: false };
            }}
            onTimeUpdate={() => {
              const time = player.current?.currentTime ?? 0;
              setActive(
                time >= 57
                  ? -1
                  : calsnap.chapters.reduce(
                      (found, chapter, index) =>
                        time >= chapter.time ? index : found,
                      -1,
                    ),
              );
            }}
          >
            <track
              kind="captions"
              src={calsnap.captions}
              srcLang="en"
              label="English — visual description"
            />
            <a href={calsnap.film}>Download the film</a>
          </video>
          {failed && (
            <div className="calorie-error" role="alert">
              <p>The film couldn’t load.</p>
              <button onClick={() => void play()}>
                <RotateCcw size={16} /> Try again
              </button>
              <a href={portrait ? calsnap.portrait : calsnap.film}>
                Open video directly
              </a>
            </div>
          )}
        </div>
        <div className="calorie-film-meta">
          <span>Samsung Galaxy S24 Ultra</span>
          <span>01:00 · 60 fps</span>
        </div>
        {message && (
          <p className="calorie-status" role="status">
            {message}
          </p>
        )}
        <nav className="calorie-chapters" aria-label="Film chapters">
          {calsnap.chapters.map((chapter, i) => (
            <button
              key={chapter.title}
              onClick={() => void play(chapter.time)}
              aria-current={active === i ? "true" : undefined}
              aria-label={`Play ${chapter.title} chapter`}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              {chapter.title}
              <Play size={12} />
            </button>
          ))}
        </nav>
        <div className="calorie-links">
          <span>Interface concept · Sample nutrition estimates</span>
          <div>
            <a href={portrait ? calsnap.portrait : calsnap.master} download>
              <Download size={15} /> Download film
            </a>
            <a href={calsnap.source} target="_blank" rel="noreferrer">
              Source <ArrowUpRight size={15} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
