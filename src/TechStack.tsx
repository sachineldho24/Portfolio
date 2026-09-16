import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./TechStack.css";

gsap.registerPlugin(ScrollTrigger);

/**
 * The MODERN / TECH STACK headline.
 *
 * Every glyph is doubled: the in-flow span holds the letter you see at rest,
 * and an absolutely positioned twin waits exactly one line above it. The line
 * box clips to a single line of height, so translating the pair down by 100%
 * rolls the resting glyph out of frame and drops its twin into the slot.
 */
const lines = [
  { id: "modern", letters: [..."MODERN"], gapAfter: -1 },
  { id: "stack", letters: [..."TECHSTACK"], gapAfter: 3 },
];

export function TechStack() {
  const list = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const ul = list.current;
    if (!ul) return;

    // This scroll tween is scoped to the no-preference query rather than run
    // unconditionally, so reduced motion is honoured and the tween is reverted
    // whenever the query stops matching. The config itself is untouched.
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // Kept as GSAP rather than reimplemented by hand: the scrub smoothing,
      // the power1.inOut ease and the random stagger are all load-bearing parts
      // of how the roll reads, and each is a GSAP-specific behaviour.
      gsap.to(ul.querySelectorAll(".letter"), {
        yPercent: 100,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: ul,
          // Begins as the list's 40% mark reaches 95% down the viewport, and
          // finishes once its foot has climbed to the viewport's 80% mark.
          start: "40% 95%",
          end: "100% 80%",
          // A second of catch-up, which is what gives the letters their drag.
          scrub: 1,
        },
        // Seconds, not a share of the scroll: GSAP stretches the resulting
        // 1.2s timeline across the trigger range and shuffles the order afresh
        // on every load.
        stagger: { each: 0.05, from: "random" },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section className="tech-stack" aria-labelledby="tech-stack-heading">
      <h2 className="visually-hidden" id="tech-stack-heading">
        Modern tech stack
      </h2>
      <ul className="letter-scroll" ref={list} aria-hidden="true">
        {lines.map(({ id, letters, gapAfter }) => (
          <li className="tech-line" key={id}>
            {letters.map((letter, index) => (
              <span
                className={`letter${index === gapAfter ? " letter-word-gap" : ""}`}
                key={index}
              >
                <span>{letter}</span>
                <span className="letter-copy">{letter}</span>
              </span>
            ))}
          </li>
        ))}
      </ul>
    </section>
  );
}
