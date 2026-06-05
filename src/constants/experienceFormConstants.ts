import type { ExperienceFormValues } from "@/hooks/useExperienceManager"

export const EMPTY_EXPERIENCE_FORM: ExperienceFormValues = {
  type: "laboral",
  company: "",
  email: "",
  position: "",
  location: "",
  fieldOfStudy: "",
  description: "",
  startDate: "",
  endDate: "",
  current: false,
  image: "",
  certificate: "",
}

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]
export const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png"]
export const COMPANY_ALLOWED_CHARACTERS = /^[\p{L}\s.,]+$/u
export const COMPANY_MAX_LENGTH = 100
