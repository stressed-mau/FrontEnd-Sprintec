import type { MessageReason } from "@/types/messages";

export const MESSAGE_DETAILS_MAX_LENGTH = 300;
export const CONTACT_NAME_MAX_LENGTH = 100;
export const CONTACT_EMAIL_MAX_LENGTH = 60;

export const MESSAGE_REASON_OPTIONS: Array<{ id: MessageReason; title: string; message: string }> = [
  {
    id: "job_opportunity",
    title: "Oportunidad laboral",
    message: "Hola, me interesa tu perfil profesional. Tengo una oportunidad laboral que podria interesarte.",
  },
  {
    id: "project_collaboration",
    title: "Colaboracion en proyecto",
    message: "Hola, estoy trabajando en un proyecto y me gustaria colaborar contigo.",
  },
  {
    id: "technical_question",
    title: "Consulta tecnica",
    message: "Hola, me gustaria consultarte sobre tu experiencia en algunas tecnologias.",
  },
  {
    id: "professional_networking",
    title: "Networking profesional",
    message: "Hola, me gustaria conectar contigo y ampliar mi red profesional.",
  },
  {
    id: "mentorship",
    title: "Mentoria",
    message: "Hola, me interesa aprender de tu experiencia. Podrias orientarme?",
  },
  {
    id: "freelance_proposal",
    title: "Propuesta freelance",
    message: "Hola, tengo un proyecto freelance que podria interesarte.",
  },
];
