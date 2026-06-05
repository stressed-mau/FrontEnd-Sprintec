import type { ExperienceType } from "@/types/experience"

export type UnknownRecord = Record<string, unknown>

export interface ExperienceDto {
  id?: string | number
  experience_id?: string | number
  type?: string
  category?: string
  experience_type?: string
  name?: string
  nombre?: string
  company?: string
  company_name?: string
  empresa?: string
  organization?: string
  institution?: string
  institution_name?: string
  institucion?: string
  school?: string
  university?: string
  college?: string
  title?: string
  degree?: string
  role?: string
  job_title?: string
  titulo?: string
  position?: string
  cargo?: string
  puesto?: string
  description?: string | null
  descripcion?: string | null
  summary?: string | null
  details?: string | null
  content?: string | null
  start_date?: string | null
  initial_date?: string | null
  startDate?: string | null
  fecha_inicio?: string | null
  end_date?: string | null
  final_date?: string | null
  endDate?: string | null
  fecha_fin?: string | null
  company_email?: string | null
  companyEmail?: string | null
  email?: string | null
  correo_empresa?: string | null
  ubication?: string | null
  location?: string | null
  ubicacion?: string | null
  field_of_study?: string | null
  field?: string | null
  campo_estudio?: string | null
  logo?: string | null
  logo_url?: string | null
  logo_path?: string | null
  photograph?: string | null
  image_url?: string | null
  image?: string | null
  certificate?: string | null
  certificate_url?: string | null
  certification_url?: string | null
  certification?: string | null
  certification_path?: string | null
  certificate_file?: string | null
  certificate_file_url?: string | null
  certificate_path?: string | null
  document?: string | null
  document_url?: string | null
  document_path?: string | null
  file?: string | null
  file_url?: string | null
  file_path?: string | null
  attachment?: string | null
  current?: boolean | number | string | null
  is_current?: boolean | number | string | null
  isCurrent?: boolean | number | string | null
}

export interface ExperienceGroup {
  items: ExperienceDto[]
  type?: ExperienceType
}
