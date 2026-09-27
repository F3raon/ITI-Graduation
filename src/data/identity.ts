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
    '.NET Backend Developer with hands-on experience delivering production-grade desktop, web, and backend applications using C#, ASP.NET Core MVC, .NET Framework, and SQL Server. Built and deployed 6+ live web applications and 3 REST APIs, including a multi-module ERP system serving a Next.js frontend built with Clean Architecture. Experienced in JWT authentication, SignalR, CQRS, MediatR, FluentValidation, and relational database design. Proven ability to ship real software used by real companies — seeking a junior .NET backend developer role to contribute to a professional engineering team.',
  age: 21,
  graduationYear: 2027,
  location: 'Cairo, Egypt',
  email: 'ah4482336@gmail.com',
  phone: '+20 109 162 6367',
  linkedin: 'https://www.linkedin.com/in/ahmed-hamada-saad/',
  github: 'https://github.com/F3raon',
  whatsapp: 'https://wa.me/201091626367',
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
