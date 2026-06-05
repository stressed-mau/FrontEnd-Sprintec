export interface ProjectTechnology {
  id: number
  name: string
}

export interface ProjectItem {
  id: number
  nombre: string
  descripcion: string
  tecnologias: ProjectTechnology[]
  rol: string
  fechaInicio: string
  fechaFin?: string
  is_current: boolean
  github?: string
  demo?: string
  image?: string
}

export interface ProjectPayload {
  title: string
  description: string
  initial_date: string
  final_date: string | null
  url_to_project: string | null
  url_to_deploy: string | null
  project_rol: string | null
  is_current: boolean
  technologies: number[]
  image_id?: number
}

export interface ProjectUpdatePayload {
  description?: string
  final_date?: string | null
  url_to_project?: string | null
  url_to_deploy?: string | null
  is_current?: boolean
}

export interface WorkOptions {
  roles: string[]
}
