export interface EducationOptions {
  titles: string[]
  fields: string[]
}

export type EducationType = "academica"

export interface EducationItem {
  id: string
  type: EducationType
  company: string
  email: string
  position: string
  location: string
  fieldOfStudy: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  image: string
  certificate: string
}

export type EducationFormValues = Omit<EducationItem, "id">

export type EducationFormErrors = Partial<Record<keyof EducationFormValues, string>>

export interface EducationPayload {
  type: string
  company: string
  email: string
  position: string
  location: string
  fieldOfStudy: string
  description: string
  startDate: string
  endDate: string
  current: boolean
  logoFile?: File | null
  certificateFile?: File | null
  removeLogo?: boolean
  removeCertificate?: boolean
}

export interface EducationDto {
  id?: string | number
  education_id?: string | number
  institution?: string
  institution_name?: string
  title?: string
  degree?: string
  field_to_study?: string | null
  field_of_study?: string | null
  field?: string | null
  description?: string | null
  descripcion?: string | null
  start_date?: string | null
  initial_date?: string | null
  issue_date?: string | null
  issued_at?: string | null
  date_issued?: string | null
  emission_date?: string | null
  fecha_emision?: string | null
  end_date?: string | null
  final_date?: string | null
  startDate?: string | null
  endDate?: string | null
  current?: boolean | number | string | null
  is_current?: boolean | number | string | null
  isCurrent?: boolean | number | string | null
  currently_studying?: boolean | number | string | null
  status?: string | null
  estado?: string | null
  company_email?: string | null
  email?: string | null
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
}
