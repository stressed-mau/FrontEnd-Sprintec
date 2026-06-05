import { Link2 } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function NetworkOAuthInfoCard() {
  return (
    <Card id="tarjeta-informacion-oauth-redes" className="border-blue-200 bg-blue-50/50 py-0">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div id="icono-informacion-oauth-redes" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
            <Link2 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 id="titulo-informacion-oauth-redes" className="mb-1 font-semibold text-blue-900">
              Conexion segura mediante OAuth
            </h3>
            <p id="descripcion-informacion-oauth-redes" className="text-sm leading-6 text-blue-700">
              Al conectar tus redes sociales, serás redirigido a la plataforma oficial para autorizar el acceso.  
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
