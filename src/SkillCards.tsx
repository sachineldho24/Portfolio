import { useEffect, useRef } from "react";
import { Braces, Sparkles } from "lucide-react";
import "./SkillCards.css";

const cards = [
  ["UI / UX", ["Figma", "Canva", "Loveable", "Stitch"]],
  [
    "Frontend",
    ["HTML5", "CSS3", "JavaScript", "React", "Next.js", "TypeScript"],
  ],
  ["Backend / API", ["Python", "FastAPI", "Node.js", "REST API", "GraphQL"]],
  [
    "AI / ML Frameworks",
    ["LangChain", "CrewAI", "MCP", "RAG", "Prompt Engineering"],
  ],
  [
    "Tools",
    ["Git", "GitHub", "VS Code", "Cursor", "Antigravity", "Claude Code", "Codex"],
  ],
  [
    "Databases",
    ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Qdrant", "Chroma"],
  ],
] as const;

type SkillName = (typeof cards)[number][1][number];

const skillLinks: Record<SkillName, string> = {
  Figma: "https://www.figma.com/",
  Canva: "https://www.canva.com/",
  Loveable: "https://lovable.dev/",
  Stitch: "https://stitch.withgoogle.com/",
  HTML5: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  CSS3: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  JavaScript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  React: "https://react.dev/",
  "Next.js": "https://nextjs.org/",
  TypeScript: "https://www.typescriptlang.org/",
  Python: "https://www.python.org/",
  FastAPI: "https://fastapi.tiangolo.com/",
  "Node.js": "https://nodejs.org/",
  "REST API":
    "https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm",
  GraphQL: "https://graphql.org/",
  LangChain: "https://www.langchain.com/",
  CrewAI: "https://crewai.com/",
  MCP: "https://modelcontextprotocol.io/",
  RAG: "https://docs.langchain.com/oss/python/langchain/retrieval",
  "Prompt Engineering":
    "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview",
  Git: "https://git-scm.com/",
  GitHub: "https://github.com/",
  "VS Code": "https://code.visualstudio.com/",
  Cursor: "https://cursor.com/",
  "Claude Code": "https://claude.com/product/claude-code",
  Codex: "https://openai.com/codex/",
  Antigravity: "https://antigravity.google/",
  PostgreSQL: "https://www.postgresql.org/",
  MySQL: "https://www.mysql.com/",
  MongoDB: "https://www.mongodb.com/",
  Supabase: "https://supabase.com/",
  Qdrant: "https://qdrant.tech/",
  Chroma: "https://www.trychroma.com/",
};

const logos: Record<string, string> = {
  Figma: "figma.svg",
  Canva: "canva.svg",
  Loveable: "lovable.svg",
  Stitch: "stitch.png",
  HTML5: "devicon--html5.svg",
  CSS3: "devicon--css3.svg",
  JavaScript: "devicon--javascript.svg",
  React: "/images/svg/react-logo.svg",
  "Next.js": "devicon--nextjs.svg",
  TypeScript: "/images/svg/typescript-logo.svg",
  Python: "devicon--python.svg",
  FastAPI: "devicon--fastapi.svg",
  "Node.js": "nodejs.svg",
  GraphQL: "graphql.svg",
  LangChain: "Langchain_Icon.svg",
  CrewAI: "simple-icons--crewai.svg",
  MCP: "gravity-ui--logo-mcp.svg",
  RAG: "RAG_icon.svg",
  Git: "devicon--git.svg",
  GitHub: "skill-icons--github-dark.svg",
  "VS Code": "devicon--vscode.svg",
  Cursor: "devicon--cursor.svg",
  "Claude Code": "material-icon-theme--claude.svg",
  Codex: "codex.webp",
  Antigravity: "Google_Antigravity-logo_brandlogos.net_e23c83.svg",
  PostgreSQL: "devicon--postgresql.svg",
  MySQL: "logos--mysql.svg",
  MongoDB: "devicon--mongodb.svg",
  Supabase: "devicon--supabase.svg",
  Qdrant: "logos--qdrant-icon.svg",
  Chroma: "logos--chroma.svg",
};

function SkillLogo({ name }: { name: string }) {
  const source = logos[name];
  if (source) {
    return (
      <img
        className={`skill-workflow-logo${["React", "Next.js", "TypeScript", "CrewAI", "MCP", "Cursor"].includes(name) ? " skill-workflow-logo-inverted" : ""}${["LangChain", "RAG"].includes(name) ? " skill-workflow-logo-white" : ""}`}
        src={source.startsWith("/") ? source : `/skills-assets/${source}`}
        alt=""
        width={28}
        height={28}
      />
    );
  }
  const Icon = name === "REST API" ? Braces : Sparkles;
  return <Icon className="skill-workflow-logo" size={28} aria-hidden="true" />;
}

/** Deck -> fan -> sequential grid, adapted from terminal-portfolio's getCardStyle. */
function cardPosition(index: number, progress: number) {
  const angle = (index - 2.5) * 12;
  const radians = (angle * Math.PI) / 180;
  if (progress <= 0.25) {
    const fan = progress / 0.25;
    const radius = 10 + fan * 110;
    return {
      x: radius * Math.sin(radians),
      y: -radius * Math.cos(radians) + fan * 90 + 32 * (1 - fan),
      z: index * -5 * (1 - fan),
      angle: angle * fan,
    };
  }
  const start = 0.25 + index * 0.07;
  let flight = Math.max(0, Math.min(1, (progress - start) / 0.22));
  flight = flight * flight * (3 - 2 * flight);
  const fanX = 120 * Math.sin(radians);
  const fanY = -120 * Math.cos(radians) + 90;
  return {
    x: fanX + flight * (((index % 3) - 1) * 480 - fanX),
    y: fanY + flight * (Math.floor(index / 3) * 250 - 125 - fanY),
    z: flight * 2,
    angle: angle * (1 - flight),
  };
}

export function SkillCards() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const section = root.current!;
    const surface = stage.current!;
    const animated = matchMedia(
      "(min-width: 1100px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!animated.matches) {
        cardRefs.current.forEach((card) =>
          card?.style.removeProperty("transform"),
        );
        section.removeAttribute("data-progress");
        section.style.removeProperty("--skills-progress");
        return;
      }
      const range = section.offsetHeight - innerHeight;
      const progress = Math.max(
        0,
        Math.min(1, -section.getBoundingClientRect().top / Math.max(1, range)),
      );
      const scale = Math.min(
        1,
        surface.clientWidth / 1420,
        surface.clientHeight / 480,
      );
      surface.style.setProperty("--cards-scale", String(scale));
      section.dataset.progress = progress.toFixed(4);
      section.style.setProperty("--skills-progress", String(progress));
      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const p = cardPosition(index, progress);
        card.style.transform = `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateZ(${p.angle}deg)`;
        card.style.zIndex = String(
          progress > 0.25 + index * 0.07 ? 20 + index : 10 - index,
        );
      });
    };
    // Reveal covered cards when a keyboard user tabs into the deck.
    const revealFocusedCard = (event: FocusEvent) => {
      if (
        !animated.matches ||
        !(event.target instanceof HTMLAnchorElement) ||
        !event.target.matches(":focus-visible")
      )
        return;
      if (Number(section.dataset.progress) < 0.85) {
        scrollTo({
          top:
            section.getBoundingClientRect().top +
            scrollY +
            (section.offsetHeight - innerHeight) * 0.85,
          behavior: "instant",
        });
        update();
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const resize = new ResizeObserver(schedule);
    resize.observe(surface);
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    animated.addEventListener("change", schedule);
    section.addEventListener("focusin", revealFocusedCard);
    update();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      animated.removeEventListener("change", schedule);
      section.removeEventListener("focusin", revealFocusedCard);
    };
  }, []);

  return (
    <section
      className="skill-workflow"
      id="skills"
      ref={root}
      aria-label="Skills"
    >
      <div className="skill-workflow-pin">
        <div className="skill-workflow-stage" ref={stage}>
          <div className="skill-workflow-canvas">
            {cards.map(([label, skills], index) => (
              <article
                className="skill-workflow-row"
                key={label}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                style={{ zIndex: 10 - index }}
              >
                <h3 className="skill-workflow-label">{label}</h3>
                <ul className="skill-workflow-cells" data-count={skills.length}>
                  {skills.map((name) => (
                    <li className="skill-workflow-cell" key={name}>
                      <a
                        className="skill-workflow-link"
                        href={skillLinks[name]}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name} (opens in a new tab)`}
                      >
                        <SkillLogo name={name} />
                        <span>{name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
