import { RefObject, useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}

export function useParallax(
  container: RefObject<HTMLElement>,
  layer: RefObject<HTMLElement>,
  amount = 10,
) {
  useEffect(() => {
    const root = container.current,
      el = layer.current;
    if (!root || !el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        el.style.translate = "none";
        return;
      }
      const rect = root.getBoundingClientRect();
      const p = Math.max(
        0,
        Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height)),
      );
      el.style.translate = `0 ${((p * 2 - 1) * innerHeight * amount) / 100}px`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    update();
    return () => {
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [container, layer, amount]);
}
