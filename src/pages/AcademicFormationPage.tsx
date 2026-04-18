import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"
import { Footer } from "@/components/Footer"

const AcademicFormationPage = () => {
  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-[#A5D7E8] bg-white p-6 shadow-sm sm:p-8">
              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Formación académica</h1>
              <p className="mt-2 text-sm text-[#4B778D] md:text-base">
                Aquí irá la sección de formación académica.
              </p>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default AcademicFormationPage
