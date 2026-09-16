import { useRef } from "react";
import { useParallax } from "./motion";
export function ParallaxImage({
  src,
  alt,
  className = "",
  amount = 10,
}: {
  src: string;
  alt: string;
  className?: string;
  amount?: number;
}) {
  const root = useRef<HTMLDivElement>(null),
    layer = useRef<HTMLDivElement>(null);
  useParallax(root, layer, amount);
  return (
    <div className={`parallax-image ${className}`} ref={root}>
      <div ref={layer} className="parallax-layer">
        <img src={src} alt={alt} loading="lazy" />
      </div>
    </div>
  );
}
