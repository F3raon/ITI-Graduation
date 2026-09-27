export interface AchievementItem {
  id: string;
  rank: string;
  title: string;
  competition: string;
  year: string;
  badge: string;
  description: string;
  color: string;
}

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    id: 'ict-2025',
    rank: 'OFFICIAL EXHIBITOR',
    title: 'ROBOTICS & EMBEDDED SYSTEMS',
    competition: 'ICT 2025 Exhibition',
    year: '2025',
    badge: '🚀 TECH EXHIBITOR',
    description:
      'Showcased innovative robotics and embedded systems projects (autonomous robots, smart incubators) to industry professionals at ICT 2025.',
    color: '#ff8a30',
  },
  {
    id: 'hackathon-benha',
    rank: '2ND PLACE SILVER',
    title: 'HEALTH TRACK WINNER',
    competition: 'Hackathon Benha',
    year: '2024',
    badge: '🥈 SILVER MEDAL',
    description:
      'Achieved 2nd place nationwide in the Health Track for engineering an advanced smart infant incubator system (SmartIncubator).',
    color: '#ef4444',
  },
  {
    id: 'robotics-comps',
    rank: '3x FIRST PLACE',
    title: 'ROBOTICS LEADERSHIP',
    competition: 'Multiple National Competitions',
    year: '2024',
    badge: '🏆 CHAMPION',
    description:
      'Led 3 software teams across 5 competitions, securing three 1st-place wins, one 2nd place, and one 3rd place in PESD 2025, Pixel 2025, and Science Clubs.',
    color: '#38bdf8',
  },
  {
    id: 'ms-certifications',
    rank: 'CERTIFIED DEVELOPER',
    title: 'MICROSOFT LEARN CERTIFICATIONS',
    competition: 'Microsoft & freeCodeCamp',
    year: '2024',
    badge: '🏅 MS CERTIFIED',
    description:
      'Earned certifications in Foundational C#, Building Web APIs with ASP.NET Core, and Implementing Resiliency in Cloud-Native .NET Microservices.',
    color: '#10b981',
  },
  {
    id: 'sprints-camp',
    rank: 'SPECIALIZATION CERTIFICATES',
    title: 'SPRINTS X MICROSOFT CAMP',
    competition: 'Sprints Summer Camp',
    year: '2024',
    badge: '🎓 SPECIALIST',
    description:
      'Completed intensive training and earned specialization certificates in Programming using Python and Software Testing.',
    color: '#a855f7',
  },
];
