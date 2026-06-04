import { useRef, useState } from "react";
import { validateImageFile } from "@/utils/ImageValidation";

type UseImageDataProps = {
  onImageError: (message: string) => void;
  onImageSuccess: () => void;
  onImageRemoved: () => void;
};

export const useImageData = ({
  onImageError,
  onImageSuccess,
  onImageRemoved,
}: UseImageDataProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const validationError = validateImageFile(file);

    if (validationError) {
      onImageError(validationError);
      return;
    }

    setPreview(URL.createObjectURL(file));
    onImageSuccess();
  };

  const removeImage = () => {
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onImageRemoved();
  };

  return {
    fileInputRef,
    preview,
    setPreview,
    handleClick,
    handleFileChange,
    removeImage,
  };
};