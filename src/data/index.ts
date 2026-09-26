import { IDENTITY_DATA } from './identity';
import { SKILLS_DATA } from './skills';
import { PROJECTS_DATA } from './projects';
import { EXPERIENCE_DATA } from './experience';
import { ACHIEVEMENTS_DATA } from './achievements';

export * from './identity';
export * from './skills';
export * from './projects';
export * from './experience';
export * from './achievements';

// Backward compatibility layer
export const PORTFOLIO_DATA = {
  identity: IDENTITY_DATA,
  stats: IDENTITY_DATA.stats,
  skills: SKILLS_DATA,
  projects: PROJECTS_DATA,
  experience: EXPERIENCE_DATA,
  achievements: ACHIEVEMENTS_DATA,
};
