import { Footer } from "@/components/Footer"
import Header from "@/components/HeaderUser"
import Sidebar from "@/components/Sidebar"

export default function AddProjectsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-1 flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Agregar proyectos</h1>
        </main>
      </div>
      <Footer />
    </div>
  )
}
