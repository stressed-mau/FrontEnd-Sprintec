import type { ReactNode } from "react"
import { Award, Edit, Trash2, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Certificate } from "@/hooks/useCertificatesManager"

type CertificatesSectionProps = {
  title: string
  emptyMessage: string
  icon: ReactNode
  items: Certificate[]
  onEdit: (certificate: Certificate) => void
  onDelete: (certificate: Certificate) => void
}

export function CertificatesSection({
  title,
  emptyMessage,
  icon,
  items,
  onEdit,
  onDelete,
}: CertificatesSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-[#003A6C]">
        {icon}
        <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      </div>

      {items.length === 0 ? (
        <Card className="rounded-3xl border-2 border-dashed border-[#6dacbf] bg-white py-0 shadow-sm">
          <CardContent className="px-6 py-12 text-center sm:py-14">
            <p className="py-4 text-center text-sm text-[#4B778D] sm:text-base">{emptyMessage}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((certificate) => (
            <Card key={certificate.id} className="rounded-3xl border border-[#A5D7E8] bg-white py-0 shadow-sm">
              <CardHeader className="px-5 py-5 sm:px-6 sm:py-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#D9EAF4] text-[#003A6C] sm:size-16">
                      <Award className="size-7" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold text-[#003A6C]">
                        {certificate.name}
                      </CardTitle>
                      <p className="mt-1 text-[#4B778D]">{certificate.issuer}</p>
                      
                      {certificate.description && (
                        <p className="mt-2 text-sm leading-6 text-[#355468]">{certificate.description}</p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#6B7E8E]">
                        <span>Emitido: {new Date(certificate.date_issued).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        {certificate.date_expired && (
                          <span>Vencimiento: {new Date(certificate.date_expired).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                        )}
                      </div>

                      {certificate.credential_id && (
                        <p className="mt-2 text-xs text-[#6B7E8E]">
                          ID: <span className="font-mono">{certificate.credential_id}</span>
                        </p>
                      )}

                      {certificate.credential_url && (
                        <div className="mt-2">
                          <a
                            href={certificate.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#003A6C] hover:underline"
                          >
                            Ver credencial ↗
                          </a>
                        </div>
                      )}

                      {certificate.file_bonus_url && (
                        <div className="mt-2">
                          <a
                            href={certificate.file_bonus_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-[#003A6C] hover:underline"
                          >
                            <Download className="size-3" />
                            Descargar archivo
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 self-end sm:self-start">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(certificate)}
                      className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(certificate)}
                      className="border-[#A5D7E8] bg-white text-[#003A6C] hover:bg-[#EEF5F9]"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}
