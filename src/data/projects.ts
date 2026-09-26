export interface ProjectItem {
  id: string;
  title: string;
  category: 'miniature' | 'production';
  tags: string[];
  description: string;
  highlights: string[];
  demoUrl?: string;
  githubUrl?: string;
  color: string;
  dioramaType?: 'garage' | 'robotics' | 'laptop' | 'nursery';
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'koky-sweets',
    title: 'KOKY SWEETS E-COMMERCE',
    category: 'production',
    tags: ['ASP.NET Core 8', 'MVC', 'SQL Server', 'SignalR', 'PayPal', 'TailwindCSS'],
    description:
      'A full-featured e-commerce platform for custom baked goods with real-time order tracking, payment gateway integration, responsive dashboard, and live notifications.',
    highlights: [
      'Built with ASP.NET Core 8 MVC, EF Core, and SQL Server',
      'Real-time order progress via SignalR',
      'Secure PayPal checkout & automated invoicing',
      'Comprehensive administrative analytics & stock control',
    ],
    demoUrl: 'https://koky-sweets.runasp.net/',
    githubUrl: 'https://github.com/F3raon/Koky-Sweets',
    color: '#ff8a30',
  },
  {
    id: 'erp-system',
    title: 'ENTERPRISE ERP SYSTEM',
    category: 'production',
    tags: ['C#', 'WinForms', 'SQL Server', 'Crystal Reports', 'Guna UI'],
    description:
      'A comprehensive Enterprise Resource Planning desktop software built for commercial businesses with multi-branch inventory, invoicing, CRM, and accounting.',
    highlights: [
      'Multi-branch warehouse stock tracking and auditing',
      'Automated financial reporting with Crystal Reports',
      'Granular role-based user permissions and audit trail logs',
      'High-throughput SQL Server schema handling 100k+ inventory rows',
    ],
    githubUrl: 'https://github.com/F3raon/ERP-System',
    color: '#3b82f6',
  },
  {
    id: 'axon-erp-api',
    title: 'AXON ERP API',
    category: 'production',
    tags: ['Clean Architecture', '.NET 8', 'REST API', 'CQRS', 'JWT'],
    description:
      'A high-performance enterprise REST API designed with Onion / Clean Architecture to power multi-tenant web and mobile client dashboards with high security.',
    highlights: [
      'Onion / Clean Architecture with Domain-Driven Design principles',
      'JWT token authentication with refresh tokens and claim-based access',
      'Automated Swagger documentation and API contract versioning',
      'Deployed live on RunASP hosting infrastructure',
    ],
    demoUrl: 'https://axon-api.runasp.net/swagger/index.html',
    githubUrl: 'https://github.com/F3raon/Axon-ERP-API',
    color: '#10b981',
  },
  {
    id: 'edusaas-api',
    title: 'EDUSAAS ACADEMY API',
    category: 'production',
    tags: ['ASP.NET Core', 'SQL Server', 'JWT Auth', 'REST API', 'Swagger'],
    description:
      'Backend infrastructure for educational institutes, managing student enrollments, course catalogs, grading rubrics, schedule calendars, and teacher assignments.',
    highlights: [
      'Full CRUD RESTful endpoints with validation pipelines',
      'Role-based authorization for Students, Instructors, and Admin staff',
      'Optimized database queries with EF Core and SQL indexing',
    ],
    demoUrl: 'https://edusaas-api.runasp.net/Swagger',
    githubUrl: 'https://github.com/F3raon/EduSaaS-API',
    color: '#8b5cf6',
  },
  {
    id: 'pills-dispenser',
    title: 'SMART PILLS DISPENSER API & IOT',
    category: 'production',
    tags: ['IoT Backend', 'ASP.NET Core', 'Hardware Integration', 'Raspberry Pi'],
    description:
      'An intelligent IoT medical dispenser backend that coordinates hardware motor drivers, patient dosage schedules, and caregiver alerts in real time.',
    highlights: [
      'Hardware communication with sensors and motorized dosage carousels',
      'Scheduled background cron tasks for prescription alarm dispatching',
      'Live patient compliance logging and emergency alerts',
    ],
    demoUrl: 'https://pills-despinser.runasp.net/swagger/index.html',
    githubUrl: 'https://github.com/F3raon/Pills-Dispenser',
    color: '#ec4899',
  },
  // 4 Interactive 3D Miniature Diorama Worlds
  {
    id: 'smart-garage-3d',
    title: 'SMART AUTONOMOUS GARAGE 3D',
    category: 'miniature',
    tags: ['Computer Vision', 'Python', 'OpenCV', 'IoT Sensors', '3D Diorama'],
    description:
      'An automated vehicle recognition and robotic parking system with license plate OCR and automated barrier mechanics.',
    highlights: [
      'Interactive 3D model with barrier gate, security sensor, and status lights',
      'Real-time vehicle slot occupancy tracking',
      'License plate OCR integration algorithms',
    ],
    color: '#ff8a30',
    dioramaType: 'garage',
  },
  {
    id: 'robotics-lab-3d',
    title: 'AUTONOMOUS ROBOTICS ROVER 3D',
    category: 'miniature',
    tags: ['ROS', 'Python', 'LiDAR SLAM', 'Robotics Hardware', '3D Diorama'],
    description:
      'Interactive robotic rover diorama with LiDAR sensor scanner, articulated robotic arm, and terrain navigation wheels.',
    highlights: [
      'Interactive spinning LiDAR ray sensor and 3-axis robot arm',
      'Winner of 1st place in ARC Egypt Robotics Competition',
      'Obstacle avoidance and mapping test bench',
    ],
    color: '#38bdf8',
    dioramaType: 'robotics',
  },
  {
    id: 'cinaverse-erp-3d',
    title: 'CINAVERSE ERP CLOUD TERMINAL',
    category: 'miniature',
    tags: ['.NET 8', 'Clean Architecture', 'SQL Server', '3D Diorama'],
    description:
      'Floating high-tech workstation terminal demonstrating enterprise backend architecture, database queries, and live logs.',
    highlights: [
      'Glowing holographic server rack with floating data nodes',
      'Live metric charts and microservices topology visualizer',
    ],
    color: '#10b981',
    dioramaType: 'laptop',
  },
  {
    id: 'smart-nursery-3d',
    title: 'SMART NURSERY INCUBATOR 3D',
    category: 'miniature',
    tags: ['Embedded Systems', 'IoT', 'Sensors', 'Vital Monitoring', '3D Diorama'],
    description:
      'Intelligent medical incubator with vital telemetry monitoring, temperature regulation, and automated emergency triggers.',
    highlights: [
      'Interactive medical capsule with vital wave pulse visualization',
      'Automated climate stability feedback control loop',
    ],
    color: '#c084fc',
    dioramaType: 'nursery',
  },
];
