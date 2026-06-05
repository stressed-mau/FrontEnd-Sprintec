import { useState } from "react"

type CorporateProfileImageProps = {
  alt: string
  className: string
  initials: string
  initialsClassName: string
  src: string
}

export function CorporateProfileImage({
  alt,
  className,
  initials,
  initialsClassName,
  src,
}: CorporateProfileImageProps) {
  const [hasImageError, setHasImageError] = useState(false)
  const showImage = Boolean(src) && !hasImageError

  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden bg-[linear-gradient(160deg,#D8B182_0%,#7C8EA1_100%)] ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt}
          className="block h-full w-full object-cover object-center"
          loading="lazy"
          onError={() => setHasImageError(true)}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.42),transparent_42%)]" />
          <span className={`relative font-black text-white ${initialsClassName}`}>
            {initials}
          </span>
        </>
      )}
    </div>
  )
}
