export interface SkillNode {
  name: string;
  level: string;
  category: 'core' | 'backend' | 'ai-robotics' | 'web-devops' | 'frontend';
  color: string;
  description: string;
  iconUrl?: string;
}

export const SKILLS_DATA: SkillNode[] = [
  {
    name: '.NET / C#',
    level: 'Advanced',
    category: 'core',
    color: '#00f0ff',
    description: 'Core Backend Languages',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg'
  },
  {
    name: 'Clean Architecture',
    level: 'Advanced',
    category: 'backend',
    color: '#38bdf8',
    description: 'System Scalability',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg'
  },
  {
    name: 'SQL Server & EF Core',
    level: 'Advanced',
    category: 'backend',
    color: '#a855f7',
    description: 'Data Systems & Integrity',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-original.svg'
  },
  {
    name: 'ASP.NET Core',
    level: 'Production',
    category: 'backend',
    color: '#818cf8',
    description: 'REST APIs & MVC',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dotnetcore/dotnetcore-original.svg'
  },
  {
    name: 'SignalR & Real-time',
    level: 'Proficient',
    category: 'backend',
    color: '#00f0ff',
    description: 'Live Tracking & Sockets',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/socketio/socketio-original.svg'
  },
  {
    name: 'CQRS & MediatR',
    level: 'Advanced',
    category: 'backend',
    color: '#ffffff',
    description: 'Design Patterns',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg'
  },
  {
    name: 'Python',
    level: 'Proficient',
    category: 'ai-robotics',
    color: '#ffffff',
    description: 'Automation & AI',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'
  },
  {
    name: 'Robotics (ROS)',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#a855f7',
    description: 'Hardware/Software Interfacing',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ubuntu/ubuntu-original.svg'
  },
  {
    name: 'IoT',
    level: 'Experienced',
    category: 'ai-robotics',
    color: '#38bdf8',
    description: 'Smart Systems & Sensors',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/raspberrypi/raspberrypi-original.svg'
  },
  {
    name: 'Git & GitOps',
    level: 'Proficient',
    category: 'web-devops',
    color: '#818cf8',
    description: 'Deployment & Versioning',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg'
  },
  {
    name: 'HTML & CSS',
    level: 'Advanced',
    category: 'frontend',
    color: '#f06529',
    description: 'Web Structure & Styling',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg'
  },
  {
    name: 'JavaScript',
    level: 'Advanced',
    category: 'frontend',
    color: '#f7df1e',
    description: 'Dynamic Interactivity',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg'
  },
  {
    name: 'Bootstrap',
    level: 'Proficient',
    category: 'frontend',
    color: '#7952b3',
    description: 'Responsive Layouts',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bootstrap/bootstrap-original.svg'
  },
  {
    name: 'Tailwind CSS',
    level: 'Proficient',
    category: 'frontend',
    color: '#38bdf8',
    description: 'Utility-first Styling',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg'
  },
  {
    name: 'React.js',
    level: 'Advanced',
    category: 'frontend',
    color: '#61dafb',
    description: 'UI Components & State',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
  },
  {
    name: 'Next.js',
    level: 'Proficient',
    category: 'frontend',
    color: '#ffffff',
    description: 'SSR & Fullstack React',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg'
  },
];
