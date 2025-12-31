# Portfolio

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## What this app does

This is my personal website to showcase my frontend engineering skills.
It includes a portfolio (projects/case studies) and a blog where I write about technical topics and learnings.
Everything is designed to be minimal, fast, and easy to maintain.

## Tech stack

- **Next.js** (App Router)
- **TypeScript**
- **Content**: local MDX (minimal, no CMS for now)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Milestones (small + testable)

### Milestone 1: Basic site shell

- Home page: name, short intro, links (GitHub / X / email)
- Navigation: Home / Projects / Blog
- Each page renders with placeholder sections
- **Test**: run dev server → click nav → no errors.

### Milestone 2: Projects listing (data-first)

- Store projects in a single `projects.ts` file as an array
- Render a clean list (title, tags, 1–2 lines description, links)
- **Test**: edit array → list updates immediately.

### Milestone 3: Blog listing from local files

- Add a minimal blog content folder
- Blog index renders a list of posts (title, date, summary)
- Each post has its own page
- **Test**: add one post file → it appears in list + opens correctly.

### Milestone 4: Basic styling + components

- Add layout + typography + spacing (mobile-friendly)
- Create 2–3 tiny components only if needed (e.g., Container, Nav, Card) . dependencies shadcn
- **Test**: looks good on mobile/desktop, no layout breaks.

### Milestone 5: SEO + deploy-ready

- Metadata: title/description, Open Graph basics
- Sitemap/robots only if trivial
- Build passes
- **Test**: `next build` succeeds, Lighthouse basic check OK.

### Milestone 6: 

## Vibe anchor

Simplify this. What's the absolute minimum?
No CMS, no database, no auth, no dashboards. Just content + presentation.
