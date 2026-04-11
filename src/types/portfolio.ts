// =========================
// USER (BACKEND)
// =========================
export interface User {
  id: string;

  fullname: string;
  occupation: string;
  biography: string;
  nationality: string;

  public_email: string;
  phone_number?: string;

  image_url?: string;
}

// =========================
// USER FORM (FRONTEND UI)
// =========================
export interface UserForm {
  fullName: string;
  occupation: string;
  bio: string;
  location: string;
  email: string;
  image: string;
}

// =========================
// USER FORM ERRORS
// =========================
export interface UserFormErrors {
  fullName?: string;
  occupation?: string;
  bio?: string;
  location?: string;
  email?: string;
  phone?: string;
  image?: string;
  server?: string;
}

// =========================
// PROJECT
// =========================
export interface ProjectTechnology {
  id: number;
  name: string;
}

export interface Project {
  id?: string;

  nombre: string;
  descripcion: string;
  tecnologias: ProjectTechnology[];

  rol: string;

  fechaInicio: string;
  fechaFin?: string;

  is_current: boolean;

  github?: string;
  demo?: string;
  image?: string;
}

// =========================
// SKILLS
// =========================
export type SkillType = "tecnica" | "blanda";

export type SkillLevel =
  | "basico"
  | "intermedio"
  | "avanzado"
  | "experto";

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  level?: string;
}

// =========================
// EXPERIENCE
// =========================
export type ExperienceType = "laboral" | "academica";

export interface Experience {
  id: string;

  type: ExperienceType;

  company: string;
  email: string;

  position: string;
  description: string;

  startDate: string;
  endDate: string;

  current: boolean;

  image?: string;
}

// =========================
// SOCIAL NETWORK
// =========================
export interface SocialNetwork {
  id: string;

  name: string;
  url: string;
}

// =========================
// PORTFOLIO AGREGADO
// =========================
export interface Portfolio {
  user: User;

  projects: Project[];
  skills: Skill[];
  experiences: Experience[];
  socialNetworks: SocialNetwork[];
  isPublished?: boolean;
  portfolioUrl?: string;
}

// =========================
// PHONE STATE (UI ONLY)
// =========================
export interface PhoneState {
  countryCode: string;
  phoneNumber: string;
}

// =========================
// GENERIC FORM ERRORS (OPTIONAL HELPERS)
// =========================
export type FormErrors<T extends string> = Partial<Record<T, string>>;