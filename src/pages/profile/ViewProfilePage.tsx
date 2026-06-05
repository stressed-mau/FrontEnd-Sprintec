import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Briefcase, User } from 'lucide-react';
import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { getAuthSession } from '@/services/auth';
import { REGISTER_PROFILE_ROUTE } from '@/routes/route-paths';
import Header from '../../components/HeaderUser'; 
import Sidebar from '../../components/Sidebar';
import { useUserPersonalData } from '../../hooks/useUserPersonalData';
interface InfoItemProps {
  icon: ReactNode;
  label: string;
  value: string;
}
const ViewProfilePage = () => {
  const { form, phoneNumber, countryCode, loading, hasPersonalData } = useUserPersonalData();
  const session = getAuthSession();
  const accountEmail = session?.user?.email || "No disponible";
  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-[#003A6C] md:text-4xl">Ver datos personales</h1>
              <p className="mt-2 text-sm text-[#4B778D] md:text-base">Consulta la informacion registrada en tu perfil.</p>
            </div>

            {loading ? (
              <div className="flex h-64 items-center justify-center text-[#003A6C]">
                <div className="mr-2 h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Cargando...
              </div>
            ) : !hasPersonalData ? (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-[#003A6C]">Aun no hay registro</h2>
                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Registra tus datos personales para que esta informacion se muestre en tu portafolio publico. Este registro solo se puede realizar una vez.
                </p>
                <Link
                  to={REGISTER_PROFILE_ROUTE}
                  className="mt-6 inline-flex rounded-xl bg-[#003A6C] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#002d54]"
                >
                  Registrar datos personales
                </Link>
              </div>
            ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center mb-10">
                {/* Avatar y Nombre Principal */}
                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                    {form.image ? (
                      <img src={form.image} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User size={64} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Nombre Completo</p>
                  <p className="text-[#003A6C] text-xl font-semibold">{form.fullName || "Google User"}</p>
                </div>

                <div className="md:col-span-1">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Biografía</p>
                  <p className="text-gray-600 text-sm">{form.bio || "No especificado"}</p>
                </div>
              </div>

              <hr className="mb-8 border-gray-100" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
              <InfoItem icon={<Mail className="text-blue-500" />} label="Email de cuenta" value={accountEmail} />
                <InfoItem icon={<Mail className="text-purple-500" />} label="Email Público" value={form.email} />
                <InfoItem icon={<Phone className="text-green-500" />} label="Teléfono" value={phoneNumber ? `+${countryCode} ${phoneNumber}` : "No especificado"} />
                <InfoItem icon={<MapPin className="text-orange-500" />} label="Ubicación" value={form.location} />
                <InfoItem icon={<Briefcase className="text-indigo-500" />} label="Profesión" value={form.occupation} />
              </div>
            </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: InfoItemProps) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className="text-[#003A6C] font-medium text-sm">
        {value || "No especificado"}
      </p>
    </div>
  </div>
);

export default ViewProfilePage;
