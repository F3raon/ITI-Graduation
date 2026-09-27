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
    id: 'axon-erp-api',
    title: 'AXON ERP SYSTEM',
    category: 'production',
    tags: ['ASP.NET Core 10', 'Clean Architecture', 'JWT', 'EF Core', 'Next.js'],
    description:
      'Architected a full multi-module ERP backend from scratch using Clean Architecture (Domain, Application, Infrastructure, API) serving a Next.js frontend, covering Auth, Inventory, Sales, Purchases, POS, HR, Accounting, CRM, and Maintenance modules.',
    highlights: [
      'Implemented JWT role-based authorization with 7 roles (Admin, Cashier, Salesman, Technician, Warehouse, Auditor, Owner)',
      'FluentValidation on all DTOs and global ProblemDetails error handling',
      'Reusable pagination/filtering/sorting pattern across all endpoints',
    ],
    demoUrl: 'https://axon-erp-one.vercel.app/',
    githubUrl: 'https://axon-api.runasp.net/swagger', // Using GitHub field for API docs link
    color: '#10b981',
  },
  {
    id: 'edusaas-api',
    title: 'EDUSAAS API',
    category: 'production',
    tags: ['ASP.NET Core', 'SQL Server', 'JWT Auth', 'REST API', 'Swagger'],
    description:
      'Designed and built a RESTful API for a SaaS-based educational platform covering course management, user enrollment, and role-based authorization.',
    highlights: [
      'Full Swagger/OpenAPI documentation',
      'JWT authentication and role-based authorization',
    ],
    demoUrl: 'https://edusaas-api.runasp.net/Swagger',
    color: '#8b5cf6',
  },
  {
    id: 'pills-dispenser',
    title: 'PILLS DISPENSER API',
    category: 'production',
    tags: ['ASP.NET Core', 'IoT Backend', 'Hardware Integration', 'SQL Server'],
    description:
      'Built a RESTful backend API for a hardware-connected smart medication dispenser, handling pill scheduling, dose tracking, and patient management.',
    highlights: [
      'Consumed by an embedded ESP32/mobile client to control physical dispensing operations',
      'Documented with Swagger/OpenAPI',
    ],
    demoUrl: 'https://pills-despinser.runasp.net/swagger/index.html',
    color: '#ec4899',
  },
  {
    id: 'koky-sweets',
    title: 'KOKY SWEETS E-COMMERCE',
    category: 'production',
    tags: ['ASP.NET Core 8 MVC', 'Clean Architecture', 'SignalR', 'EF Core', 'Leaflet.js'],
    description:
      'Production-ready bakery e-commerce platform using Clean Architecture with real-time Uber-like live order tracking powered by SignalR, broadcasting courier GPS coordinates.',
    highlights: [
      'Dynamic ETA calculation using the Haversine formula',
      'Smart checkout geocoding map using Leaflet.js and Nominatim (OpenStreetMap)',
      'WhatsApp API integration for instant order tracking links',
    ],
    demoUrl: 'https://koky-sweets.runasp.net/',
    color: '#ff8a30',
  },
  {
    id: 'student-echo',
    title: 'STUDENTECHO PLATFORM',
    category: 'production',
    tags: ['ASP.NET Core 8 MVC', 'Clean Architecture', 'Google OAuth', 'CQRS'],
    description:
      'University complaint management system using Clean Architecture with Repository Pattern, Unit of Work, and CQRS, featuring Google OAuth 2.0 and OTP verification.',
    highlights: [
      'Smart keyword-based complaint categorization and automated priority engine',
      'Role-based access (Student, Staff, Supervisor, Admin) and SMTP email notifications',
      'Chart.js analytics dashboard with staff performance metrics',
    ],
    demoUrl: 'https://student-echo.runasp.net/',
    color: '#38bdf8',
  },
  {
    id: 'muslimy',
    title: 'MUSLIMY ISLAMIC PLATFORM',
    category: 'production',
    tags: ['ASP.NET Core 8 MVC', 'Clean Architecture', 'CQRS', 'MediatR'],
    description:
      'Enterprise-grade Islamic platform using Clean Architecture and CQRS via MediatR, integrating AlQuran Cloud API, Aladhan API, a Hadith browser, and Duas collection.',
    highlights: [
      'Real-time prayer times with auto location detection',
      'Group/Individual Khatmah tracking system',
    ],
    demoUrl: 'https://muslimy-app.runasp.net/',
    color: '#14b8a6',
  },
  {
    id: 'erp-system',
    title: 'DESKTOP ERP SYSTEM (PHARAOXON)',
    category: 'production',
    tags: ['C#', '.NET Framework', 'SQL Server', 'WinForms', 'DevExpress'],
    description:
      'Comprehensive desktop ERP covering Customers, Suppliers, Branches, Warehouses, Categories, Purchases, Sales, Finance, HR, and Settings with advanced DevExpress reporting.',
    highlights: [
      'Used daily in production at Pharaoxon',
      'Handles complex purchases (invoices + returns) and sales (invoices + returns)',
      'Granular role-based user permissions',
    ],
    color: '#3b82f6',
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
