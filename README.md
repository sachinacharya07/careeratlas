# Career Atlas

A claymorphism React app for planning entrance exams across Science, Commerce, and Arts after Class 12.

## Run locally

```bash
npm install
npm run dev
```

## Deploy on Vercel

**Option A — GitHub (recommended):**
1. Push this whole folder to a new GitHub repo.
2. Go to vercel.com → "Add New Project" → import that repo.
3. Vercel auto-detects Vite. Leave all settings as default and click Deploy.

**Option B — Vercel CLI (no GitHub needed):**
```bash
npm install -g vercel
cd career-atlas-app
vercel
```
Follow the prompts — it deploys straight from your machine.

**Option C — Drag and drop:**
1. Run `npm install && npm run build` locally first (Vercel's drag-and-drop only accepts a pre-built `dist` folder, not source code).
2. Go to vercel.com → "Add New Project" → drag in the `dist` folder.

> Uploading just the `CareerAtlas.jsx` file on its own (what you tried before) will always fail — Vercel needs `package.json`, an entry point (`index.html` → `src/main.jsx`), and a build config to know what to install and how to build it. This folder has all of that already wired up and has been build-tested.

## Tech
Vite + React 18, Tailwind CSS (utility classes), lucide-react (icons), recharts (salary chart).
