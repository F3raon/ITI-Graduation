# Feature: Whole-site theme transforms in sync with the "Real Ahmed → Neon Ahmed" image transition

You are working in my portfolio repo (Vite + React + TypeScript + react-three-fiber + drei + Tailwind). Read this whole file first, then implement it phase by phase.

## The idea

Right now the portrait transitions from my real photo to a stylized neon "agent" illustration (electric blue / cyan / yellow / violet energy, in the spirit of a hero-shooter agent like Neon from Valorant; **use the palette and mood only, never any game assets, logos, or names**). Only the image changes; the rest of the page does not.

I want the **entire design to transform at the same moment and at the same speed as the image**: colors, lighting, grid, particles, post-processing, HUD, text accents, the scroll track, even the motion feel. When the portrait becomes "Neon", the whole world becomes "Neon". When the user scrolls back, everything returns to the "Real" look smoothly.

## How to work

1. **Read before editing.** The repo already has pieces of this system. Read these first and understand how they connect: `src/context/NeonContext.tsx`, `src/context/ScrollContext.tsx`, `src/hooks/useTransformationProgress.ts`, `src/components/character/CharacterTransformation.tsx`, `CharacterEffects.tsx`, `CharacterLighting.tsx`, `CharacterParticles.tsx`, `LightningStrike.tsx`, `NeonHUD.tsx`, `src/components/scene/GlobalNeonTheme.tsx`, `NeonSectionGlow.tsx`, `Lighting.tsx`, `Effects.tsx`, `Environment.tsx`, `FloatingParticles.tsx`, `src/components/ui/ScrollTrack.tsx`, `src/styles.css`, `tailwind.config.js`, and `src/data/sections.ts` if it exists.
2. **Extend what exists. Don't build a parallel system.** If `NeonContext` / `GlobalNeonTheme` already do part of this, reuse and fix them. Tell me what you found and what was missing or broken.
3. Trust the code over this prompt where they differ, and tell me.
4. Run `npm run build` after each phase and make one git commit per phase.
5. Never invent personal facts or copy copyrighted assets.

---

## Phase 1: One driver value for everything

Create (or fix) a single source of truth: **`themeMix` (number 0 → 1)**, where 0 = Real look and 1 = Neon look.

- It must be derived from the **same value that drives the image crossfade** (look at `useTransformationProgress`), so the image and the theme can never drift apart. If the image uses a different curve than the scroll progress, derive `themeMix` from the image's own transition value, not from raw scroll.
- Expose it two ways:
  - **React/R3F side:** a ref or store (for example a small zustand store or a context with a ref, whichever the project already uses) that `useFrame` loops can read **without causing React re-renders every frame**.
  - **CSS side:** write it to the document root as CSS variables once per frame via `requestAnimationFrame` or inside a `useFrame`: `--theme-mix`, plus the interpolated color variables below.
- It must be **reversible and scrubbable**: scrolling back and forth, dragging the scroll track, or jumping straight to a section must always give the correct look for that position, never a stuck state.

## Phase 2: Theme tokens (Real vs Neon)

Define two token sets in one file (for example `src/theme/themes.ts`) and an interpolation helper that lerps colors in a perceptually reasonable way (lerp in linear RGB or OKLab, not by raw hex string).

Suggested tokens (adjust to match what the code and the images actually use; tell me what you chose):

| Token | Real | Neon |
|---|---|---|
| `accent` | current cyan | electric cyan-blue (about `#00e5ff`) |
| `accent2` | current orange | hot yellow (about `#ffd400`) |
| `accent3` | current purple | electric violet (about `#7c4dff`) |
| `bg` | current near-black | deep navy-violet black |
| `gridColor` | current teal | cyan with higher emissive |
| `fog` | current | slightly bluer, a bit denser |
| `bloomIntensity` | current | about 1.5x to 2x |
| `particleSpeed` | current | about 1.5x to 2x |
| `particleColors` | current | cyan / yellow / violet |

Everything below must read from these tokens, not from hard-coded hex values scattered in components. Replace the hard-coded neon colors you find in the files listed above with token reads.

## Phase 3: Apply the theme to every layer

Wire `themeMix` into all of these. Each one must change **continuously** with the value, not snap:

1. **CSS / HTML UI:** text accents, borders, glows (`text-shadow`, `box-shadow`), HUD labels, stat cards, section headings, buttons, `ScrollTrack` color and glow, scrollbar. Use CSS variables so Tailwind classes or inline styles can use `var(--accent)` etc.
2. **3D lights:** light colors and intensities in `Lighting.tsx` / `CharacterLighting.tsx`, lerped every frame.
3. **Scene:** background color, fog color/density, grid line color and emissive intensity, floor ring/portal colors.
4. **Particles:** color palette, speed, and size in `FloatingParticles.tsx` / `CharacterParticles.tsx` (lerp per-instance colors or use a shader uniform; avoid rebuilding geometry).
5. **Post-processing:** bloom intensity/threshold, chromatic aberration, vignette, in `Effects.tsx` / `CharacterEffects.tsx`. Use effect parameters or uniforms, not remounting the composer.
6. **HUD content:** during the transition show glitchy status text in `NeonHUD.tsx` (for example `SYS.NEON_OVERRIDE`, `ENERGY MAX`). It must fade in and out cleanly with `themeMix`, never leave fragments behind (see Phase 5).
7. **Typography feel (optional, subtle):** slightly wider letter-spacing and a faint glitch/skew on headings near the peak of the transition. Keep it readable.

## Phase 4: Transition choreography (this is what makes it feel premium)

The change should feel like a short cinematic sequence, not a flat fade. Implement it as a function of the image transition progress `p` (0 → 1), for example:

- `p 0.00 – 0.35` **Build-up:** particles accelerate, bloom ramps up, a few subtle scanline/glitch flickers on the HUD.
- `p 0.35 – 0.65` **Peak / swap:** the lightning strike (`LightningStrike.tsx`) and a bright flash happen **exactly when the image swaps**, plus one expanding shockwave ring on the floor ring. Color tokens cross over the middle of the mix here.
- `p 0.65 – 1.00` **Settle:** flash fades, bloom eases back to the Neon steady value, particles settle into the Neon palette and speed.

Rules:
- Use easing (for example smoothstep) so nothing feels linear or robotic.
- One-shot effects (lightning, shockwave) must trigger **on crossing thresholds in either direction**, with a cooldown, so scrubbing quickly doesn't spam them.
- Optional: use `soundEngine` (`src/utils/audio.ts`) for a short whoosh/zap at the swap if a suitable sound method already exists; otherwise skip, and don't add audio files.

## Phase 5: Clean up leftovers and bugs I can already see

In screenshots of the transition, text fragments from other overlays are still visible on top of or behind the portrait (for example fragments like "who loves", "turning", "PLACE", "SYS.NEON_OVERRIDE" cut off at the image edge, and skill icons floating on the portrait). Fix them:

- Overlays and 3D groups that belong to other sections must be hidden (`visible={false}` or opacity 0 with `pointer-events: none`) outside their own scroll range, with short cross-fades at the edges.
- Neon HUD text should be positioned inside the portrait frame with proper clipping or margins, not cut off.
- The old real-photo frame (the four red corner markers) should morph to the neon style (thin cyan/yellow corner brackets) as `themeMix` rises, instead of staying red.

## Phase 6: Performance, accessibility, mobile

- No per-frame React state updates. Use refs / uniforms / CSS variables.
- Don't recreate materials, geometries, or the post-processing composer during the transition.
- Low-end / mobile: keep the color and lighting transformation, but reduce particle count, skip the heaviest post effects, and shorten or simplify the shockwave.
- Respect `prefers-reduced-motion`: keep the theme change but remove flashes, shake, glitch, and fast flicker; use a simple smooth crossfade instead.
- Keep text contrast at least 4.5:1 at both ends of the mix and at the midpoint.

## Phase 7: Debug helper

Add a `?debug` URL flag (reuse it if it already exists) that shows a small overlay with the live `themeMix` value and a slider to **manually scrub 0 → 1**, so I can tune the look without scrolling. It must be stripped or hidden when the flag is absent.

---

## Acceptance criteria (check each one and report)

- [ ] Image crossfade and theme change are driven by the same value and are visually in sync at any scroll position.
- [ ] Scrolling backward restores the Real look smoothly, with no stuck colors.
- [ ] Jumping via the scroll track directly into the middle of the transition shows the correct mixed look.
- [ ] No hard-coded neon hex values remain in the files listed above (they read from tokens).
- [ ] No overlay fragments from other sections are visible during the transition.
- [ ] Lightning/flash/shockwave fire once per crossing, never spam when scrubbing.
- [ ] No React re-render per frame caused by the theme system (verify with React DevTools Profiler or by reasoning from the code).
- [ ] `npm run build` passes; works at 1920x1080 and 390x844.

## Final report

When finished, tell me: what already existed and what you changed, the token values you chose, the thresholds used in the choreography (so I can tune them), anything you skipped and why, and any assets or sounds I need to supply.

Start with Phase 1.
