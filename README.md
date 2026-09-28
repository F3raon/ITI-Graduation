# Ahmed Hamada — Cinematic 3D Portfolio

An interactive, continuous WebGL 3D world representing the engineering portfolio of **Ahmed Hamada** (.NET Backend Developer & Robotics Specialist). Built with **React 19**, **Three.js**, and **React Three Fiber**, this application dispenses with traditional multi-page navigation in favor of a single, continuous cinematic camera journey along a calibrated 3D world axis.

Live Production Deployment: [https://ahmed-hamda-iti-grad.vercel.app/](https://ahmed-hamda-iti-grad.vercel.app/)  
Original React Portfolio: [https://ahmed-hamada-eta.vercel.app/](https://ahmed-hamada-eta.vercel.app/)  
GitHub Source: [https://github.com/F3raon/ITI-Graduation](https://github.com/F3raon/ITI-Graduation)

---

## Table of Contents

- [Overview](#overview)
- [Concept](#concept)
- [Experience Flow](#experience-flow)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [World Architecture](#world-architecture)
- [Camera System](#camera-system)
- [Scroll System](#scroll-system)
- [Scene Breakdown](#scene-breakdown)
  - [1. Boot Loader](#1-boot-loader)
  - [2. Intro Scene](#2-intro-scene)
  - [3. Office Studio](#3-office-studio)
  - [4. Ahmed Character & Transformation](#4-ahmed-character--transformation)
  - [5. About Me / Identity Dossier](#5-about-me--identity-dossier)
  - [6. Skills Lab / Core Reactor](#6-skills-lab--core-reactor)
  - [7. Project Lab & ITI Academic Branch](#7-project-lab--iti-academic-branch)
  - [8. Experience Hall](#8-experience-hall)
  - [9. Achievements Chamber](#9-achievements-chamber)
  - [10. Contact Terminals](#10-contact-terminals)
  - [11. Final Portal](#11-final-portal)
- [Project Showcase](#project-showcase)
- [Character Transformation](#character-transformation)
- [Assets Inventory](#assets-inventory)
- [Design System](#design-system)
- [Responsive Design](#responsive-design)
- [Performance Audit](#performance-audit)
- [Error Handling](#error-handling)
- [Known Issues](#known-issues)
- [Technical Risks](#technical-risks)
- [Development History](#development-history)
- [Installation](#installation)
- [Development](#development)
- [Production Build](#production-build)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Future Roadmap](#future-roadmap)
- [Credits](#credits)
- [License](#license)

---

## Overview

The **Ahmed Hamada Cinematic 3D Portfolio** is a single-page WebGL application developed as a graduation showcase and professional portfolio. Instead of standard 2D scrolling or modal transitions, the user controls a virtual camera that glides through a procedural cybernetic corridor spanning over 114 units in world depth along the negative Z-axis.

The project highlights two complementary skill sets:
1. **.NET Backend Engineering**: Production-ready enterprise systems, Clean Architecture, CQRS with MediatR, ASP.NET Core APIs, SignalR real-time communications, and SQL Server database modeling.
2. **Robotics, Embedded Systems & 3D Interactive Design**: Autonomous rover platforms with ROS and LiDAR SLAM, IoT hardware prototypes, computer vision systems, and custom Three.js GLSL shaders.

---

## Concept

The core concept is **The Continuous Voyage**: rather than clicking links to load disparate pages, the viewer is guided through an architecturally cohesive digital headquarters that mirrors Ahmed's career trajectory:
- Starting in a physical developer studio with a seated coder and active dual monitors.
- Passing through an identity threshold where the developer transforms into his cybernetic digital avatar.
- Exploring technical capabilities organized as an orbital nuclear reactor.
- Browsing physical 3D dioramas of engineering systems alongside production web applications and academic repositories.
- Reviewing verifiable work experience, national competitive trophies, and interactive contact consoles.
- Concluding at an integrated dimensional portal that natively embeds the previous generation portfolio inside the 3D world.

---

## Experience Flow

The user progresses through the following sequential stages:

```
[ BOOT LOADER ]
       ↓ (Click "ENTER DIGITAL WORLD" / Audio context unlocks)
[ 1. INTRO / HERO STAGE ] (Z = +8.0, Scroll 0.00 – 0.14)
       ↓ (Camera flies forward along -Z)
[ 2. DEVELOPER OFFICE ] (Z = 0.0, Scroll 0.14 – 0.26)
       ↓ (Passes through back glass archway)
[ 3. AHMED CHARACTER & TRANSFORMATION ] (Z = -10.0, Scroll 0.26 – 0.48)
       ↓ (Shader crossfade & flashlight reveal: Real → Neon)
[ 4. ABOUT ME / IDENTITY DOSSIER ] (Z = -22.0, Scroll 0.48 – 0.58)
       ↓ (Camera glides past biometric holographic frame)
[ 5. SKILLS LAB / SYSTEM CORE ] (Z = -34.0, Scroll 0.58 – 0.66)
       ↓ (Central .NET reactor with 11 orbiting skill nodes)
[ 6. PROJECT LAB & ITI ACADEMIC BRANCH ] (Z = -46.0, Scroll 0.66 – 0.76)
       ↓ (3D Dioramas + Carousel + 17 ITI assignment folders)
[ 7. EXPERIENCE HALL ] (Z = -70.0, Scroll 0.76 – 0.84)
       ↓ (Milestone blocks along central illuminated timeline rail)
[ 8. ACHIEVEMENTS CHAMBER ] (Z = -82.0, Scroll 0.84 – 0.90)
       ↓ (Rotating 3D metallic trophies with dedicated spotlights)
[ 9. CONTACT TERMINALS ] (Z = -94.0, Scroll 0.90 – 0.96)
       ↓ ("LET'S BUILD SOMETHING" + 4 glass dispatch terminals)
[ 10. FINAL PORTAL ] (Z = -106.0, Scroll 0.96 – 1.00)
       ↓ (3D monitor embedding previous live portfolio in an iframe)
```

---

## Features

- **Continuous 3D World Journey**: Single Canvas WebGL pipeline with no route changes or page reloads.
- **Sole-Authority Spline Camera**: Piecewise keyframed Catmull-Rom spline curves controlling camera position, focus target, responsive FOV breathing, pointer parallax, and roll banking.
- **Procedural 3D Developer Office**: Seated developer character with head cursor tracking, natural breathing, and typing movements; dual monitors with animated code and 3D wireframe ROS telemetry; gaming PC tower with spinning RGB fans and water cooling; desk lamp; Raspberry Pi with blinking LED; and companion desktop robot.
- **Interactive Shader Flashlight Reveal**: Custom GLSL shader on Ahmed's portrait blending real photography (`REAL_AHMED.png`) and cyber neon styling (`NEON_AHMED.png`) via mouse cursor distance mask, scroll progress, and clickable platform conduit lights.
- **Physical 3D Miniature Dioramas**:
  - *Smart Garage*: Lifting barrier gate, low-poly car, and status LEDs.
  - *Robotics Rover*: All-terrain wheels, articulated robot arm, and spinning LiDAR sensor.
  - *CinaVerse Laptop*: Floating laptop terminal with levitating movie posters.
  - *Smart Nursery*: Geodesic greenhouse dome with bioluminescent plants and sensor mast.
- **ITI Academic Branch with GitHub API**: 17 interactive 3D folders representing React.js course sessions. Clicking any folder fetches real directory contents via GitHub REST API in a styled modal.
- **Procedural Web Audio Engine**: Zero external audio files. Synthesizes a 55Hz sub-bass ambient drone, 640Hz hover chime, and 880Hz selection tone in real time via the Web Audio API.
- **Strict Distance Fog Isolation**: Depth fog starting at 6 units and fully opaque at 15 units isolates adjacent sections spaced 12 units apart, preventing visual clutter while maintaining high framerates.
- **Embedded Live Portal**: Renders the previous portfolio inside a 3D CRT monitor bezel using `@react-three/drei`'s `Html` transform and native `iframe`.
- **Holographic HUD & Navigation**: Real-time sector indicator and draggable progress thumb that allows instant jumping to any world sector.

---

## Tech Stack

The versions documented below represent the exact dependencies in `package.json`:

### Core Technologies
| Technology | Version | Purpose |
|---|---|---|
| **React** | `19.1.1` | Application UI framework and component architecture |
| **React DOM** | `19.1.1` | DOM renderer for React 19 |
| **TypeScript** | `5.9.2` | Strict type safety, interfaces, and build checking |
| **Vite** | `7.1.7` | Fast ES module dev server and Rollup bundler |

### 3D & Graphics Ecosystem
| Technology | Version | Purpose |
|---|---|---|
| **Three.js** | `0.180.0` | 3D WebGL graphics engine, scenegraph, materials, math |
| **@react-three/fiber** | `9.3.0` | React reconciler for Three.js (R3F) |
| **@react-three/drei** | `10.7.6` | 3D helpers: `Text`, `RoundedBox`, `Float`, `Html`, `useTexture` |
| **@react-three/postprocessing** | `3.1.2` | Postprocessing pipeline wrapper |
| **postprocessing** | *(peer)* | Bloom (mipmapBlur), Noise, Vignette shader passes |

### Styling & Utility
| Technology | Version | Purpose |
|---|---|---|
| **Tailwind CSS** | `4.3.3` | Utility styling (`@import "tailwindcss";` architecture) |
| **@tailwindcss/postcss** | `4.3.3` | PostCSS integration for Tailwind v4 |
| **PostCSS** | `8.5.28` | CSS processor |
| **Autoprefixer** | `10.6.1` | Vendor prefixing |
| **Framer Motion** | `12.23.12` | Animation primitives |
| **Axios** | `1.20.0` | HTTP client for GitHub API folder queries |

---

## Architecture

The application is structured into three clean layers: State/Input, 3D WebGL Canvas, and DOM Overlay.

```
Portfolio (Root Component)
│
├── ScrollProvider (Context / Single Mutable ScrollStore)
│   ├── Mouse Wheel Listener (deltaY * 0.00038)
│   ├── Touch Events Listener (deltaY * 0.0009)
│   └── Keyboard Listener (Arrows, PageUp/Down, Space, Home, End)
│
├── DOM UI Layer (Fixed Fullscreen Overlay)
│   ├── CinematicLoader (Dual SVG progress rings + boot logs)
│   ├── SoundToggle (Procedural Web Audio synthesis mute/unmute)
│   ├── ScrollTrack (Right-edge holographic sector scrub bar)
│   └── Top Brand Watermark (Monospace developer identity tag)
│
└── R3F WebGL Canvas (shadows, dpr [1, 1.5], powerPreference: high-performance)
    └── World
        ├── Background Color & Isolating Fog (6 to 15 units)
        ├── Lighting (Directional shadows + point lights + beams)
        ├── Environment (850 star particles, 32 city buildings, cyber grid)
        ├── CameraRig (Sole camera authority, CatmullRom splines, FOV lerp)
        ├── Effects (Bloom, Noise, Vignette inside Suspense)
        ├── FloatingParticles (InstancedMesh of 600 additive dust motes)
        │
        ├── [Z = +8.0]  IntroScene (Platform, DigitalCore, 3D Hero Text)
        ├── [Z =  0.0]  Office (Desk, Monitors, PC, Props, Seated Character)
        ├── [Z = -10.0] CharacterScene (AhmedCharacter GLSL shader, Dais, Arcs)
        ├── [Z = -22.0] AboutScene (Glass Dossier, Holographic Frame, Stat Plates)
        ├── [Z = -34.0] SkillsScene (.NET Reactor Core, 11 Orbital TechNodes)
        ├── [Z = -46.0] ProjectsScene (Rotating Carousel, Dioramas, ITI Branch)
        ├── [Z = -70.0] ExperienceScene (Timeline Rail, 3 Glass Milestone Blocks)
        ├── [Z = -82.0] AchievementsScene (4 Trophy Pedestals with Spotlights)
        ├── [Z = -94.0] ContactScene (3D Typography, 4 Interactive Terminals)
        └── [Z = -106.0] PortfolioPortal (Energy Rings, Monitor, Embedded Iframe)
```

---

## World Architecture

All 3D coordinate origins and camera focal positions are centralized in [`src/data/world.ts`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/data/world.ts) as the single source of truth.

### World Depth Coordinate Map

```
Z = +13 ──────────────── Camera Initial Focus
Z =  +8 ─── [ INTRO ] ── Platform, Digital Core, Hero Typography
Z =  +5 ──────────────── Camera Office Framing
Z =   0 ─── [ OFFICE ] ─ Desk, Triple Displays, Tower PC, Seated Dev
Z =  -4 ──────────────── Camera Archway Approach
Z =  -5 ──────────────── Camera Ahmed Front Face
Z = -10 ─── [ AHMED ] ── Real → Neon Transformation, Hex Dais
Z = -17 ──────────────── Camera About Framing
Z = -22 ─── [ ABOUT ] ── Dossier Panel, Holographic Portrait, Stat Plates
Z = -29 ──────────────── Camera Skills Framing
Z = -34 ─── [ SKILLS ] ─ .NET Core Reactor, 11 TechNodes & Laser Rays
Z = -41 ──────────────── Camera Projects Entry
Z = -46 ─── [ PROJECT ]─ Rotating Diorama Carousel + ITI Academic Branch
Z = -65 ──────────────── Camera Experience Framing
Z = -70 ─── [ EXP ] ──── Central Timeline Rail, 3 Milestone Blocks
Z = -77 ──────────────── Camera Achievements Framing
Z = -82 ─── [ AWARDS ] ─ 4 Trophy Pedestals, Spotlights
Z = -89 ──────────────── Camera Contact Framing
Z = -94 ─── [ CONTACT ]─ "LET'S BUILD", 4 Glass Terminals
Z = -101 ─────────────── Camera Portal Framing
Z = -106 ─── [ PORTAL ] ─ 3D CRT Monitor, Counter-rotating Rings, Iframe
```

### World Coordinate Reference Table

| Section Key | World Group Z (`WORLD.*_Z`) | Camera Z (`WORLD.CAM_*`) | Scroll Range (`WORLD.SCROLL_*`) |
|---|---|---|---|
| `INTRO` | `+8.0` | `+13.0` | `0.00 – 0.14` |
| `OFFICE` | `0.0` | `+5.0` | `0.14 – 0.26` |
| `APPROACH` | `-5.0` | `-4.0` | `0.24 – 0.29` (Transitional) |
| `CHARACTER` | `-10.0` | `-5.0` (Front) / `-5.5` (Neon) | `0.26 – 0.48` |
| `ABOUT` | `-22.0` | `-17.0` | `0.48 – 0.58` |
| `SKILLS` | `-34.0` | `-29.0` | `0.58 – 0.66` |
| `PROJECTS` | `-46.0` | `-41.0` / `-44.0` | `0.66 – 0.76` |
| `EXPERIENCE` | `-70.0` | `-65.0` | `0.76 – 0.84` |
| `ACHIEVEMENTS` | `-82.0` | `-77.0` | `0.84 – 0.90` |
| `CONTACT` | `-94.0` | `-89.0` | `0.90 – 0.96` |
| `PORTAL` | `-106.0` | `-101.0` | `0.96 – 1.00` |

---

## Camera System

### Camera Ownership
**`CameraRig.tsx` is the sole owner of the Three.js camera.** No other component manipulates camera position, rotation, or projection matrices.

### Implementation Details
- **Path Calculation**: Camera positions and lookAt targets are governed by two 17-point `THREE.CatmullRomCurve3` splines configured with `centripetal` curvature (`curveType: 'centripetal'`, tension `0.5`).
- **Spline Sampling**: Normalized scroll progress `s ∈ [0, 1]` is mapped through piecewise linear keyframe intervals to compute the exact spline parameter `t ∈ [0, 1]`.
- **Smoothing**:
  ```ts
  camera.position.lerp(desiredPos.current, 1 - Math.exp(-6 * delta));
  camera.lookAt(lookAtPos.current);
  ```
- **Responsive Pullback**: For screens with an aspect ratio `< 1.5`, the camera dynamically pulls backward along its line of sight:
  ```ts
  const pullback = (1.5 - aspect) * 1.6;
  const dir = desiredPos.current.clone().sub(lookAtPos.current).normalize();
  desiredPos.current.add(dir.multiplyScalar(pullback));
  ```
- **Dynamic FOV**:
  - Desktop (`aspect ≥ 1.2`): Base FOV 54°
  - Tablet (`0.8 ≤ aspect < 1.2`): Base FOV 60°
  - Mobile Portrait (`aspect < 0.8`): Base FOV 68°
  - In addition, FOV subtly breathes down (`targetFov = baseFov - t * 3`) as the camera travels down the corridor.
- **Cinematic Banking & Parallax**:
  - Horizontal mouse parallax: `desiredPos.x += state.pointer.x * 0.22`
  - Vertical mouse parallax: `desiredPos.y += -state.pointer.y * 0.12`
  - Camera roll bank: `camera.rotation.z` lerps with `-pointer.x * 0.015 + sin(time * 0.25) * 0.0015`.

---

## Scroll System

The scroll architecture decouples high-frequency native browser input events from WebGL rendering through an imperative mutable singleton (`scrollStore` in `ScrollContext.tsx`):

```
Wheel / Touch / Keyboard / Scrub
              ↓
    scrollStore.target
              ↓
useFrame in CameraRig (Runs at screen refresh rate):
scrollStore.current = lerp(current, target, 1 - exp(-6 * delta))
              ↓
Throttled Notification to React UI (Every ~33ms):
scrollStore.notify()  →  useScrollProgress()  →  ScrollTrack HUD
              ↓
3D Interpolation:
Catmull-Rom Spline (t = getCurveT(scrollStore.current))
```

### Input Sensitivity Values
- **Mouse Wheel**: `deltaY * 0.00038` (calibrated for slow, deliberate, cinematic movement without rapid jumping).
- **Touch / Touchpad**: `deltaY * 0.0009` (tracks vertical touch drag).
- **Keyboard Controls**:
  - `ArrowDown` / `ArrowUp`: Step `±0.03`
  - `PageDown` / `PageUp` / `Space`: Step `±0.08`
  - `Home`: Instantly targets `0.0`
  - `End`: Instantly targets `1.0`
- **Global Lock**: `scrollStore.locked = true` halts target updates when dialogs or nested interactive elements are active.

---

## Scene Breakdown

### 1. Boot Loader
- **Component**: [`src/components/ui/Loader.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/ui/Loader.tsx)
- **Visuals**: Fullscreen `#010306` overlay featuring a dual-ring SVG reactor: an outer dashed spinning ring (`8s` linear) and an inner green/cyan progress ring (`2 * π * 42` circumference).
- **Behavior**: Uses R3F's `useProgress()` smoothed by a progressive animation loop to simulate system boot logs (`INITIALIZING SYSTEM ARCHITECTURE...`, `MOUNTING 3D ENVIRONMENT...`).
- **Interaction**: Displays "ENTER DIGITAL WORLD" upon reaching 100%. Clicking initializes and unmutes the procedural Web Audio engine and transitions into the 3D scene.

### 2. Intro Scene
- **Component**: [`src/components/sections/IntroScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/IntroScene.tsx)
- **Position**: `Z = +8.0`
- **Visuals**:
  - Dark metallic circular dais (radius 3.0, cylinder geometry) with cyan and amber glowing concentric rings.
  - Multi-ring `DigitalCore` with 3 counter-rotating torus rings and 12 orbiting data node spheres.
  - Instanced particle field (150 particles on mobile, 350 on desktop).
  - 3D typography: `// CINEMATIC 3D PORTFOLIO`, `AHMED HAMADA`, `.NET BACKEND DEVELOPER`, and scroll prompt.

### 3. Office Studio
- **Component**: [`src/components/office/Office.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/office/Office.tsx)
- **Position**: `Z = 0.0`
- **Visuals & Sub-components**:
  - *Desk setup* (`Desk.tsx`): Dark wood/metallic workstation with front amber emissive accent line, drawer handles, and desk lamp casting warm light.
  - *Workstation Displays* (`Monitors.tsx`): 3 angled displays with hover scaling.
    - Left Monitor: ASP.NET Core 8 C# controller code (`[HttpPost("telemetry")] ...`).
    - Center Monitor: Spinning 3D wireframe autonomous rover with ROS SLAM telemetry text.
    - Right Monitor: Animated bar chart representing Kubernetes cluster CPU/RAM load and SQL latency.
  - *PC Tower* (`PC.tsx`): Heavy chassis with tempered glass side panel, 3 spinning RGB intake fans, GPU with logo, and pulsating liquid cooling tube.
  - *Developer Character* (`Character.tsx`): Seated 3D procedural character constructed of Three.js capsule, cylinder, and sphere primitives. Features natural breathing, subtle keyboard typing micro-movements, and head orientation that tracks the user's cursor.
  - *Desk Accessories* (`Props.tsx`): Mechanical keyboard with underglow, ergonomic mouse with mousepad, open laptop, steaming coffee mug, Raspberry Pi with blinking status LED, and mini desktop companion robot with moving head and cyber eyes.

### 4. Ahmed Character & Transformation
- **Component**: [`src/components/sections/CharacterScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/CharacterScene.tsx) & [`src/components/character/AhmedCharacter.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/character/AhmedCharacter.tsx)
- **Position**: `Z = -10.0`
- **Visuals**:
  - Hexagonal metallic dais (radius 2.55) with cyan/amber outer ring and 6 corner conduit lights.
  - Counter-rotating electric orbit arcs and a soft cyan neon halo backdrop.
  - 80 dodecahedron particles bursting outward during the transformation window.
  - The character portrait: a 2D plane geometry running a custom GLSL shader that seamlessly reveals the cyber neon avatar beneath the real photo.

### 5. About Me / Identity Dossier
- **Component**: [`src/components/sections/AboutScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/AboutScene.tsx)
- **Position**: `Z = -22.0`
- **Visuals**:
  - Dark glass backdrop panel (7.4 × 4.4 × 0.1) with clearcoat and transmission.
  - 3D technical bio: focus on high-performance .NET backend systems, Clean Architecture, SQL Server, and robotics integration.
  - Biometric holographic portrait (`HolographicPortrait`): mounts `ahmed-portrait.png` inside a glass frame with an animated vertical laser scanline, amber corner brackets, and mouse parallax tilt.
  - 4 floating 3D stat plates: `2+ YRS` (.NET DEV), `10+` (SHIPPED), `3 LIVE` (PRODUCTION APIS), `1ST PLACE` (ARC EGYPT).

### 6. Skills Lab / Core Reactor
- **Component**: [`src/components/sections/SkillsScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/SkillsScene.tsx)
- **Position**: `Z = -34.0`
- **Visuals**:
  - Central .NET Core reactor: spinning wireframe icosahedron (`#512bd4`) enclosing an inner floating octahedron energy crystal (`#ff8a30`), framed by two orbital glowing rings (radii 3.8 and 4.4).
  - 11 interactive `TechNode`s arranged in an orbital ellipse (`radiusX = 5.2`, `radiusY = 2.8`).
  - Each node features an octahedron polyhedral mesh, glass badge, skill name, level, category color, description, connecting laser ray line to the core, and hover sound triggers.

### 7. Project Lab & ITI Academic Branch
- **Component**: [`src/components/sections/ProjectsScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/ProjectsScene.tsx)
- **Position**: `Z = -46.0`
- **Visuals**:
  - *Left Wing (Rotating Carousel)*: 6 featured projects arranged in a circle of radius 4.5. As the user scrolls through `WORLD.SCROLL_PROJECTS`, the carousel rotates smoothly to face each project towards the camera. Each podium hosts either an interactive 3D diorama (`SmartGarage`, `RoboticsSystem`, `CinaVerse`, `SmartNursery`) or a production cyber core pedestal.
  - *Right Wing (`ITIProjectsBranch`)*: Dark glass panel showcasing 17 3D red folders for ITI React.js assignments. Clicking any folder opens a glass modal that executes a live GitHub API query to fetch files and directories from the assignment repository.

### 8. Experience Hall
- **Component**: [`src/components/sections/ExperienceScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/ExperienceScene.tsx)
- **Position**: `Z = -70.0`
- **Visuals**:
  - Architectural dark chamber backdrop (28 × 14 units).
  - Central glowing vertical timeline rail (`#38bdf8`).
  - 3 floating 3D milestone blocks (`ExperienceNode`) alternating left and right:
    1. **Pharaoxon** (2023 — 2024): Junior .NET Developer — C# WinForms, .NET Framework, SQL Server ERP.
    2. **Information Technology Institute (ITI)** (Jul 2025 — Aug 2025): .NET Developer Intern — ASP.NET MVC, REST APIs, SQL Server.
    3. **OI Robotics** (2024 — Present): Software Leader & Instructor — Mentoring 3 teams, 3x 1st-place wins, ROS radar robots, smart incubators, EEG wheelchairs.

### 9. Achievements Chamber
- **Component**: [`src/components/sections/AchievementsScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/AchievementsScene.tsx)
- **Position**: `Z = -82.0`
- **Visuals**:
  - Chamber backdrop isolating room depth.
  - 4 display pedestals holding rotating 3D metallic trophies (chalice cup, handles, stepped base, floating star emblem) with dedicated spotlights:
    1. **ICT 2025 Exhibition**: Official Exhibitor for Robotics & Embedded Systems.
    2. **Hackathon Benha**: 2nd Place Silver Medal in Health Track (Smart Incubator).
    3. **National Robotics Competitions**: 3x 1st Place Champion (PESD 2025, Pixel 2025, Science Clubs).
    4. **Microsoft Learn Certifications**: Certified in C#, ASP.NET Core Web APIs, and Cloud-Native Microservices.

### 10. Contact Terminals
- **Component**: [`src/components/sections/ContactScene.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/ContactScene.tsx)
- **Position**: `Z = -94.0`
- **Visuals**:
  - Giant 3D typography: `// COMMENCE COLLABORATION`, `LET'S BUILD`, `SOMETHING.`
  - Background dual rotating energy torus rings.
  - 4 interactive glass terminals (`ContactTerminal`):
    - **EMAIL**: `mailto:ah4482336@gmail.com`
    - **LINKEDIN**: `https://www.linkedin.com/in/ahmed-hamada-saad/`
    - **GITHUB**: `https://github.com/F3raon`
    - **WHATSAPP**: `https://wa.me/201091626367`
  - Clicking any terminal triggers an audio selection chime and opens the link via `window.open`.

### 11. Final Portal
- **Component**: [`src/components/sections/PortfolioPortal.tsx`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/components/sections/PortfolioPortal.tsx)
- **Position**: `Z = -106.0`
- **Visuals**:
  - 3 massive counter-rotating energy rings (radii 5.8, 5.4, 5.0) framing a 3D Lab Monitor bezel.
  - Embedded inside the monitor is a 1280 × 720 interactive viewport displaying Ahmed's previous production portfolio (`https://ahmed-hamada-eta.vercel.app`) using Drei's `<Html transform distanceFactor={2.5}>`.
  - Conditioned on `scrollStore.current > 0.85` to avoid DOM occlusion artifacts during earlier journey phases.

---

## Project Showcase

The table below reflects all projects defined in [`src/data/projects.ts`](file:///d:/Development/ITI%20GRAD/ahmed-Hamada-3d-react/src/data/projects.ts):

| Project | Category | Technologies | Status | Link |
|---|---|---|---|---|
| **Axon ERP System** | Production | ASP.NET Core 10, Clean Architecture, JWT, EF Core, Next.js | Live Demo & API | [Live Demo](https://axon-erp-one.vercel.app/) / [Swagger API](https://axon-api.runasp.net/swagger) |
| **EduSaaS API** | Production | ASP.NET Core, SQL Server, JWT Auth, REST API, Swagger | API Demo | [Swagger API](https://edusaas-api.runasp.net/Swagger) |
| **Pills Dispenser API** | Production | ASP.NET Core, IoT Backend, Hardware Integration, SQL Server | API Demo (IoT) | [Swagger API](https://pills-despinser.runasp.net/swagger/index.html) |
| **Koky Sweets E-Commerce** | Production | ASP.NET Core 8 MVC, Clean Architecture, SignalR, EF Core, Leaflet.js | Live Demo | [Live Demo](https://koky-sweets.runasp.net/) |
| **StudentEcho Platform** | Production | ASP.NET Core 8 MVC, Clean Architecture, Google OAuth 2.0, CQRS | Live Demo | [Live Demo](https://student-echo.runasp.net/) |
| **Muslimy Islamic Platform** | Production | ASP.NET Core 8 MVC, Clean Architecture, CQRS, MediatR | Live Demo | [Live Demo](https://muslimy-app.runasp.net/) |
| **Desktop ERP (Pharaoxon)** | Production | C#, .NET Framework, SQL Server, WinForms, DevExpress | Desktop System | Deployed at Pharaoxon |
| **Smart Autonomous Garage 3D** | Miniature Diorama | Computer Vision, Python, OpenCV, IoT Sensors, 3D Diorama | 3D Prototype | Interactive in-scene 3D diorama |
| **Autonomous Robotics Rover 3D** | Miniature Diorama | ROS, Python, LiDAR SLAM, Robotics Hardware, 3D Diorama | 3D Prototype | Interactive in-scene 3D diorama (1st Place ARC Egypt) |
| **CinaVerse ERP Cloud Terminal** | Miniature Diorama | .NET 8, Clean Architecture, SQL Server, 3D Diorama | 3D Prototype | Interactive in-scene 3D diorama |
| **Smart Nursery Incubator 3D** | Miniature Diorama | Embedded Systems, IoT, Sensors, Vital Monitoring, 3D Diorama | 3D Prototype | Interactive in-scene 3D diorama |
| **ITI Assignments Academic Branch** | Academic | React.js, GitHub REST API, 3D Folders | Academic Portal | [GitHub Repository](https://api.github.com/repos/F3raon/ITI-react.js-Assignments) |

---

## Character Transformation

### Technical Architecture
The character transition from **Real Ahmed** to **Neon Ahmed** is implemented as a **Shader-based Flashlight Reveal and Crossfade** on a single 2D plane (`planeGeometry args={[2.15, 4.1]}` on desktop; `[1.55, 3.0]` on mobile) mounted onto a 3D dais.

It is **NOT** a 3D polygonal human mesh morph.

### The GLSL Shader Implementation
The custom shader (`AhmedCharacter.tsx`) binds two high-resolution textures (`/models/REAL_AHMED.png` and `/models/NEON_AHMED.png`):

```glsl
uniform sampler2D tReal;
uniform sampler2D tNeon;
uniform vec2 uMouse;
uniform float uHover;
uniform float uProgress;
uniform float uRadius;
uniform float uSmoothness;
uniform float uAspect;

varying vec2 vUv;

void main() {
  vec4 realColor = texture2D(tReal, vUv);
  vec4 neonColor = texture2D(tNeon, vUv);

  vec2 uv = vUv;
  vec2 mouse = uMouse;
  uv.y /= uAspect;
  mouse.y /= uAspect;

  // 1. Mouse hover radial circular mask (Flashlight reveal)
  float dist = distance(uv, mouse);
  float hoverMask = (1.0 - smoothstep(uRadius - uSmoothness, uRadius, dist)) * uHover;

  // 2. Scroll-based smoothstep crossfade (active between progress 0.35 and 0.65)
  float scrollMask = smoothstep(0.35, 0.65, uProgress);

  // 3. Combined mask clamped between 0 and 1
  float finalMask = clamp(hoverMask + scrollMask, 0.0, 1.0);

  vec4 finalColor = mix(realColor, neonColor, finalMask);
  if (finalColor.a < 0.05) discard;

  gl_FragColor = finalColor;
}
```

### Transformation Triggers
1. **Mouse Hover (Flashlight Reveal)**: Hovering cursor over the portrait creates a localized circular aperture of radius `0.35` displaying the neon layer.
2. **Scroll Travel (Automatic Crossfade)**: Scrolling through `WORLD.SCROLL_CHARACTER` (`0.26 – 0.48`) drives `uProgress` from 0.0 to 1.0, cleanly transitioning the entire portrait into full Neon Ahmed between 0.35 and 0.65.
3. **Manual Conduit Buttons**: Clicking any of the 6 platform conduit lights toggles `manualOverride`, forcing the portrait to flip states regardless of scroll position.

---

## Assets Inventory

All static assets are located in the `public/` directory:

| Filename / Path | Size | Type | Usage |
|---|---|---|---|
| `public/models/REAL_AHMED.png` | 2.09 MB | PNG Image Cutout | High-res real photo used in `AhmedCharacter.tsx` |
| `public/models/NEON_AHMED.png` | 1.96 MB | PNG Image Cutout | Cyber neon stylized version used in `AhmedCharacter.tsx` |
| `public/ahmed-portrait.png` | 2.87 MB | PNG Image | Biometric portrait used in `AboutScene.tsx` |
| `public/images/ahmed-real.png` | 2.24 MB | PNG Image | High-res source image |
| `public/images/ahmed-concept-1.png` | 2.49 MB | PNG Image | Concept visual asset |
| `public/images/ahmed-concept-2.png` | 2.42 MB | PNG Image | Concept visual asset |
| `public/images/character/` (37 files) | ~5 MB | PNG Sprite Strips | Legacy sprites (`pose_0..7`, `stage_*`, `trans_card_*`) from earlier 360-degree rotation prototype |

> **Note on 3D Models & Audio**:  
> - There are **ZERO** `.glb`, `.gltf`, `.obj`, or `.fbx` files in the repository. All 3D objects (office, computers, robot rover, trophies, reactors, dioramas) are generated procedurally with Three.js geometry primitives.  
> - There are **ZERO** `.mp3`, `.wav`, or `.ogg` audio files. All sound effects and background ambient drones are synthesized in real time via the Web Audio API.

---

## Design System

### Color Palette
- **Deep Space Void**: `#010306` (loader), `#020507` (fog & background), `#030507` (HTML body)
- **Dark Glass Surface**: `#05080c` / `#080d14` / `#0f172a` (roughness 0.1, metalness 0.9, transmission 0.6 – 0.9, clearcoat 1.0)
- **Primary Electric Cyan**: `#00f0ff` / `#38bdf8` / `#67c9ff` (accent lines, rings, UI tags, glow halos)
- **Secondary Cyber Amber**: `#ff8a30` / `#f59e0b` / `#ffc83b` (warm key lights, podium borders, trophies)
- **.NET Core Purple**: `#512bd4` / `#7c3aed` / `#a855f7` (central reactor, CQRS/MediatR nodes)
- **Bio Emerald Green**: `#10b981` / `#34d399` (IoT greenhouse, ERP active state, audio active indicator)
- **Alert Crimson Red**: `#ef4444` / `#dc2626` (ITI assignment folders, garage barrier light)

### Typography
- Monospace technical labels: uppercase, letter-spacing `0.15em – 0.3em`, technical prefixes (`//`).
- Sans-serif display headers: font weights 800 and 900, rendered via `@react-three/drei`'s SDF font pipeline for crisp rendering at all camera distances.

---

## Responsive Design

- **Mobile Viewport Detection**: Computed via `aspect = size.width / Math.max(1, size.height) < 1.0` or `size.width < 768`.
- **Dynamic Camera Framing**:
  - Desktop FOV: 54°
  - Tablet FOV: 60°
  - Mobile FOV: 68°
  - Camera automatically backs away along its viewing vector (`pullback`) for narrow aspect ratios to keep full scene compositions visible.
- **Section Layout Reflows**:
  - *Hero Title*: Responsive font clamp (`nameFontSize` 0.52 → 0.38).
  - *About Stats*: Plates collapse to mobile-friendly horizontal spans.
  - *Skills Lab*: Orbital ellipse transforms from wide landscape (5.2 × 2.8) to tall portrait (2.8 × 4.8).
  - *Experience Hall*: Two alternating columns collapse into a single center-aligned vertical column (`x = 0`).
  - *Achievements Chamber*: Pedestals reflow into a compact 2x2 grid.
  - *HUD & Brand*: Bottom audio toggle and right-side scroll indicator scale down to 0.7x.
- **Pixel Ratio Clamping**: Canvas is explicitly configured with `dpr={[1, 1.5]}` to prevent GPU thermal throttling on high-DPI (3x) mobile displays.

---

## Performance Audit

| Component / System | Cost Rating | Architectural Consideration |
|---|---|---|
| **Postprocessing (Bloom, Noise, Vignette)** | High Cost | Uses `EffectComposer` with `mipmapBlur`. Wrapped in `<Suspense fallback={null}>` to prevent black screen crashes on shader compilation. |
| **Glass Material (`meshPhysicalMaterial`)** | High Cost | Transmission materials trigger internal off-screen render passes. Used strategically on podiums and dossier slabs. |
| **Embedded Iframe (`PortfolioPortal`)** | High Cost | CSS3D DOM projection synchronized with WebGL. Mitigated by conditionally mounting only when `scrollStore.current > 0.85`. |
| **Dynamic Point Lights (~16 lights)** | Medium Cost | Distributed across 114 units of depth. Three.js distance decay and distance fog isolate lights to their respective sections. |
| **Floating Dust & Particles** | Low Cost | Uses `THREE.InstancedMesh` with 4×4 segment low-poly sphere geometry. |
| **Procedural Geometry** | Low Cost | Primitives reuse shared geometries and moderate segment counts (12 to 24). |

---

## Error Handling

- **Postprocessing Safety Boundary**: The `<Effects />` component is wrapped inside `<Suspense fallback={null}>` in `World.tsx` to prevent WebGL context loss from crashing the entire Canvas.
- **IFrame CSS3D Occlusion Guard**: `PortfolioPortal.tsx` checks `scrollStore.current > 0.85` before mounting the `<Html>` node, preventing invisible DOM layers from blocking mouse events in earlier scenes.
- **GitHub API Fail-safe**: `ITIProjectsBranch.tsx` handles API errors gracefully in a `try/catch/finally` block, providing visual loading spinners and empty-state feedback.
- **Audio Context Suspension**: `soundEngine` handles browser autoplay policies by resuming suspended `AudioContext` only after user interaction.

---

## Known Issues

1. **GitHub API Unauthenticated Rate Limits (Medium Severity)**:
   - The ITI Assignments branch executes unauthenticated requests to `api.github.com`. GitHub limits unauthenticated client IPs to 60 requests per hour. Rapidly opening multiple folders may trigger HTTP 403 rate-limit errors.
2. **Texture Memory Footprint (Medium Severity)**:
   - PNG images (`REAL_AHMED.png`, `NEON_AHMED.png`, `ahmed-portrait.png`) total ~7 MB of uncompressed bitmap data. On slow network connections, initial asset download may take several seconds.
3. **Rollup Single Chunk Warning (Low Severity)**:
   - `dist/assets/index-DevHxsU4.js` is ~1.49 MB minified (~432 kB gzipped). Vite warns that the chunk exceeds 500 kB. This is typical for Three.js + R3F + Framer Motion applications, but can be improved with code splitting.

---

## Technical Risks

| Risk | Severity | Description & Mitigation |
|---|---|---|
| **CSS3D Iframe Pointer Hijacking** | High | Embedding an `<iframe>` within a 3D Canvas can capture mouse scroll events. Mitigated by conditionally rendering the iframe only at `scroll > 0.85` and disabling pointer events on parent overlays. |
| **Mobile GPU Overdraw** | Medium | Multiple overlapping point lights and postprocessing bloom can reduce frame rates on low-end mobile devices. Mitigated by clamping DPR to `[1, 1.5]` and reducing particle counts by 60%. |
| **Cross-Origin Iframe Restrictions** | Low | Embedded external websites that enforce strict `X-Frame-Options: SAMEORIGIN` or restrictive CSP headers cannot be embedded. The current target (`https://ahmed-hamada-eta.vercel.app`) permits iframe embedding. |

---

## Development History

Significant architectural milestones extracted from git history:
- **`c52cb3b`**: Initial mobile responsiveness implementation, touch pull-to-refresh bug prevention, and HUD scale adjustments.
- **`129ff69`**: Migration of existing custom styling to Tailwind CSS v4 architecture.
- **`14f60d4`**: Addition of cinematic post-processing bloom, atmospheric floating particles, boot loader, and Web Audio SFX.
- **`2c79a25`**: Implementation of Real → Neon character transformation driven by scroll progress.
- **`3274404`**: Hero stage rebuild: clean circular platform, rotating digital core, removal of non-standard geometries.
- **`b413b7e`**: Establishment of `src/data/world.ts` as the single source of truth for all world coordinates.
- **`0299923`**: Fog calibrated to `[6, 15]` to guarantee strict visual isolation between sections spaced 12 units apart.
- **`4330ce7`**: Character upgrade: interactive shader-based flashlight reveal on hover combined with scroll crossfade.
- **`1a185ae`**: Final portal upgrade: interactive 3D monitor with native embedded iframe.
- **`e375579`**: ITI Academic Branch added to Projects Scene with 3D folders and GitHub REST API integration.
- **`c0174e8`**: Portfolio data synchronized with latest ATS CV and Projects layout alignment.

---

## Installation

Clone the repository and install dependencies using Node.js (v18+ recommended):

```bash
# Clone the repository
git clone https://github.com/F3raon/ITI-Graduation.git

# Enter project directory
cd ITI-Graduation

# Install dependencies
npm install
```

---

## Development

Run the local Vite development server:

```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Production Build

To build the production bundle:

```bash
# Runs TypeScript compiler check then builds with Vite
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

- **Platform**: Designed for static hosting on **Vercel**, **Netlify**, or **GitHub Pages**.
- **Build Command**: `npm run build` (`tsc -b && vite build`)
- **Output Directory**: `dist`
- **Node Version**: Node 18+ or 20+

### Environment Variables
**No environment variables are currently required.** The application runs as a self-contained static client.

---

## Project Structure

```
├── public/
│   ├── models/
│   │   ├── REAL_AHMED.png          # Real photo cutout texture
│   │   └── NEON_AHMED.png          # Cyber neon cutout texture
│   ├── images/                     # Concept imagery & sprite strip assets
│   │   └── character/              # Legacy sprite animation frames
│   └── ahmed-portrait.png          # Biometric portrait for About scene
│
├── src/
│   ├── main.tsx                    # React DOM entry point
│   ├── Portfolio.tsx               # Root component: Canvas, HUD, Providers
│   ├── styles.css                  # Global styles & Tailwind v4 imports
│   │
│   ├── context/
│   │   └── ScrollContext.tsx       # Mutable scroll store & event listeners
│   │
│   ├── data/                       # Single source of truth data files
│   │   ├── world.ts                # World coordinates & camera waypoints
│   │   ├── identity.ts             # Biography, stats & contact info
│   │   ├── skills.ts               # 11 skill nodes & proficiency levels
│   │   ├── projects.ts             # 11 projects & diorama definitions
│   │   ├── experience.ts           # Career roles & responsibilities
│   │   ├── achievements.ts         # Honors, awards & certifications
│   │   ├── portfolio.ts            # Aggregated data export
│   │   └── index.ts                # Data barrel export
│   │
│   ├── components/
│   │   ├── scene/                  # Global 3D scene elements
│   │   │   ├── World.tsx           # Assembles 3D universe & fog
│   │   │   ├── CameraRig.tsx       # Sole camera authority & spline motion
│   │   │   ├── Lighting.tsx        # Point lights, key light, light beams
│   │   │   ├── Environment.tsx     # City skyline & star particles
│   │   │   ├── Effects.tsx         # Postprocessing Bloom, Noise, Vignette
│   │   │   └── FloatingParticles.tsx # InstancedMesh atmospheric dust
│   │   │
│   │   ├── office/                 # Procedural 3D developer setup (Z = 0)
│   │   │   ├── Office.tsx          # Architecture, walls, floor, racks
│   │   │   ├── Desk.tsx            # Heavy desk surface, legs, lamp
│   │   │   ├── Monitors.tsx        # Triple displays with live animations
│   │   │   ├── PC.tsx              # Tower chassis, fans, water cooling
│   │   │   ├── Props.tsx           # Keyboard, mouse, robot, coffee, Pi
│   │   │   └── Character.tsx       # Chair & seated 3D developer
│   │   │
│   │   ├── character/              # Ahmed Character & Transformation (Z = -10)
│   │   │   ├── AhmedCharacter.tsx  # Custom GLSL flashlight reveal shader
│   │   │   ├── CharacterLighting.tsx # Dynamic key/rim color interpolation
│   │   │   ├── CharacterParticles.tsx # Dais electric particles
│   │   │   ├── CharacterEffects.tsx # Pulsing energy rings
│   │   │   └── [Legacy prototypes] # CharacterModal, CharacterController, etc.
│   │   │
│   │   ├── projects/               # 3D Project Dioramas & Podiums (Z = -46)
│   │   │   ├── ProjectPodium.tsx   # Glass pedestal & info slab
│   │   │   ├── SmartGarage.tsx     # 3D Garage with barrier gate
│   │   │   ├── RoboticsSystem.tsx  # 3D Rover with spinning LiDAR & arm
│   │   │   ├── CinaVerse.tsx       # 3D Laptop terminal with movie cards
│   │   │   ├── SmartNursery.tsx    # 3D Geodesic dome with flora
│   │   │   └── ITIProjectsBranch.tsx # 17 3D Folders & GitHub API modal
│   │   │
│   │   ├── sections/               # Primary 3D Scene Waypoints
│   │   │   ├── IntroScene.tsx      # Z = +8.0
│   │   │   ├── CharacterScene.tsx  # Z = -10.0
│   │   │   ├── AboutScene.tsx      # Z = -22.0
│   │   │   ├── SkillsScene.tsx     # Z = -34.0
│   │   │   ├── ProjectsScene.tsx   # Z = -46.0
│   │   │   ├── ExperienceScene.tsx # Z = -70.0
│   │   │   ├── AchievementsScene.tsx # Z = -82.0
│   │   │   ├── ContactScene.tsx    # Z = -94.0
│   │   │   └── PortfolioPortal.tsx # Z = -106.0
│   │   │
│   │   └── ui/                     # 2D DOM Overlays & HUD
│   │       ├── Loader.tsx          # Dual-ring SVG boot loader
│   │       ├── ScrollTrack.tsx     # Right-edge holographic sector scrub bar
│   │       └── SoundToggle.tsx     # Audio synthesis mute/unmute control
│   │
│   ├── utils/
│   │   └── audio.ts                # Web Audio API procedural sound engine
│   │
│   └── hooks/
│       ├── useCharacterCamera.ts   # Modular camera utilities
│       ├── useCharacterInteraction.ts # Interaction state hook
│       ├── useMouseParallax.ts     # Mouse parallax calculator
│       └── useTransformationProgress.ts # Transformation state hook
│
├── package.json                    # Dependencies and build scripts
├── vite.config.ts                  # Vite build configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.js              # Tailwind configuration
├── postcss.config.js               # PostCSS configuration
├── index.html                      # HTML entry template
└── README.md                       # Comprehensive documentation
```

---

## Configuration

- **`vite.config.ts`**:
  - Plugin: `@vitejs/plugin-react`
  - Host enabled (`host: true`), port `5173`.
  - File watcher ignores `**/Prompts/**` and `**/.git/**`.
- **`tsconfig.json`**:
  - Target: `ES2022`
  - Module Resolution: `Bundler`
  - Strict mode enabled (`strict: true`)
  - No emit (`noEmit: true`), JSX set to `react-jsx`.

---

## Future Roadmap

### Current (Implemented & Verified)
- Continuous 3D world navigation along 114 units of depth.
- Sole-authority spline camera with responsive pullback and banking.
- Complete procedural 3D developer office with seated character.
- GLSL shader-based cursor flashlight reveal & scroll crossfade for character transformation.
- 4 interactive 3D dioramas (Garage, Rover, Laptop, Nursery).
- 17 ITI assignment folders with live GitHub API directory fetching.
- Web Audio API procedural sound generator.
- Distance fog section isolation.
- Embedded original portfolio via 3D CRT monitor iframe.

### Next (Near-Term Technical Opportunities)
- **Asset Optimization**: Convert 7 MB of PNG textures (`REAL_AHMED.png`, `NEON_AHMED.png`, `ahmed-portrait.png`) into compressed WebP or KTX2/Basis formats to cut asset load time by ~75%.
- **GitHub API Caching**: Cache ITI session directory responses in `sessionStorage` or build a pre-generated JSON manifest to avoid the 60 req/hour rate limit on public GitHub endpoints.
- **Rollup Chunk Splitting**: Configure `build.rollupOptions.output.manualChunks` in `vite.config.ts` to separate Three.js / Drei vendor code from application logic, resolving the 1.49 MB bundle warning.

### Future (Long-Term Explorations)
- **Rigged Humanoid 3D Avatar**: Integrate a rigged GLTF character model with Mixamo animations (sitting, typing, standing, waving) as an alternative to the 2D cutout plane.
- **Physics Engine Integration**: Optional lightweight Rapier physics (`@react-three/rapier`) for interactive floating objects in the Project Lab and Skills Reactor.
- **Mobile Touch Controls Upgrade**: Virtual on-screen joystick or smooth swipe momentum physics for enhanced mobile browsing.

---

## Credits

- **Architecture, Code & Engineering**: [Ahmed Hamada](https://github.com/F3raon)
- **Technologies**: React, Three.js, React Three Fiber, React Three Drei, Tailwind CSS, Vite
- **Institution**: Information Technology Institute (ITI) Graduation Project

---

## License

This project is licensed under the [MIT License](LICENSE).
