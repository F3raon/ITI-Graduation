export interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  location: string;
  details: string[];
  tech: string[];
}

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    period: '2024 — PRESENT',
    role: '.NET BACKEND DEVELOPER',
    company: 'FREELANCE & ENTERPRISE CLIENTS',
    location: 'Remote / Cairo, Egypt',
    details: [
      'Architected and deployed enterprise ERP and multi-branch inventory solutions using ASP.NET Core 8 and SQL Server.',
      'Designed high-throughput REST APIs utilizing Clean Architecture, CQRS, and MediatR with JWT security.',
      'Shipped live commercial platforms including Koky Sweets with SignalR real-time order workflows.',
    ],
    tech: ['ASP.NET Core', 'C#', 'SQL Server', 'Clean Architecture', 'SignalR', 'REST APIs'],
  },
  {
    period: '2023 — 2024',
    role: 'SOFTWARE AI & EMBEDDED LEAD // ADVISOR',
    company: 'OI ROBOTICS',
    location: 'Egypt',
    details: [
      'Engineered autonomous ground rover navigation using ROS, Python, and sensor telemetry.',
      'Led the software and hardware integration for the national ARC Egypt competition team, winning 1st place.',
      'Mentored and advised junior robotics engineers on computer vision algorithms and embedded firmware.',
    ],
    tech: ['Python', 'ROS', 'OpenCV', 'Raspberry Pi', 'C++', 'Microcontrollers'],
  },
  {
    period: '2023',
    role: 'FRONT END DEVELOPER // VICE LEAD',
    company: 'MSP TECH CLUB AL-AZHAR',
    location: 'Cairo, Egypt',
    details: [
      'Spearheaded technical workshops and web development training sessions for 200+ student developers.',
      'Built responsive web interfaces and coordinated student hackathon project deliveries.',
    ],
    tech: ['JavaScript', 'React', 'HTML5/CSS3', 'Git', 'Leadership'],
  },
  {
    period: '2022 — 2023',
    role: 'FRONT END DEVELOPER // LEAD',
    company: 'GOOGLE DEVELOPER STUDENT CLUBS (GDSC)',
    location: 'Egypt',
    details: [
      'Organized developer study jams and open-source coding sprints.',
      'Developed interactive client-side web applications and API integrations.',
    ],
    tech: ['Web Development', 'Git', 'API Integration', 'UI/UX'],
  },
  {
    period: '2023',
    role: 'ENTERPRISE SOFTWARE SCHOLAR',
    company: 'INFORMATION TECHNOLOGY INSTITUTE (ITI)',
    location: 'Suez Canal / Egypt',
    details: [
      'Completed intensive enterprise development track covering OOP, database optimization, and Clean Architecture.',
      'Collaborated on multi-tier application architectures with modern code quality standards.',
    ],
    tech: ['.NET Core', 'C#', 'SQL Server', 'Design Patterns'],
  },
];
