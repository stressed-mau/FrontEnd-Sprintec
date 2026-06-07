import { useMemo, useState } from "react"
import { MinimalistContentPage } from "@/components/templates/minimalist/MinimalistContentPage"
import { MinimalistNavigation } from "@/components/templates/minimalist/MinimalistNavigation"
import { MinimalistSidebar } from "@/components/templates/minimalist/MinimalistSidebar"
import { useMinimalistTemplateData } from "@/hooks/useMinimalistTemplateData"
import type { MinimalistTemplateProps } from "@/types/minimalistPortfolio"

export default function MinimalistTemplate({
  profile,
  portfolio,
  isPreview = false,
  onProjectClick,
  onExperienceClick,
  onEducationClick,
  onCertificateClick,
  onSocialClick,
}: MinimalistTemplateProps) {
  const data = useMinimalistTemplateData(profile, portfolio, isPreview)
  const [page, setPage] = useState(0)
  const normalizedPage = useMemo(() => getNormalizedPage(page, data.pageIds.length), [page, data.pageIds.length])
  const currentPageId = data.pageIds[normalizedPage] ?? "bio"

  function nextPage() {
    setPage((currentPage) => (currentPage + 1) % data.pageIds.length)
  }

  function previousPage() {
    setPage((currentPage) => (currentPage - 1 + data.pageIds.length) % data.pageIds.length)
  }

  return (
    <article className="w-full max-w-4xl mx-auto min-h-[420px] bg-white text-zinc-900 font-sans shadow-2xl flex flex-col md:flex-row overflow-hidden border border-stone-100 md:min-h-[520px]">
      <MinimalistSidebar user={data.user} />
      <div className="flex-1 p-6 md:p-10 flex flex-col bg-white">
        <div className="flex-1">
          <MinimalistContentPage
            currentPageId={currentPageId}
            data={data}
            onProjectClick={onProjectClick}
            onExperienceClick={onExperienceClick}
            onEducationClick={onEducationClick}
            onCertificateClick={onCertificateClick}
          />
        </div>
        <MinimalistNavigation
          page={normalizedPage}
          networks={data.networks}
          onNextPage={nextPage}
          onPreviousPage={previousPage}
          onSocialClick={onSocialClick}
        />
      </div>
    </article>
  )
}

function getNormalizedPage(page: number, totalPages: number) {
  if (totalPages <= 0) return 0
  if (page < totalPages) return page
  return 0
}
