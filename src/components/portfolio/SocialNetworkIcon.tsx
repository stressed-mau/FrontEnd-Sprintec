import { Globe } from "lucide-react"
import type { SVGProps } from "react"

type SocialNetworkKey = "github" | "gitlab" | "youtube" | "linkedin" | "website"

function getNetworkText(network: any): string {
  if (typeof network === "string") return network

  return [
    network?.name,
    network?.platform,
    network?.label,
    network?.social_network,
    network?.url,
    network?.sublabel,
  ]
    .filter(Boolean)
    .join(" ")
}

export function getSocialNetworkKey(network: any): SocialNetworkKey {
  const value = getNetworkText(network).toLowerCase()

  if (value.includes("github")) return "github"
  if (value.includes("gitlab")) return "gitlab"
  if (value.includes("youtube") || value.includes("youtu.be") || value.includes("google")) return "youtube"
  if (value.includes("linkedin")) return "linkedin"

  return "website"
}

export function getSocialNetworkDisplayName(network: any): string {
  const key = getSocialNetworkKey(network)

  if (key === "github") return "GitHub"
  if (key === "gitlab") return "GitLab"
  if (key === "youtube") return "YouTube"
  if (key === "linkedin") return "LinkedIn"

  if (typeof network === "string") return network
  return network?.name ?? network?.platform ?? network?.label ?? "Red profesional"
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.19-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.31 9.31 0 0 1 12 7c.85 0 1.7.12 2.5.34 1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.6.69.49A10.12 10.12 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

function GitLabIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22.65 13.04 20.45 6.2a.76.76 0 0 0-1.45-.05l-1.48 4.5H6.48L5 6.15a.76.76 0 0 0-1.45.05l-2.2 6.84a1.52 1.52 0 0 0 .55 1.7L12 22l10.1-7.26a1.52 1.52 0 0 0 .55-1.7ZM12 19.58l-3.45-8.1h6.9L12 19.58Z" />
    </svg>
  )
}

function YouTubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.58 7.18a2.65 2.65 0 0 0-1.87-1.88C18.06 4.86 12 4.86 12 4.86s-6.06 0-7.71.44a2.65 2.65 0 0 0-1.87 1.88A27.57 27.57 0 0 0 2 12a27.57 27.57 0 0 0 .42 4.82 2.65 2.65 0 0 0 1.87 1.88c1.65.44 7.71.44 7.71.44s6.06 0 7.71-.44a2.65 2.65 0 0 0 1.87-1.88A27.57 27.57 0 0 0 22 12a27.57 27.57 0 0 0-.42-4.82ZM10 15.07V8.93L15.2 12 10 15.07Z" />
    </svg>
  )
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M6.94 8.98H3.88V20h3.06V8.98ZM5.41 4A1.78 1.78 0 1 0 5.4 7.56 1.78 1.78 0 0 0 5.41 4Zm14.7 9.68c0-3.02-1.61-4.43-3.76-4.43a3.25 3.25 0 0 0-2.94 1.62h-.04V8.98h-2.93V20h3.05v-5.45c0-1.44.27-2.83 2.05-2.83 1.75 0 1.78 1.64 1.78 2.92V20h3.05l-.26-6.32Z" />
    </svg>
  )
}

export function SocialNetworkIcon({ network, className }: { network: any; className?: string }) {
  const key = getSocialNetworkKey(network)

  if (key === "github") return <GitHubIcon className={className} />
  if (key === "gitlab") return <GitLabIcon className={className} />
  if (key === "youtube") return <YouTubeIcon className={className} />
  if (key === "linkedin") return <LinkedInIcon className={className} />

  return <Globe className={className} />
}
