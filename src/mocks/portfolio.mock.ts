export const portfolioMock = {
  user: {
    id: "1",
    fullname: "Juan Pérez",
    occupation: "Full Stack Developer",
    biography:
      "Desarrollador Full Stack con experiencia en aplicaciones web escalables. Apasionado por el diseño de arquitecturas limpias, APIs REST y experiencias de usuario modernas.",
    public_email: "juan@email.com",
    nationality: "Bolivia",
    phone_number: "+59171234567",
    image_url: "https://i.pravatar.cc/300?img=11"
  },

  projects: [
    {
      id: "p1",
      nombre: "Sistema de Gestión Universitaria",
      descripcion:
        "Plataforma completa para gestión académica con roles de estudiante, docente y administrador.",
      tecnologias: [
        { id: 1, name: "React" },
        { id: 2, name: "Node.js" },
        { id: 3, name: "MySQL" }
      ],
      rol: "Full Stack Developer",
      fechaInicio: "2024-01-10",
      fechaFin: "2024-06-20",
      is_current: false,
      github: "https://github.com/juan/sistema-universidad",
      demo: "https://universidad-demo.com",
      image: "https://source.unsplash.com/800x600/?university,system"
    },
    {
      id: "p2",
      nombre: "Portafolio Personal",
      descripcion:
        "Portafolio web interactivo para mostrar proyectos, habilidades y experiencia profesional.",
      tecnologias: [
        { id: 1, name: "Next.js" },
        { id: 2, name: "TypeScript" },
        { id: 3, name: "Tailwind" }
      ],
      rol: "Frontend Developer",
      fechaInicio: "2023-08-01",
      fechaFin: "2023-09-15",
      is_current: false,
      github: "https://github.com/juan/portfolio",
      demo: "https://juan-portfolio.com",
      image: "https://source.unsplash.com/800x600/?portfolio,website"
    }
  ],

  skills: [
    { id: "s1", name: "React", type: "tecnica", level: "avanzado" },
    { id: "s2", name: "TypeScript", type: "tecnica", level: "avanzado" },
    { id: "s3", name: "Node.js", type: "tecnica", level: "intermedio" },
    { id: "s4", name: "MySQL", type: "tecnica", level: "intermedio" },

    { id: "s5", name: "Trabajo en equipo", type: "blanda" },
    { id: "s6", name: "Comunicación", type: "blanda" }
  ],

  experiences: [
    {
      id: "e1",
      type: "laboral",
      company: "Tech Solutions S.R.L.",
      email: "contacto@techsolutions.com",
      position: "Frontend Developer",
      description:
        "Desarrollo de interfaces web modernas con React y optimización de rendimiento.",
      startDate: "2023-02-01",
      endDate: "2024-01-01",
      current: false,
      image: "https://source.unsplash.com/200x200/?company,office"
    },
    {
      id: "e2",
      type: "laboral",
      company: "Startup X",
      email: "hr@startupx.com",
      position: "Intern Developer",
      description:
        "Apoyo en desarrollo de funcionalidades backend y frontend.",
      startDate: "2022-06-01",
      endDate: "2022-12-01",
      current: false,
      image: "https://source.unsplash.com/200x200/?startup,team"
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
      name: "Portfolio Web",
      url: "https://juanperez.dev"
    }
  ]
};