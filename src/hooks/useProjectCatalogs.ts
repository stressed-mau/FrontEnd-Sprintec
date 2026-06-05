import { useEffect, useMemo, useState } from "react"

import { FIXED_PROJECT_ROLES } from "@/lib/projectFormConstants"
import { getLanguages, getWorkOptions } from "@/services/projectTechnologyService"
import type { ProjectTechnology, WorkOptions } from "@/types/project"

export function useProjectCatalogs() {
  const [technologies, setTechnologies] = useState<ProjectTechnology[]>([])
  const [workOptions, setWorkOptions] = useState<WorkOptions>({ roles: [] })
  const roleOptions = useMemo(() => getRoleOptions(workOptions), [workOptions])

  useEffect(() => {
    void loadWorkOptions(setWorkOptions)
    void loadTechnologies(setTechnologies)
  }, [])

  return {
    roleOptions,
    technologies,
  }
}

function getRoleOptions(options: WorkOptions) {
  return options.roles.length ? options.roles : FIXED_PROJECT_ROLES
}

async function loadWorkOptions(setWorkOptions: (options: WorkOptions) => void) {
  try {
    setWorkOptions(await getWorkOptions())
  } catch {
    setWorkOptions({ roles: [] })
  }
}

async function loadTechnologies(setTechnologies: (technologies: ProjectTechnology[]) => void) {
  try {
    setTechnologies(await getLanguages())
  } catch {
    setTechnologies([])
  }
}
