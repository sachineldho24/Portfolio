import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { videos } from "./data/portfolio";

export function Media({
  name,
  src,
  poster,
  controls = false,
  className = "",
  active = true,
}: {
  name?: string;
  src?: string;
  poster?: string;
  controls?: boolean;
  className?: string;
  active?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [retry, setRetry] = useState(0);
  const playbackId = name ? videos[name] : undefined;
  const source = src || (playbackId ? `/videos/${name}/index.m3u8` : undefined);
  const cover =
    poster || (playbackId ? `/images/posters/${name}.jpg` : undefined);
  const toggleSound = () => {
    setMuted((value) => !value);
    ref.current?.play().catch(() => {});
  };
  useEffect(() => {
    const video = ref.current;
    if (!video || !source) return;
    let disposed = false;
    let hls: import("hls.js").default | undefined;
    let loaded = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const play = () => {
      if (active && visible && !reduce.matches && !document.hidden)
        video.play().catch(() => {});
      else video.pause();
    };
    reduce.addEventListener("change", play);
    document.addEventListener("visibilitychange", play);
    async function load() {
      if (loaded) return;
      loaded = true;
      setFailed(false);
      if (
        source!.endsWith(".m3u8") &&
        !video!.canPlayType("application/vnd.apple.mpegurl")
      ) {
        const { default: Hls } = await import("hls.js");
        if (disposed) return;
        if (!Hls.isSupported()) {
          setFailed(true);
          return;
        }
        hls = new Hls({ maxBufferLength: 20, startLevel: 0 });
        hls.loadSource(source!);
        hls.attachMedia(video!);
        hls.on(Hls.Events.MANIFEST_PARSED, play);
        hls.on(Hls.Events.ERROR, (_, data) => {
          if (data.fatal) setFailed(true);
        });
      } else {
        video!.src = source!;
        play();
      }
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (entry.isIntersecting) {
          void load();
          play();
        } else video.pause();
      },
      { rootMargin: "150px" },
    );
    observer.observe(video);
    return () => {
      disposed = true;
      reduce.removeEventListener("change", play);
      document.removeEventListener("visibilitychange", play);
      observer.disconnect();
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [source, active, retry]);
  return (
    <div className={`media ${className}`}>
      <video
        ref={ref}
        poster={cover}
        muted={muted}
        loop
        playsInline
        preload="none"
        onLoadedData={() => setReady(true)}
        onClick={controls ? toggleSound : undefined}
        onError={() => setFailed(true)}
        aria-label={
          name
            ? `${name.replace(/([A-Z])/g, " $1")} video`
            : "Portfolio animation"
        }
      />
      {controls && (
        <button
          className="sound-button"
          aria-label={muted ? "Unmute video" : "Mute video"}
          onClick={toggleSound}
        >
          {muted ? <VolumeX /> : <Volume2 />}
        </button>
      )}
      {failed && controls && (
        <button
          className="media-retry"
          onClick={() => {
            setRetry((x) => x + 1);
          }}
        >
          <Play size={15} /> Retry video
        </button>
      )}
      {!ready && !cover && failed && (
        <span className="media-unavailable">Video unavailable</span>
      )}
    </div>
  );
}
