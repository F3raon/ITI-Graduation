# Task: Fix design, UX and performance issues in my 3D portfolio

You are working inside my portfolio repo (Vite + React + TypeScript + Three.js / react-three-fiber + Tailwind). It is a scroll-driven cinematic 3D site deployed on Vercel. I am a junior .NET backend developer using this site to apply for .NET jobs, so **recruiter readability matters more than visual effects**.

## How to work

1. **Read before editing.** Start by reading `package.json`, `src/Portfolio.tsx`, `src/context/ScrollContext.tsx`, `src/components/scene/World.tsx`, `src/components/scene/CameraRig.tsx`, everything in `src/components/sections/`, `src/components/ui/ScrollTrack.tsx`, `src/data/*`, `src/styles.css`, and `index.html`. Do not assume anything about how scroll progress, scenes, or overlays are wired. Verify it in the code.
2. **Work in the phases below, in order.** After each phase run `npm run build` (and the type check / lint if configured) and fix errors before moving on. Make one git commit per phase with a clear message.
3. **Don't redesign.** Keep the neon / cinematic identity (dark background, cyan + orange accents). Fix problems, don't replace the concept.
4. **Don't delete anything the app imports.** Before removing any file or asset, grep for references. If unsure, move it to `/docs/archive/` instead of deleting.
5. If something in this prompt contradicts what you find in the code, **trust the code**, tell me what differed, and proceed with the closest sensible fix.
6. At the end, give me a short report: what changed per phase, anything you skipped and why, and any numbers I need to tune manually.

---

## Phase 1: Scroll sections and nav labels (bug)

**Problem:** The right-side `ScrollTrack` label doesn't match the visible scene (for example "PROJECT LAB" shows during Achievements, "SKILLS LAB" during Experience). Cause: `SECTORS` in `ScrollTrack.tsx` is a hard-coded list of single progress values (`target`) that no longer matches where scenes actually sit, and the label only shows within `±0.04` of a target.

**Do:**
- Create `src/data/sections.ts` as the **single source of truth**: an array of `{ name, start, end }` ranges plus `getSection(progress)` and `sectionProgress(progress, section)` helpers.
- Derive the real ranges **from the code**: look at how `World.tsx`, `CameraRig.tsx`, and each file in `sections/` decide when they are visible/active (conditions like `progress > x && progress < y`, scroll offsets, or camera keyframes). Use those numbers. Replace those magic numbers in the scenes with imports from `sections.ts` so they cannot drift again.
- Starting estimate (verify against code; the order of sections in the site is: Entry, 3D Office, Neon Morph, Real Ahmed / About, Skills Lab, Projects, Experience, Achievements, Contact, Live Portal):

```ts
export const SECTIONS = [
  { name: 'ENTRY',        start: 0.00, end: 0.08 },
  { name: '3D OFFICE',    start: 0.08, end: 0.16 },
  { name: 'NEON MORPH',   start: 0.16, end: 0.25 },
  { name: 'REAL AHMED',   start: 0.25, end: 0.34 },
  { name: 'SKILLS LAB',   start: 0.34, end: 0.50 },
  { name: 'PROJECT LAB',  start: 0.50, end: 0.61 },
  { name: 'EXPERIENCE',   start: 0.61, end: 0.70 },
  { name: 'ACHIEVEMENTS', start: 0.70, end: 0.80 },
  { name: 'CONTACT',      start: 0.80, end: 0.95 },
  { name: 'LIVE PORTAL',  start: 0.95, end: 1.00 },
];
```

- Rewrite `ScrollTrack.tsx`:
  - Always show the **active section name** (from `getSection(progress)`), never blank, never wrong.
  - Replace mouse events with **Pointer Events** (`onPointerDown/Move/Up` + `setPointerCapture`, `touch-action: none`) so dragging works on touch.
  - Make the hit area **24px wide** around the 2px line.
  - Add `role="slider"` with `aria-valuenow` and `aria-valuetext`.
  - Draw a tick at each section start; highlight the active one.
  - Show label on mobile too (small), not hidden.
  - Add a `?debug` URL flag that shows live `progress` and the active section name in the corner, so I can calibrate ranges.

**Done when:** every section's label matches what is on screen, and dragging the track works with mouse and touch.

---

## Phase 2: Experience Hall text is garbled (highest visual priority)

**Problem:** In the Experience Hall the three cards show distorted/cut text ("UNI.. .NET DEVELOP.R", broken lines). Cards are tilted and the text is tiny. This is the most important section for recruiters.

**Do:**
- Read `ExperienceScene.tsx` and `src/data/experience.ts`.
- Find the cause (likely small 3D text on tilted planes, z-fighting between overlapping planes, texture resolution, or transparency/depth-write conflicts). Fix it properly.
- Prefer rendering card text as **HTML via drei `<Html>` (or a DOM overlay)** with real CSS typography: title at least 16px, company/date at least 13px, description at least 13px, line-height 1.5, high contrast against a darker semi-opaque card background.
- Reduce card tilt, add clear spacing so cards never overlap, and make the timeline readable top to bottom.
- Make sure the full job titles from `experience.ts` are displayed (for example "Junior .NET Developer", "Software Leader & Instructor").
- Fade overlays in/out using `sectionProgress` so they never linger into the next section.

**Done when:** all text in the three cards is crisp and fully readable at 1920x1080 and at 390px wide.

---

## Phase 3: Overlap, ghosting and contrast problems

Fix each of these (verify each one in code first):

1. **Intro:** the ".NET BACKEND DEVELOPER" subtitle overlaps the 3D office/monitor behind it and the word "DEVELOPER" gets visually broken. Move the office lower or the text higher, and/or add a subtle dark gradient behind the text block. The "SCROLL TO ENTER MY WORLD" hint is nearly invisible over the bright glow: increase contrast, add a text-shadow, and add a small animated arrow.
2. **About ("WHO AM I?"):** the "SKILLS LAB" heading and the skill icons from the next scene show through behind the About text (ghosting). Ensure scene overlays and 3D groups of other sections are hidden (`visible={false}` or opacity 0 with `pointer-events: none`) outside their own range from `sections.ts`, with short cross-fades at the edges.
3. **Neon Morph screen:** cut-off text fragments appear on the right edge of the portrait ("loves", "ming", "PLACE", "SYS.NEON_OVERRIDE"). Same cause as above (leftover overlays). Fix by the same visibility rules.
4. **About visuals:** the four red square corner markers on the portrait don't match the palette. Replace them with thin cyan corner brackets. Raise contrast of the stat labels (EXPERIENCE, PROJECTS, REST APIS, AWARDS). Make the stat text clearer: "3 LIVE REST APIS" and "1ST PLACE" should say what they refer to (use real wording from `src/data/*`; don't invent facts).
5. **Achievements:** the description text on the cards is about 8px and unreadable. Increase it to at least 12 to 13px, enlarge the cards, and use the empty space below. Order achievements so .NET-related ones (Microsoft Learn certifications, Sprints x Microsoft camp) come first and robotics after.

**Done when:** no section shows leftover text or icons from another section, and no body text is smaller than 12px at 1920x1080.

---

## Phase 4: Skills Lab is crowded

**Problem:** icons cover the skill labels ("Experienced", "Computer Vision", "Backend Languages"), the sub-labels are tiny, the center sphere overlaps text ("N.", "ROJ"), and skill levels are inconsistent ("Production", "Advanced", "Proficient", "Experienced").

**Do:**
- Read `SkillsScene.tsx` and `src/data/skills.ts`.
- Standardize levels to three: **Advanced / Proficient / Familiar** (map the existing values sensibly and tell me the mapping).
- Layout: put the **.NET stack** (ASP.NET Core, EF Core, SQL Server, Clean Architecture, CQRS & MediatR, SignalR, REST APIs) closest/largest or in the front ring. Put Python, Robotics/ROS, IoT, AI in an outer, smaller ring.
- Move each icon beside its card (not on top of the text), enlarge sub-labels to a readable size, and fix the center sphere so no text collides with it.

**Done when:** every skill label and level is fully readable with nothing overlapping.

---

## Phase 5: Performance and loading

- Add a **loading screen** with a progress bar (drei `useProgress`) so the user never sees a black canvas.
- **Lazy-load** heavy scenes with `React.lazy` + `Suspense` where it is safe; at least don't mount scenes far from the current scroll position.
- Cap pixel ratio: `Math.min(window.devicePixelRatio, 2)`.
- Detect low-end/mobile devices (`navigator.hardwareConcurrency`, `deviceMemory` if available, small viewport) and reduce effects there: fewer particles, no heavy post-processing, no shadows.
- Respect `prefers-reduced-motion`: reduce camera motion, particles, and glitch/shake effects.
- **Images:** the repo has lots of PNGs in `public/images/character/` (pose, pose_alpha, pose_feather, stage, trans_card variants), plus `crop_*`, `concept*`, and `models/*.png`. Check which are actually referenced in `src/`. Convert the used ones to **WebP** (keep PNG originals only in `/docs/archive/` if needed) and update the references. Do not touch unreferenced files except to list them for me in the report.

---

## Phase 6: Recruiter-friendly fallback and SEO

- Add a persistent minimal **"Skip to simple view"** control (top-left or top-right, small, always visible) that opens a **clean, fast 2D page** with: short bio, skills grouped (.NET first), experience, projects with live/GitHub links (use real links from `src/data/*`), certifications, contact, and a **Download CV** button (use the CV file if it exists in `public/`; otherwise leave a clearly marked TODO and tell me).
- Make the 2D view reachable by URL (for example `/simple` or `#simple`) and use it automatically as fallback when WebGL is unavailable or the device is very low-end.
- `index.html`: rewrite title and meta description to **lead with .NET** (ASP.NET Core, Clean Architecture, SQL Server, REST APIs); keep robotics as a secondary mention. Add Open Graph and Twitter Card tags using the existing `public/images/portfolio-preview.jpg`, a proper `lang`, and a favicon if missing.
- Add real semantic HTML content (headings, project names, bio) in the DOM, visually hidden if needed, so crawlers and screen readers get content from the 3D page.

---

## Phase 7: Repo cleanup

- Move `Prompts/`, `capture.cjs`, and the root screenshots (`1_INTRO.png` ... `10_FINAL_PORTAL.png`) into `docs/` (or add to `.gitignore` if they shouldn't be public). Make sure nothing imports them.
- Make sure `README.md` has: live URL, one screenshot, tech stack, how to run, and project structure summary. Keep it short and professional.
- Confirm `npm run build` passes with no errors and no new warnings you introduced.

---

## Global rules

- TypeScript strict; no `any` unless unavoidable (and comment why).
- No new heavy dependencies without telling me why. Prefer what is already in `package.json` (drei, three, tailwind).
- Keep accessibility in mind: contrast ratio at least 4.5:1 for body text, keyboard-focusable controls, aria labels on buttons.
- Test mentally (and with the dev server if possible) at **1920x1080, 1366x768, and 390x844**.
- Never invent personal facts (jobs, awards, numbers, links). Use only what exists in `src/data/*`. If something is missing, leave a clearly marked TODO and list it in the final report.
- If a phase turns out larger than expected, finish it in a minimal but working form, commit, and note what remains.

Start with Phase 1 now.
