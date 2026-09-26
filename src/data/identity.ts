export interface IdentityData {
  name: string;
  role: string;
  title: string;
  tagline: string;
  summary: string;
  age: number;
  graduationYear: number;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  oldPortfolioUrl: string;
  portraitImage: string;
  realPortraitImage: string;
  conceptImage1: string;
  conceptImage2: string;
  stats: Array<{ label: string; value: string; unit: string }>;
}

export const IDENTITY_DATA: IdentityData = {
  name: 'AHMED HAMADA',
  role: 'SOFTWARE DEVELOPER',
  title: '.NET BACKEND DEVELOPER',
  tagline: 'BUILDING SYSTEMS. CREATING IDEAS.',
  summary:
    '.NET Backend Developer with 2 years of experience delivering production-grade desktop, web, and backend applications using C#, ASP.NET Core MVC, .NET Framework, and SQL Server. Built and deployed 6+ live web applications and 3 REST APIs, including a multi-module ERP system serving a Next.js frontend built with Clean Architecture.',
  age: 21,
  graduationYear: 2027,
  location: 'Qalyubia / Cairo, Egypt',
  email: 'ahmed.nasser189202@gmail.com',
  phone: '+20 106 437 9963',
  linkedin: 'https://www.linkedin.com/in/ahmed-hamada-saad/',
  github: 'https://github.com/F3raon',
  whatsapp: 'https://wa.me/201064379963',
  oldPortfolioUrl: 'https://ahmed-hamada-eta.vercel.app',
  portraitImage: '/ahmed-portrait.png',
  realPortraitImage: '/images/ahmed-real.png',
  conceptImage1: '/images/ahmed-concept-1.png',
  conceptImage2: '/images/ahmed-concept-2.png',
  stats: [
    { label: 'EXPERIENCE', value: '2+ YRS', unit: '.NET DEV' },
    { label: 'PROJECTS', value: '10+', unit: 'SHIPPED' },
    { label: 'REST APIS', value: '3 LIVE', unit: 'PRODUCTION' },
    { label: 'AWARDS', value: '1ST PLACE', unit: 'ARC EGYPT' },
  ],
};
