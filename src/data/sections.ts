export const SECTIONS = [
  { id: 'ENTRY',        name: 'ENTRY',        start: 0.00, end: 0.14 },
  { id: 'OFFICE',       name: '3D OFFICE',    start: 0.14, end: 0.26 },
  { id: 'NEON',         name: 'NEON MORPH',   start: 0.26, end: 0.48 },
  { id: 'ABOUT',        name: 'ABOUT ME',     start: 0.48, end: 0.58 },
  { id: 'SKILLS',       name: 'SKILLS LAB',   start: 0.58, end: 0.66 },
  { id: 'PROJECTS',     name: 'PROJECT LAB',  start: 0.66, end: 0.76 },
  { id: 'EXPERIENCE',   name: 'EXPERIENCE',   start: 0.76, end: 0.84 },
  { id: 'ACHIEVEMENTS', name: 'ACHIEVEMENTS', start: 0.84, end: 0.90 },
  { id: 'CONTACT',      name: 'CONTACT',      start: 0.90, end: 0.96 },
  { id: 'PORTAL',       name: 'LIVE PORTAL',  start: 0.96, end: 1.00 },
];

export const SECTION_MAP = Object.fromEntries(SECTIONS.map(s => [s.id, s]));

export function getSection(progress: number) {
  // Clamp progress between 0 and 1
  const p = Math.max(0, Math.min(1, progress));
  
  // Find the active section
  for (const section of SECTIONS) {
    if (p >= section.start && p <= section.end) {
      return section;
    }
  }
  
  // Fallback to the last section if we're exactly at 1.0 and floating point math was weird
  return SECTIONS[SECTIONS.length - 1];
}

export function sectionProgress(globalProgress: number, section: { start: number, end: number }): number {
  if (globalProgress <= section.start) return 0;
  if (globalProgress >= section.end) return 1;
  return (globalProgress - section.start) / (section.end - section.start);
}
