# Portfolio

Personal portfolio site for **Sachin Eldho**, AI engineer — selected work, product films, and the stack behind them.

React 18 and TypeScript on Vite, shipped as a static site.

## Getting started

```sh
npm install
npm run dev        # local dev server
npm run build      # type-check, then build to dist/
npm run preview    # serve the production build
npm run typecheck
```

## Routes

| Route         | Page                                                             |
| ------------- | ---------------------------------------------------------------- |
| `/`           | Home — showreel, about, services, technology stack, contact       |
| `/work`       | Selected work index, with hover previews per project              |
| `/work/:slug` | Project detail: gallery, film, captions, technology highlights    |
| anything else | Not found                                                         |

## Customizing

| File                                            | Content                                                                              |
| ----------------------------------------------- | ------------------------------------------------------------------------------------ |
| `src/data/portfolio.ts`                         | Name, location, company, availability, email, About text, services, and technologies   |
| `src/data/projects.json`                        | Project names, slugs, descriptions, categories, dates, links, and media               |
| `src/data/galleries.json`                       | Display order and full-width/half-width project image layouts                          |
| `src/data/videos.json`                          | Video identifiers; local streams live under `public/videos/<name>/`                    |
| `src/data/calsnap.ts`                           | Media, captions, and copy for the product film on the CalSnap project page             |
| `src/SkillCards.tsx`                            | Skill cards; their icons live in `public/skills-assets/`                               |
| `src/styles.css`                                | Design tokens, responsive layout, and animation styles                                 |
| `src/Shell.tsx`, `src/App.tsx`, `index.html`    | Social links, document titles, and page metadata                                       |

## Media

Every image, font, and video is served locally from `public/` — no third-party player or CDN. Streams are HLS: they play through native browser support where it exists, and `hls.js` is imported on demand where it does not. Video is muted and looping, loads only once scrolled into view, pauses when it leaves the viewport, and stays paused entirely under `prefers-reduced-motion`. Project films carry a poster, a caption track, and a 1440p download.

There is no analytics and no form submission. Contact links open the visitor's mail client.

## Deployment

`dist/` is a static site. `vercel.json` and `public/_redirects` carry the SPA fallback for Vercel and Netlify respectively; on any other host, serve `index.html` for application routes and asset paths normally.

## Credits

Identity, copy, projects, and media are Sachin's own.

Third-party assets remain their owners' property: the Saans, Saans Mono, and LCD Dot typefaces, and the technology logos under `public/images/svg/` and `public/skills-assets/`.
