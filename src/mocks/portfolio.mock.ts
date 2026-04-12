import type { Portfolio } from "@/types/portfolio";

export const portfolioMock: Portfolio = {
  // --- CAMPOS NUEVOS ---
  template: 2, // 1: Default, 2: Minimalista (Según tu lógica de componentes)
  isPublished: true,
  portfolioUrl: "http://localhost:8000/p/juan-perez",
  // ---------------------

  user: {
    id: "1",
    fullname: "Juan Pérez",
    occupation: "Full Stack Developer",
    biography:
      "Desarrollador apasionado por crear aplicaciones web modernas, escalables y con buenas prácticas de arquitectura de software. Me gusta trabajar en frontend y backend.",
    nationality: "Bolivia",
    public_email: "juan@email.com",
    phone_number: "+59171234567",
    image_url: "https://i.pravatar.cc/300"
  },

  projects: [
    {
      id: "p1",
      nombre: "Sistema de Gestión Universitaria",
      descripcion:
        "Plataforma completa para administración académica con roles, notas y gestión de estudiantes.",
      tecnologias: [
        { id: 1, name: "React" },
        { id: 2, name: "Node.js" },
        { id: 3, name: "MySQL" }
      ],
      rol: "Full Stack Developer",
      fechaInicio: "2024-01-10",
      fechaFin: "2024-06-15",
      is_current: false,
      github: "https://github.com/usuario/proyecto1",
      demo: "https://demo.com/proyecto1",
      image: "https://via.placeholder.com/300"
    },
    {
      id: "p2",
      nombre: "Portafolio Personal",
      descripcion:
        "Sitio web para mostrar proyectos, habilidades y experiencia profesional.",
      tecnologias: [
        { id: 1, name: "React" },
        { id: 2, name: "TypeScript" }
      ],
      rol: "Frontend Developer",
      fechaInicio: "2025-01-01",
      fechaFin: "",
      is_current: true,
      github: "https://github.com/usuario/portfolio",
      demo: "https://miportafolio.com",
      image: "https://via.placeholder.com/300"
    }
  ],

  skills: [
    {
      id: "s1",
      name: "React",
      type: "tecnica",
      level: "avanzado"
    },
    {
      id: "s2",
      name: "TypeScript",
      type: "tecnica",
      level: "intermedio"
    },
    {
      id: "s3",
      name: "Node.js",
      type: "tecnica",
      level: "avanzado"
    },
    {
      id: "s4",
      name: "Trabajo en equipo",
      type: "blanda"
    }
  ],

  experiences: [
    {
      id: "e1",
      type: "laboral",
      company: "Tech Company S.A.",
      email: "hr@tech.com",
      position: "Frontend Developer",
      description:
        "Desarrollo de interfaces web modernas con React y TypeScript.",
      startDate: "2023-01-10",
      endDate: "2024-01-10",
      current: false,
      image: ""
    },
    {
      id: "e2",
      type: "laboral",
      company: "Startup X",
      email: "contact@startupx.com",
      position: "Full Stack Intern",
      description:
        "Participación en desarrollo de APIs y frontend de aplicaciones internas.",
      startDate: "2024-02-01",
      endDate: "",
      current: true,
      image: ""
    }
  ],

  socialNetworks: [
    {
      id: "sn1",
      name: "LinkedIn",
      url: "https://linkedin.com/in/juanperez"
    },
    {
      id: "sn2",
      name: "GitHub",
      url: "https://github.com/juanperez"
    },
    {
      id: "sn3",
      name: "Portfolio",
      url: "https://juanportafolio.com"
    }
  ]
};