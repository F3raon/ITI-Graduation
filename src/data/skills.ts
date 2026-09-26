export interface SkillNode {
  name: string;
  level: string;
  category: 'core' | 'backend' | 'ai-robotics' | 'web-devops';
  color: string;
  description: string;
}

export const SKILLS_DATA: SkillNode[] = [
  {
    name: '.NET / C#',
    level: 'Advanced',
    category: 'core',
    color: '#00f0ff',
    description: 'Backend Logic & Architecture',
  },
  {
    name: 'Clean Architecture',
    level: 'Advanced',
    category: 'backend',
    color: '#38bdf8',
    description: 'System Scalability',
  },
  {
    name: 'SQL Server',
    level: 'Advanced',
    category: 'backend',
    color: '#a855f7',
    description: 'Data Systems & Integrity',
  },
  {
    name: 'REST APIs',
    level: 'Production',
    category: 'backend',
    color: '#818cf8',
    description: 'Services & Integration',
  },
  {
    name: 'Python',
    level: 'Proficient',
    category: 'ai-robotics',
    color: '#ffffff',
    description: 'Automation & AI',
  },
  {
    name: 'AI & OpenCV',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#00f0ff',
    description: 'Computer Vision',
  },
  {
    name: 'Robotics',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#a855f7',
    description: 'Hardware/Software Interfacing',
  },
  {
    name: 'IoT',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#38bdf8',
    description: 'Smart Systems & MQTT',
  },
  {
    name: 'React',
    level: 'Intermediate',
    category: 'web-devops',
    color: '#ffffff',
    description: 'Interactive Interfaces',
  },
  {
    name: 'Git & Docker',
    level: 'Proficient',
    category: 'web-devops',
    color: '#818cf8',
    description: 'Deployment & Containers',
  },
];
