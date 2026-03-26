import { Building2, Mail, Phone } from "lucide-react"

import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const contactItems = [
  {
    title: "Empresa",
    value: "Sprintec Software Solution SRL",
    icon: Building2,
    iconClassName: "bg-[#C2DBED] text-[#003A6C]",
  },
  {
    title: "Correo electrónico",
    value: "sprintecsoftwaresolution@gmail.com",
    href: "mailto:sprintecsoftwaresolution@gmail.com",
    icon: Mail,
    iconClassName: "bg-[#F7F0E1] text-[#C47A2C]",
  },
  {
    title: "Teléfono",
    value: "(+591) 71491159",
    icon: Phone,
    iconClassName: "bg-[#DDEFD6] text-[#2E7D32]",
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-[#F2EBDF] via-[#EAF2F8] to-[#4982AD]">
      <Header />
      <main className="flex-1 px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl space-y-8">
          <section className="space-y-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#4982AD]">Contacto</p>
            <h1 className="text-4xl font-bold tracking-tight text-[#003A6C] sm:text-5xl">
              Estamos listos para ayudarte
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-7 text-[#355B7A] sm:text-lg">
              Si tienes preguntas, sugerencias o necesitas soporte con la plataforma, puedes comunicarte con
              nuestro equipo por cualquiera de los siguientes medios.
            </p>
          </section>

          <Card className="border-[#C2DBED] bg-white/85 shadow-xl backdrop-blur-sm">
            <CardHeader className="space-y-3 border-b border-[#D7E6F2]">
              <CardTitle className="text-2xl font-bold text-[#003A6C] sm:text-3xl">
                Sprintec Software Solution SRL
              </CardTitle>
              <p className="max-w-2xl text-sm leading-6 text-[#4F6F88] sm:text-base">
                Centralizamos la información de contacto para que puedas comunicarte con rapidez y recibir apoyo
                directo del equipo.
              </p>
            </CardHeader>

            <CardContent className="py-6 sm:py-8">
              <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:gap-5">
              {contactItems.map(({ title, value, href, icon: Icon, iconClassName }) => (
                <div
                  key={title}
                  className="flex flex-col gap-4 rounded-2xl border border-[#D9E6F1] bg-[#F8FBFE] p-4 sm:flex-row sm:items-start sm:p-5"
                >
                  <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B88A0]">{title}</p>
                    {href ? (
                      <a
                        href={href}
                        className="break-all text-base font-medium text-[#003A6C] transition hover:text-[#4982AD]"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-base font-medium text-[#003A6C]">{value}</p>
                    )}
                  </div>
                </div>
              ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
