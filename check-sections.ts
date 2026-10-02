import { SECTIONS, getSection } from './src/data/sections';

console.log('--- Verifying Sections ---');

let previousEnd = 0;
let isValid = true;

for (let i = 0; i < SECTIONS.length; i++) {
  const section = SECTIONS[i];
  
  // Check continuity
  if (Math.abs(section.start - previousEnd) > 0.0001) {
    console.error(`GAP OR OVERLAP DETECTED before ${section.name}: Expected start at ${previousEnd}, got ${section.start}`);
    isValid = false;
  }
  
  // Check midpoint mapping
  const midpoint = (section.start + section.end) / 2;
  const mappedSection = getSection(midpoint);
  if (mappedSection.name !== section.name) {
    console.error(`MIDPOINT MAPPING FAILED for ${section.name}: midpoint ${midpoint} mapped to ${mappedSection.name}`);
    isValid = false;
  }
  
  previousEnd = section.end;
}

if (Math.abs(previousEnd - 1.0) > 0.0001) {
  console.error(`TOTAL RANGE INCOMPLETE: Ends at ${previousEnd}, expected 1.0`);
  isValid = false;
}

if (isValid) {
  console.log('✅ SECTIONS ARE VALID! Contiguous from 0 to 1, midpoints map perfectly.');
} else {
  console.log('❌ SECTIONS HAVE ERRORS!');
}
