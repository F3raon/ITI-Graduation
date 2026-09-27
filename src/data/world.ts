/**
 * WORLD COORDINATE SYSTEM — Single Source of Truth
 *
 * All section Z positions are defined here.
 * CameraRig, World, and every section must reference these constants.
 *
 * Camera travels in the -Z direction as scroll progresses.
 * The camera stays 4–6 units in front of each section's Z origin.
 *
 * Naming convention:
 *   SECTION_Z   = center of the section's 3D group in world space
 *   SECTION_CAM = camera Z when framing that section
 */

export const WORLD = {
  // ── Section Z origins ─────────────────────────────────────────────────────
  INTRO_Z:        8,      // Intro portal / hero text
  OFFICE_Z:       0,      // Office desk & monitors
  CHARACTER_Z:   -10,     // Ahmed portrait dais center
  ABOUT_Z:       -22,     // About Me bio + portrait
  SKILLS_Z:      -34,     // Skills reactor
  PROJECTS_Z:    -46,     // Project podiums
  EXPERIENCE_Z:  -70,     // Experience timeline (shifted -12 to clear Projects carousel)
  ACHIEVEMENTS_Z:-82,     // Achievements chamber
  CONTACT_Z:     -94,     // Contact terminals
  PORTAL_Z:      -106,    // Final portal

  // ── Camera Z when focused on each section ─────────────────────────────────
  // Camera sits ~4-6 units in front (+Z) of the section origin
  CAM_INTRO:      13,
  CAM_OFFICE:      5,
  CAM_APPROACH:   -4,     // transitional — camera approaching Ahmed
  CAM_CHARACTER:  -5,     // Full framing of Ahmed portrait
  CAM_NEON:       -5.5,   // Neon transformation framing
  CAM_ARC_R:      -7,     // Gentle right arc
  CAM_EXIT:       -8,     // Camera exits character area
  CAM_ABOUT:     -17,
  CAM_SKILLS:    -29,
  CAM_PROJECTS:  -41,
  CAM_PROJECTS2: -44,
  CAM_EXPERIENCE:-65,
  CAM_ACHIEVEMENTS:-77,
  CAM_CONTACT:   -89,
  CAM_PORTAL:    -101,

  // ── Scroll progress mapped to each section ────────────────────────────────
  // Changing these also requires updating CameraRig keyframes
  SCROLL_INTRO:        [0.00, 0.14],
  SCROLL_OFFICE:       [0.14, 0.26],
  SCROLL_CHARACTER:    [0.26, 0.48],   // Real Ahmed + transformation
  SCROLL_ABOUT:        [0.48, 0.58],
  SCROLL_SKILLS:       [0.58, 0.66],
  SCROLL_PROJECTS:     [0.66, 0.76],
  SCROLL_EXPERIENCE:   [0.76, 0.84],
  SCROLL_ACHIEVEMENTS: [0.84, 0.90],
  SCROLL_CONTACT:      [0.90, 0.96],
  SCROLL_PORTAL:       [0.96, 1.00],
} as const;

/**
 * Helper: get normalized section progress (0→1) from global scroll
 */
export function sectionProgress(globalProgress: number, start: number, end: number): number {
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  return (globalProgress - start) / (end - start);
}
