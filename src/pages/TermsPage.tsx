// Archivo: src/pages/TermsPage.tsx
import { Footer } from "@/components/Footer"
import { Header } from "@/components/Header"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F9]">
      <Header />
      
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Card className="shadow-lg border-none">
            <CardContent className="p-6 sm:p-12 text-[#24292f]">
              
              {/* Cabecera del documento */}
              <div className="border-b border-gray-200 pb-8 mb-8">
                <p className="text-lg font-semibold text-[#4982AD] mb-1">
                  PortfolioGen <span className="font-normal text-gray-500">/ Términos de Servicio</span>
                </p>
                <h1 className="text-3xl sm:text-4xl font-bold text-[#003A6C] mb-3">
                  Términos de Servicio y Privacidad
                </h1>
                <p className="text-gray-500 text-sm">
                  Sprintec Software Solution SRL | Vigente a partir de: Mayo de 2026
                </p>
              </div>

              {/* Contenido principal */}
              <div className="space-y-6 text-gray-700 leading-relaxed text-sm sm:text-base">
                <p>
                  Gracias por elegir PortfolioGen. El presente documento contiene la totalidad de los Términos y Condiciones que rigen el uso de nuestra plataforma. Hemos redactado este documento con el mayor nivel de detalle posible para brindar total transparencia sobre nuestros derechos, tus responsabilidades y las normativas que protegen el ecosistema de nuestra aplicación web.
                </p>

                {/* Sección A */}
                <h2 className="text-xl font-bold text-[#003A6C] mt-10 mb-4 border-b border-gray-200 pb-2">
                  A. Definiciones Fundamentales
                </h2>
                <div className="bg-[#f6f8fa] border border-[#d0d7de] border-l-4 border-l-[#4982AD] p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-600 italic m-0">
                    <strong className="text-gray-900 not-italic">En pocas palabras:</strong> Esta sección establece un vocabulario común. Cuando usamos palabras en mayúscula en este documento, esto es exactamente lo que significan.
                  </p>
                </div>
                <ol className="list-decimal pl-6 space-y-2">
                  <li><strong>"Acuerdo" o "Términos":</strong> Se refiere al presente documento de Términos del Servicio, en conjunto con nuestras políticas de privacidad.</li>
                  <li><strong>"Sprintec", "Nosotros" o "Nuestro":</strong> Hace referencia a Sprintec Software Solution SRL, sus directivos, desarrolladores y representantes legales.</li>
                  <li><strong>"Servicio" o "Plataforma":</strong> Comprende la totalidad de la aplicación web PortfolioGen, incluyendo su interfaz, API, bases de datos, exportación PDF y servicios conexos.</li>
                  <li><strong>"Usuario", "Tú" o "Tu":</strong> Cualquier persona que acceda, navegue, se registre o interactúe con el Servicio.</li>
                  <li><strong>"Cuenta":</strong> El entorno privado, protegido por credenciales de acceso, asignado a un Usuario tras el registro exitoso.</li>
                  <li><strong>"Contenido Generado por el Usuario" (CGU):</strong> Material digital subido por el Usuario (textos, descripciones, fotos, código fuente, certificados).</li>
                </ol>

                {/* Sección B */}
                <h2 className="text-xl font-bold text-[#003A6C] mt-10 mb-4 border-b border-gray-200 pb-2">
                  B. Condiciones y Obligaciones de la Cuenta
                </h2>
                <div className="bg-[#f6f8fa] border border-[#d0d7de] border-l-4 border-l-[#4982AD] p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-600 italic m-0">
                    <strong className="text-gray-900 not-italic">En pocas palabras:</strong> Las cuentas deben ser creadas y administradas por personas reales. Eres responsable de proteger tus credenciales. No se permiten bots.
                  </p>
                </div>
                <h3 className="font-semibold text-gray-900 mt-4 mb-2">1. Elegibilidad y Registro</h3>
                <p>Para crear una Cuenta, el Usuario declara poseer la capacidad jurídica plena para celebrar contratos. El Usuario se obliga a proporcionar información completa, precisa y veraz. Queda estrictamente prohibida la suplantación de identidad o el uso de correos temporales.</p>
                
                <h3 className="font-semibold text-gray-900 mt-4 mb-2">2. Seguridad y Tokens de Autenticación</h3>
                <p>La contraseña debe tener entre 8 y 20 caracteres, incluyendo una mayúscula, un número y un carácter especial. El Usuario es el único responsable de la confidencialidad de su contraseña y de los <em>Tokens de Autenticación (JWT)</em>. Sprintec no asume responsabilidad por daños derivados de accesos no autorizados por negligencia del Usuario.</p>

                <h3 className="font-semibold text-gray-900 mt-4 mb-2">3. Restricción de Automatización</h3>
                <p>La creación de cuentas mediante scripts o <em>bots</em> está terminantemente prohibida. Las cuentas deben ser administradas por personas reales.</p>

                {/* Sección C */}
                <h2 className="text-xl font-bold text-[#003A6C] mt-10 mb-4 border-b border-gray-200 pb-2">
                  C. Política de Privacidad y Manejo de Datos
                </h2>
                <div className="bg-[#f6f8fa] border border-[#d0d7de] border-l-4 border-l-[#4982AD] p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-600 italic m-0">
                    <strong className="text-gray-900 not-italic">En pocas palabras:</strong> Recopilamos datos estrictamente necesarios. Usamos cookies esenciales y JWT para mantener tu sesión segura. Todo lo que publiques será visible globalmente.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Datos Recopilados:</strong> Almacenamos correos electrónicos, fotografías de perfil, certificados y descripciones laborales que decidas subir.</li>
                  <li><strong>Uso de Cookies y Sesiones (JWT):</strong> Utilizamos JSON Web Tokens y cookies esenciales para mantener tu sesión activa y segura. No utilizamos rastreadores invasivos de terceros.</li>
                  <li><strong>Consentimiento de Visibilidad Pública:</strong> El Usuario reconoce que la información marcada como "Pública" (URL <code>/p/:slug</code>) podrá ser indexada por motores de búsqueda y será accesible por reclutadores y terceros.</li>
                </ul>

                {/* Sección D */}
                <h2 className="text-xl font-bold text-[#003A6C] mt-10 mb-4 border-b border-gray-200 pb-2">
                  D. Código de Conducta y Uso Aceptable
                </h2>
                <div className="bg-[#f6f8fa] border border-[#d0d7de] border-l-4 border-l-[#4982AD] p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-600 italic m-0">
                    <strong className="text-gray-900 not-italic">En pocas palabras:</strong> PortfolioGen es una plataforma profesional. No subas virus ni publiques datos sensibles propios o de terceros.
                  </p>
                </div>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Protección de Datos Sensibles:</strong> El Usuario se compromete a no publicar contraseñas, secretos comerciales, información bancaria u otros datos personales sensibles.</li>
                  <li><strong>Contenido Ilegal e Interferencia:</strong> Prohibido alojar malware, esquemas de phishing, o intentar inyecciones SQL y ataques DDoS.</li>
                </ul>

                {/* Sección E */}
                <h2 className="text-xl font-bold text-[#003A6C] mt-10 mb-4 border-b border-gray-200 pb-2">
                  E. Régimen de Propiedad Intelectual
                </h2>
                <p><strong>Propiedad del Usuario:</strong> Sprintec no adquiere derechos sobre tus proyectos. Nos otorgas una licencia mundial y libre de regalías para alojar y mostrar públicamente tu contenido con el único fin operativo de prestar el servicio.</p>
                <p><strong>Propiedad de Sprintec:</strong> El código fuente (React, Vite), bases de datos, UX/UI, componentes (Tailwind) y las plantillas (Minimalist, Modern, Corporate) son propiedad exclusiva de Sprintec Software Solution SRL. Prohibida su copia o ingeniería inversa.</p>

                {/* Secciones Finales */}
                <h2 className="text-xl font-bold text-[#003A6C] mt-10 mb-4 border-b border-gray-200 pb-2">
                  F. Limitación de Responsabilidad
                </h2>
                <div className="bg-[#f6f8fa] border border-[#d0d7de] border-l-4 border-l-[#4982AD] p-4 rounded-md mb-4">
                  <p className="text-sm text-gray-600 italic m-0">
                    <strong className="text-gray-900 not-italic">En pocas palabras:</strong> Ofrecemos el servicio "tal cual". Si algo sale mal con el sistema, no nos puedes demandar por problemas técnicos o pérdida de oportunidades.
                  </p>
                </div>
                <p>
                  El servicio se proporciona "tal cual" y "según disponibilidad". Sprintec renuncia expresamente a todas las garantías de cualquier tipo. Sprintec no garantiza que el funcionamiento de la aplicación sea completamente ininterrumpido o libre de errores temporales. 
                </p>
                <p>
                  En la medida máxima permitida por la ley, Sprintec Software Solution SRL no será responsable por ningún daño indirecto, incidental o consecuente, incluyendo expresamente la <strong>pérdida de oportunidades profesionales</strong> o la corrupción de datos profesionales ocasionada por eventuales fallas técnicas en la plataforma.
                </p>

                {/* Sección G */}
                <h2 className="text-xl font-bold text-[#003A6C] mt-10 mb-4 border-b border-gray-200 pb-2">
                  G. Jurisdicción y Contacto
                </h2>
                <p>El presente Acuerdo se regirá de conformidad con las leyes del Estado Plurinacional de Bolivia. Las partes se someten a la jurisdicción exclusiva de los tribunales de la ciudad de Cochabamba.</p>
                
                <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mt-8 text-center">
                  <p className="text-gray-600 mb-2">Para consultas legales, notificaciones o soporte, contáctanos en:</p>
                  <a href="mailto:sprintecsoftwaresolution@gmail.com" className="text-lg font-semibold text-[#003A6C] hover:underline">
                    sprintecsoftwaresolution@gmail.com
                  </a>
                  <p className="text-xs text-gray-400 mt-4">&copy; 2026 Sprintec Software Solution SRL. Todos los derechos reservados.</p>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}