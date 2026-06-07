import Header from "../components/HeaderUser";
import AdminSidebar from '../components/Admin/AdminSidebar';
import { Footer } from "@/components/Footer";
import { getAuthSession } from "@/services/auth";
import { FileBarChart2, BadgeCheck, Info, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const AdminHome = () => {
  const session = getAuthSession();
  const displayName = session?.user?.username;

  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-col md:flex-row flex-1">
        <AdminSidebar />

        <main className="flex-1 p-6 md:p-10">
          <div className="max-w-5xl mx-auto">

            {/* HEADER */}
            <div className="text-center mb-12">
              <h1 className="text-[#003A6C] text-3xl md:text-5xl font-black mb-4">
                Panel de Administración, {displayName}
              </h1>
              <p className="text-gray-600 text-lg">
                Gestiona usuarios, revisa reportes y valida certificados del sistema
              </p>
            </div>

            {/* ALERTA INFORMATIVA */}
            

            {/* ACCESOS PRINCIPALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

              <Link
                to="/admin/reports"
                className="flex items-center gap-4 rounded-2xl border-2 border-[#C2DBED] bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-[#C2DBED]/30 text-[#003A6C]">
                  <FileBarChart2 />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#003A6C]">
                    Reportes de usuarios
                  </h3>
                  <p className="text-sm text-gray-500">
                    Analiza actividad, registros y estadísticas del sistema
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/certificates"
                className="flex items-center gap-4 rounded-2xl border-2 border-[#C2DBED] bg-white p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-[#C2DBED]/30 text-[#003A6C]">
                  <BadgeCheck />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#003A6C]">
                    Gestión de certificados
                  </h3>
                  <p className="text-sm text-gray-500">
                    Revisa y valida certificados emitidos en la plataforma
                  </p>
                </div>
              </Link>

            </div>
            <div className="flex items-start gap-4 rounded-2xl bg-[#EBF5FF] p-6 border-l-8 border-[#003A6C] shadow-sm mb-10">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#003A6C] text-white">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#003A6C] text-lg">
                  Acceso de administrador activo
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Desde este panel puedes supervisar la actividad del sistema y gestionar la
                  información crítica de usuarios y certificados.
                </p>
              </div>
            </div>
            {/* INFO FINAL */}
            <div className="flex items-start gap-4 rounded-2xl bg-[#FFF7ED] p-6 border-l-8 border-[#EA580C] shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-full bg-[#EA580C] text-white">
                <Info size={20} />
              </div>
              <div>
                <h4 className="font-bold text-[#B45309] text-lg">
                  Recomendación de uso
                </h4>
                <p className="mt-1 text-sm text-gray-600">
                  Utiliza los módulos de administración con responsabilidad. Todas las acciones
                  pueden afectar directamente a los usuarios del sistema.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminHome;
