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
    description: 'Core Backend Languages',
  },
  {
    name: 'Clean Architecture',
    level: 'Advanced',
    category: 'backend',
    color: '#38bdf8',
    description: 'System Scalability',
  },
  {
    name: 'SQL Server & EF Core',
    level: 'Advanced',
    category: 'backend',
    color: '#a855f7',
    description: 'Data Systems & Integrity',
  },
  {
    name: 'ASP.NET Core',
    level: 'Production',
    category: 'backend',
    color: '#818cf8',
    description: 'REST APIs & MVC',
  },
  {
    name: 'SignalR & Real-time',
    level: 'Proficient',
    category: 'backend',
    color: '#00f0ff',
    description: 'Live Tracking & Sockets',
  },
  {
    name: 'CQRS & MediatR',
    level: 'Advanced',
    category: 'backend',
    color: '#ffffff',
    description: 'Design Patterns',
  },
  {
    name: 'Python',
    level: 'Proficient',
    category: 'ai-robotics',
    color: '#ffffff',
    description: 'Automation & AI',
  },
  {
    name: 'Robotics (ROS)',
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
    description: 'Smart Systems & Sensors',
  },
  {
    name: 'Git & GitOps',
    level: 'Proficient',
    category: 'web-devops',
    color: '#818cf8',
    description: 'Deployment & Versioning',
  },
  {
    name: 'Windows Forms',
    level: 'Production',
    category: 'web-devops',
    color: '#a855f7',
    description: 'Desktop Apps & DevExpress',
  },
];
