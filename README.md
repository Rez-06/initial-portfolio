# Rezwan Ahmed — Portfolio

A personal portfolio built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS v4** and **Lucide**. Statically generated, no database, no required environment variables, deployable to Vercel as-is.

The site is **data-driven**: projects, skills, education, experience, socials and navigation all live in JSON files under `data/`. To grow the portfolio you edit JSON, not components.

## Quick start (Bun)

```bash
bun install          # install dependencies
bun run dev          # http://localhost:3000
bun run check:data   # validate your JSON (bad URLs, unknown icons, missing images…)
bun run typecheck    # TypeScript check
bun run build        # production build
bun run start        # serve the production build
```

## Project structure

```
app/                      Routes, layout, metadata, sitemap, robots, 404
  projects/[slug]/        ONE template that renders every project from projects.json
components/               Reusable, typed components (no per-project/per-skill components)
data/                     ← the files you edit
  profile.json  projects.json  skills.json  education.json
  experience.json  socials.json  navigation.json
lib/                      Types, JSON normalizers/validators, asset checks
public/images/            ← ALL images live here (and only here)
scripts/                  check-data.ts, make-placeholder-art.py
```

How the safety net works: every JSON file passes through a small normalizer in `lib/data.ts`. Entries without a required field (`title`, `name`…) are skipped with a warning in the terminal; unknown statuses are ignored; non-http(s) URLs are dropped (so no dead buttons); missing images show a neutral fallback tile; unknown icon names show a generic icon. Empty sections never render a heading.

---

## Maintenance recipes

### 1. Add a new project

Copy an object in `data/projects.json`, paste it at the end of the array, and edit. **Only `title` is required**; everything else is optional.

```json
{
  "slug": "weather-dashboard",
  "title": "Weather Dashboard",
  "subtitle": "A small dashboard for city forecasts.",
  "description": "One or two sentences for the project card.",
  "status": "completed",
  "featured": false,
  "sortOrder": 10,
  "coverImage": "/images/weather-dashboard-cover.webp",
  "coverAlt": "Weather Dashboard home screen showing a seven-day forecast",
  "gallery": [
    { "src": "/images/weather-dashboard-forecast.webp", "alt": "Seven-day forecast view", "caption": "Optional caption" },
    "/images/weather-dashboard-settings.webp"
  ],
  "technologies": ["React", "TypeScript", "OpenWeather API"],
  "categories": ["Web application"],
  "facts": [{ "label": "Type", "value": "Personal project" }],
  "overview": ["First paragraph.", "Second paragraph."],
  "problem": ["What problem it addresses."],
  "goals": ["Goal one", "Goal two"],
  "features": ["Feature one", "Feature two"],
  "featureGroups": [{ "title": "Accounts", "items": ["Sign in", "Saved cities"] }],
  "architecture": {
    "summary": "One-paragraph description.",
    "layers": [
      { "title": "Interface", "description": "Optional.", "items": ["React", "Tailwind CSS"] },
      { "title": "Data", "items": ["OpenWeather API"] }
    ],
    "notes": ["Optional extra bullet."]
  },
  "challengesNote": "Optional line shown above the challenges list.",
  "challenges": ["A real challenge you faced"],
  "lessonsLearned": ["Something you learned"],
  "futureImprovements": ["Idea for later"],
  "liveUrl": "https://weather-dashboard.example.com",
  "liveNote": "Optional text shown when there is no live demo.",
  "repositoryUrl": "https://github.com/Rez-06/weather-dashboard",
  "runLocally": "Optional instructions for projects without a hosted demo.",
  "startDate": "2026-03",
  "endDate": "2026-05"
}
```

- **`status`**: `in-development`, `completed`, `academic`, `prototype` or `archived`. Omit it to hide the badge.
- **`featured: true`** projects appear first, as large rows; the rest appear in a two-column grid below. `sortOrder` (lower = earlier) orders projects within each group.
- **Generated page:** the `slug` becomes the URL. `"slug": "weather-dashboard"` → `/projects/weather-dashboard` (locally: `http://localhost:3000/projects/weather-dashboard`). The slug is lower-cased and cleaned automatically; if you omit it, it's generated from the title. Slugs must be unique.
- Any field you leave out simply hides its section.
- Use `features` for a flat list, `featureGroups` for a grouped one, or both.
- Dates accept `"2026"` or `"2026-03"`.

### 2. Add a new skill

Append to `data/skills.json`. A **new category appears automatically**; just type a new `category` string. Categories are listed in the order they first appear in the file.

```json
{
  "name": "Docker",
  "category": "Tools",
  "icon": "container",
  "status": "learning",
  "description": "Optional one-liner",
  "featured": false,
  "sortOrder": 5
}
```

- `status`: `comfortable`, `learning` or `exploring` (omit for no label). There are deliberately no percentage scores.
- `icon`: any [Lucide](https://lucide.dev/icons) icon name in kebab-case (`"git-branch"`, `"database"`). Unknown names fall back to a dot. `bun run check:data` tells you if a name is wrong.
- `sortOrder` is optional; lower numbers come first within a category.

### 3. Add a project image

1. Put the file in `public/images/` using a descriptive name, e.g. `weather-dashboard-cover.webp`. WebP at about 1600×1000 (16:10) works best.
2. Reference it from JSON as `/images/weather-dashboard-cover.webp` (leading slash, no `public/`).
3. Use `coverImage` for the card/hero image and `gallery` for extra screenshots. Write meaningful `alt` text.

Missing cover → neutral fallback tile. Missing gallery file → skipped (warning in the terminal).

**About the current covers:** `bazardor-cover.webp`, `gatekeeper-cover.webp` and `xor-cafe-cover.webp` are **illustrations I generated (`scripts/make-placeholder-art.py`), not screenshots.** Their `coverAlt` says so. When you have real screenshots, overwrite these files (or point `coverImage` at new ones), update `coverAlt`, and fill each project's `gallery`.

### 4. Replace the portrait

Save a photo as `public/images/rezwan-ahmed-profile.webp` (4:5 portrait, roughly 960×1200). It appears automatically; until then the hero shows a monogram. To use another filename, change `portrait.src` in `data/profile.json`.

### 5. Add your resume

Save the PDF as `public/resume.pdf`. That's it: the buttons switch from **Request Resume** (opens an email to you) to **Download Resume** automatically. To use a different path, change `resume.path` in `data/profile.json`.

### 6. Add or change a social link

`data/socials.json`:

```json
{
  "id": "youtube",
  "label": "YouTube",
  "url": "https://www.youtube.com/@your-channel",
  "handle": "@your-channel",
  "icon": "youtube",
  "hero": false
}
```

It appears in Contact and the footer. `"hero": true` also shows it as an icon next to the hero buttons. `github`, `linkedin` and `facebook` use built-in brand glyphs; any other `icon` can be a Lucide name, otherwise a link icon is used. Entries without a valid `http(s)` `url` are skipped. (X and Medium are intentionally absent.)

### 7. Add education or experience

`data/education.json` (array):

```json
{
  "institution": "Example College",
  "degree": "Higher Secondary Certificate",
  "status": "Completed",
  "startDate": "2020",
  "endDate": "2022",
  "endIsExpected": false,
  "summary": "Optional sentence.",
  "focusAreas": ["Physics", "Mathematics"]
}
```

`data/experience.json` is an object; add to `entries`. While `entries` is empty, the section shows the intentional "independent and academic projects" message (`emptyTitle` / `emptyText`), which disappears once you add a real entry.

```json
{
  "role": "Frontend Intern",
  "organization": "Example Co.",
  "type": "Internship",
  "location": "Remote",
  "startDate": "2027-06",
  "endDate": "2027-09",
  "summary": "What you did, in a sentence or two.",
  "highlights": ["Shipped X", "Improved Y"],
  "url": "https://example.com"
}
```

### 8. Edit navigation / profile

- `data/navigation.json`: one list drives the desktop nav, mobile menu and footer. `href` is `#section-id` (on the home page) or a full path.
- `data/profile.json`: name, headline, intro, about paragraphs, interests, contact details.

---

## Deploy to Vercel

1. Create an empty repository on GitHub, then from this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. On [vercel.com](https://vercel.com), click **Add New → Project**, import the repository.
3. Leave the framework preset as **Next.js**. Vercel detects Bun from `bun.lock`.
4. No environment variables are required. Optionally set `NEXT_PUBLIC_SITE_URL` if you attach a custom domain (see `.env.example`).
5. Click **Deploy**.
6. After it's live, check: the home page, every navbar link, each project page (`/projects/bazardor`, `/projects/gatekeeper`, `/projects/xor-gaming-cafe`), a made-up URL (should show the 404 page), `/sitemap.xml`, and the mobile menu on a real phone.

## Notes and honest limitations

- All copy is drawn from the details supplied. Skill **status labels**, the BazarDor/Gatekeeper/XOR **architecture layers**, and the **challenges** lists are reasonable summaries, not first-hand statements; edit them to match reality. Challenge lists carry a visible note saying they're not first-hand accounts. Delete `challengesNote` and rewrite once you've documented your own experiences.
- Gatekeeper has no `status`, repository or demo link, and XOR Gaming Cafe has no repository link yet, because none were provided. Add `repositoryUrl` / `status` when you're ready.
- The Next.js metadata system automatically emits `twitter:*` link-preview tags derived from the Open Graph data. They're invisible and there is no link to X anywhere on the site.
