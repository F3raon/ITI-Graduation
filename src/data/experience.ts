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
    period: '2023 — 2024',
    role: 'JUNIOR .NET DEVELOPER -- WINFORMS & BACKEND',
    company: 'PHARAOXON',
    location: 'Egypt',
    details: [
      'Developed a custom ERP desktop application using C# WinForms and .NET Framework covering sales, inventory, finance, and reporting modules tailored to the company\'s internal operations.',
      'Built and maintained backend business logic and data access layers using SQL Server, ensuring data integrity and performance across core system modules.',
      'Collaborated directly with stakeholders to gather requirements, iterate on features, and deliver a production-ready internal tool used daily by the company.',
    ],
    tech: ['C#', 'WinForms', '.NET Framework', 'SQL Server', 'ERP Systems'],
  },
  {
    period: 'JUL 2025 — AUG 2025',
    role: '.NET DEVELOPER INTERN',
    company: 'INFORMATION TECHNOLOGY INSTITUTE (ITI)',
    location: 'Suez Canal Branch, Egypt',
    details: [
      'Developed full-stack web applications using ASP.NET MVC and SQL Server as part of a structured training program.',
      'Built and consumed REST APIs, implemented CRUD operations, and applied MVC architectural patterns in real project scenarios.',
      'Collaborated with team members on database design, data modeling, and application debugging under mentor supervision.',
    ],
    tech: ['ASP.NET MVC', 'REST APIs', 'SQL Server', 'CRUD', 'Data Modeling'],
  },
  {
    period: '2024 — PRESENT',
    role: 'SOFTWARE LEADER & INSTRUCTOR',
    company: 'OI ROBOTICS',
    location: 'Egypt',
    details: [
      'Led and mentored 3 software teams across 5 competitions, achieving 3 first-place wins, 1 second place, and 1 third place.',
      'Achieved 2nd place at Hackathon Benha (Health Track) and participated in PESD 2025, Pixel 2025, and Science Clubs Competition.',
      'Served as Exhibitor at ICT 2025, showcasing innovative robotics and embedded systems projects to industry professionals.',
      'Engineered advanced robotics projects including: an autonomous radar-guided herbicide robot (ROS), a mine-detection robot, a smart infant incubator, and a wheelchair controlled via eye movement and brain neural signals (EEG).',
      'Developed IoT systems including Human-eBot, Garden Tower v1 & v2, and delivered technical training sessions in programming, embedded systems, and robotics.',
    ],
    tech: ['ROS', 'IoT', 'Embedded Systems', 'Leadership', 'Hardware Integration'],
  },
];
