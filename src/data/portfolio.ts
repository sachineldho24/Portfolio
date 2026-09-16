import projectData from "./projects.json";
import videoData from "./videos.json";

export const profile = {
  name: "Sachin Eldho",
  domain: "itssachin.indevs.in",
  location: "India Based",
  reach: "Working globally",
  company: "NxtWave",
  companyUrl: "https://www.ccbp.in",
  availability: "September 2026",
  email: "sachineldho999@gmail.com",
  contactEmail: "sachineldho999@gmail.com",
  roles: "AI Engineer, Next.js Enthusiast, Solo Builder, Freelancer,",
  about:
    "Computer engineer with an AI edge, I build intelligent products end to end: multi-agent systems, RAG pipelines, and vision-powered apps, wrapped in motion-rich interfaces. I sweat the details and ship software people love to use.",
};
export const videos: Record<string, string> = videoData;
export const projects = projectData.map((p) => ({ ...p }));
export type Project = (typeof projects)[number];
export const services = [
  {
    title: "Brand Strategy",
    description:
      "Helping others uncover their brand's purpose and uniqueness – and the game plan to deliver it to win their customers’ devotion.",
    keywords: [
      "Research & Insights",
      "Brand Strategy",
      "Competitive Study",
      "Voice & Tone",
      "Naming & Copywriting",
      "Workshops",
    ],
    image: "brand-strategy",
  },
  {
    title: "Digital Design",
    description:
      "Designing engaging digital experiences that combine brand strategy and creativity with UX insights to deliver functionality and ease of use.",
    keywords: [
      "Identity Design",
      "Wireframing",
      "UI",
      "UX",
      "Web Design",
      "Product Design",
    ],
    image: "digital-design",
  },
  {
    title: "Development",
    description:
      "Building digital products that combine design, technology, and business strategy to deliver seamless user experiences.",
    keywords: [
      "Frontend Development",
      "SEO",
      "Motion",
      "Animation",
      "WebGL",
      "CMS Development",
      "Databases",
    ],
    image: "development",
  },
];
export const technologies = [
  ["HTML5", "typescript-logo.svg", "https://html.spec.whatwg.org", 60],
  ["CSS3", "tailwindcss-logo.svg", "https://www.w3.org/Style/CSS", 60],
  ["JavaScript", "react-logo.svg", "https://developer.mozilla.org/en-US/docs/Web/JavaScript", 60],
  ["Next.js", "nextjs-logotype-light-background.svg", "https://nextjs.org", 120],
  ["Python", "gsap-black.svg", "https://www.python.org", 60],
  ["SQL", "supabase-logo.svg", "https://www.mysql.com", 60],
  ["FastAPI", "motion.svg", "https://fastapi.tiangolo.com", 60],
  ["LangChain", "contentful-logo.svg", "https://www.langchain.com", 60],
  ["GitHub", "vercel-logotype-light.svg", "https://github.com", 60],
  ["Supabase", "supabase-logo.svg", "https://supabase.com", 70],
  ["Git", "gsap-black.svg", "https://git-scm.com", 60],
  ["VS Code", "react-logo.svg", "https://code.visualstudio.com", 70],
  ["Cursor", "motion.svg", "https://cursor.com", 60],
  ["Claude Code", "contentful-logo.svg", "https://claude.ai", 70],
  ["PostgreSQL", "supabase-logo.svg", "https://www.postgresql.org", 70],
  ["MongoDB", "vercel-logotype-light.svg", "https://www.mongodb.com", 70],
  ["Qdrant", "figma-logo.svg", "https://qdrant.tech", 60],
  ["Chroma", "tailwindcss-logo.svg", "https://www.trychroma.com", 60],
  ["CrewAI", "motion.svg", "https://www.crewai.com", 60],
  ["MCP", "typescript-logo.svg", "https://modelcontextprotocol.io", 60],
  ["RAG", "gsap-black.svg", "https://www.langchain.com", 60],
  ["Problem Solving", "figma-logo.svg", "#", 70],
  ["Communication", "contentful-logo.svg", "#", 70],
] as const;
