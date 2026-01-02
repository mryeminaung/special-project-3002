import type { ProjectProposal } from "@/types";

export const mockProposals: ProjectProposal[] = [
  {
    id: '1',
    title: 'SmartCampus: AI-Driven Energy Management System',
    description:
      "A system that utilizes machine learning algorithms to analyze real-time data from smart meters and motion sensors across campus buildings. The goal is to predict peak energy demand and automatically adjust lighting and HVAC systems to reduce the university's carbon footprint. The system will include:\n\n• Real-time monitoring dashboard\n• Predictive analytics for energy consumption\n• Automated control of building systems\n• Reporting and analytics module\n• Mobile notification system for facility managers",
    supervisor: { name: 'U Min Naing Soe', email: 'min_naing_soe@miit.edu.mm' },
    submittedBy: {
      id: 21,
      name: 'Mg Aung Tun',
      email: '2019-miit-cse-002@miit.edu.mm',
    },
    students: [
      { id: 21, name: 'Mg Aung Tun', email: '2019-miit-cse-002@miit.edu.mm' },
      {
        id: 23,
        name: 'Mg Soe Naing Aung',
        email: '2019-miit-cse-004@miit.edu.mm',
      },
    ],
    file: 'https://special-project-3002.s3.ap-southeast-1.amazonaws.com/proposals/TpoNGUhBeDHAuQLbqFTm5OQ5bvRa2GN5w9aq5uak.docx',
    status: 'pending',
    submitted_at: '25-12-2025',
  },
  {
    id: '2',
    title: 'SkillSwap: A Peer-to-Peer Student Mentorship Platform',
    description:
      "A localized web application designed for students to trade skills (e.g., 'I teach you React, you teach me UI design'). It features a custom matching algorithm based on student proficiency levels, a real-time chat interface, and a feedback system to ensure quality mentorship.",
    supervisor: { name: 'Daw Nwe Moe', email: 'nwe_moe@miit.edu.mm' },
    submittedBy: {
      id: 23,
      name: 'Mg Soe Naing Aung',
      email: '2019-miit-cse-004@miit.edu.mm',
    },
    students: [
      {
        id: 23,
        name: 'Mg Soe Naing Aung',
        email: '2019-miit-cse-004@miit.edu.mm',
      },
      {
        id: 25,
        name: 'Mg Aung Naing Tun',
        email: '2019-miit-cse-006@miit.edu.mm',
      },
    ],
    file: 'https://special-project-3002.s3.ap-southeast-1.amazonaws.com/proposals/zCzi7z157114jsXBVwrMODtLgodKDxYw3iWiLLU5.docx',
    status: 'pending',
    submitted_at: '25-12-2025',
  },
];
