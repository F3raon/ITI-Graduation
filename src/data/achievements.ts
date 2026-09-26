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
    id: 'arc-egypt',
    rank: '1ST PLACE GOLD',
    title: 'NATIONAL CHAMPION',
    competition: 'Arab Robotics Competition (ARC Egypt)',
    year: '2024',
    badge: '🏆 GOLD TROPHY',
    description:
      'Awarded 1st place nationwide for autonomous rover navigation, robotics engineering, and real-time computer vision algorithms.',
    color: '#ff8a30',
  },
  {
    id: 'huawei-ict',
    rank: 'NATIONAL FINALIST',
    title: 'CLOUD & NETWORK TRACK',
    competition: 'Huawei ICT Competition',
    year: '2023',
    badge: '🏅 HUAWEI HONORS',
    description:
      'Recognized for exceptional competence in enterprise cloud networking, infrastructure scalability, and data storage design.',
    color: '#ef4444',
  },
  {
    id: 'space-apps',
    rank: 'GLOBAL NOMINEE',
    title: 'AI TELEMETRY CHALLENGE',
    competition: 'NASA Space Apps Challenge',
    year: '2023',
    badge: '🚀 NASA NOMINEE',
    description:
      'Engineered an automated satellite sensor data processor and anomaly detector utilizing Python and machine learning algorithms.',
    color: '#38bdf8',
  },
  {
    id: 'robotech-summit',
    rank: 'TOP 3 FINALIST',
    title: 'INNOVATION EXCELLENCE',
    competition: 'RoboTech National Summit',
    year: '2023',
    badge: '🎖️ EXCELLENCE',
    description:
      'Recognized for exceptional embedded IoT architecture in the Smart Health & Automated Medication Dispensing category.',
    color: '#10b981',
  },
  {
    id: 'iti-grad',
    rank: 'HONOR GRADUATE',
    title: 'ENTERPRISE SOFTWARE TRACK',
    competition: 'Information Technology Institute (ITI)',
    year: '2023',
    badge: '🎓 ITI CERTIFIED',
    description:
      'Completed intensive enterprise development training with distinction in backend architecture, C#, and database systems.',
    color: '#a855f7',
  },
];
