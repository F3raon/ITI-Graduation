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
    color: '#512bd4',
    description: 'ASP.NET Core 8, Web API, Minimal APIs, Entity Framework Core, LINQ, Async/Await',
  },
  {
    name: 'Clean Architecture',
    level: 'Advanced',
    category: 'backend',
    color: '#ff8a30',
    description: 'Domain-Driven Design, CQRS, MediatR, Repository Pattern, Onion Architecture',
  },
  {
    name: 'SQL Server',
    level: 'Advanced',
    category: 'backend',
    color: '#e24a4a',
    description: 'T-SQL, Complex Queries, Stored Procedures, Indexes, DB Optimization & Migration',
  },
  {
    name: 'REST APIs & JWT',
    level: 'Production',
    category: 'backend',
    color: '#06b6d4',
    description: 'Role-based Auth, Refresh Tokens, Swagger UI, Global Error Handling, Rate Limiting',
  },
  {
    name: 'Python',
    level: 'Proficient',
    category: 'ai-robotics',
    color: '#3b82f6',
    description: 'Automation, AI data processing, scripts, integration with hardware & computer vision',
  },
  {
    name: 'AI & OpenCV',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#10b981',
    description: 'Computer vision, real-time object detection, image classification for smart systems',
  },
  {
    name: 'Robotics & ROS',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#ec4899',
    description: 'ROS / ROS2, autonomous navigation, sensor fusion, hardware actuator interfacing',
  },
  {
    name: 'Raspberry Pi / IoT',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#d946ef',
    description: 'Embedded Linux, GPIO, MQTT, serial protocol, smart dispensing & automation',
  },
  {
    name: 'React & Three.js',
    level: 'Intermediate',
    category: 'web-devops',
    color: '#38bdf8',
    description: 'Interactive 3D dashboards, WebGL interfaces, dynamic frontend client consumers',
  },
  {
    name: 'Git & Docker',
    level: 'Proficient',
    category: 'web-devops',
    color: '#f97316',
    description: 'Git workflows, GitHub Actions, Docker containerization, cloud deployment (MonsterASP/RunASP)',
  },
];
