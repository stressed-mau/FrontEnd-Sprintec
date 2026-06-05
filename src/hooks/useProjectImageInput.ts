import { useEffect, useState, type ChangeEvent, type Dispatch, type SetStateAction } from "react"

import { ALLOWED_IMAGE_TYPES } from "@/lib/projectFormConstants"
import type { ProjectFormErrors } from "@/types/projectForm"

type SetProjectErrors = Dispatch<SetStateAction<ProjectFormErrors>>

export function useProjectImageInput(setErrors: SetProjectErrors) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    const currentPreview = preview
    return () => revokeObjectPreview(currentPreview)
  }, [preview])

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null
    clearImageError(setErrors)
    revokeObjectPreview(preview)
    setPreview(null)

    if (!file) {
      setImageFile(null)
      return
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      rejectImage(event, setErrors, setImageFile)
      return
    }

    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function loadExistingImage(imageUrl?: string | null) {
    setImageFile(null)
    setPreview(imageUrl ?? null)
  }

  function removeImage() {
    setImageFile(null)
    revokeObjectPreview(preview)
    setPreview(null)
  }

  return {
    handleImageChange,
    imageFile,
    loadExistingImage,
    preview,
    removeImage,
  }
}

function clearImageError(setErrors: SetProjectErrors) {
  setErrors((current) => {
    const next = { ...current }
    delete next.image
    return next
  })
}

function rejectImage(
  event: ChangeEvent<HTMLInputElement>,
  setErrors: SetProjectErrors,
  setImageFile: Dispatch<SetStateAction<File | null>>,
) {
  setImageFile(null)
  event.target.value = ""
  setErrors((current) => ({
    ...current,
    image: "El campo imagen del proyecto solo permite archivos JPG o PNG.",
  }))
}

function revokeObjectPreview(preview: string | null) {
  if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview)
}
