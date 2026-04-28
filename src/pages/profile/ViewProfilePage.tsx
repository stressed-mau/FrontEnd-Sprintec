import { Mail, Phone, MapPin, Briefcase, User } from 'lucide-react';
import Header from '../../components/HeaderUser'; 
import Sidebar from '../../components/Sidebar';
import { Footer } from '@/components/Footer';
import { useUserPersonalData } from '../../hooks/useUserPersonalData';
import { getAuthSession } from '@/services/auth';
const ViewProfilePage = () => {
  const { form, phoneNumber, countryCode, loading } = useUserPersonalData();
  const session = getAuthSession();
  const accountEmail = session?.user?.email || "No disponible";
  return (
    <div className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />
      <div className="flex flex-col lg:flex-row flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 md:p-10">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-[#003A6C] text-3xl font-bold mb-2">Datos Personales</h1>
            <p className="text-gray-600 mb-6 text-sm">Información de tu perfil</p>

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

              {/* Grid de detalles */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-12">
              <InfoItem icon={<Mail className="text-blue-500" />} label="Email de cuenta" value={accountEmail} />
                <InfoItem icon={<Mail className="text-purple-500" />} label="Email Público" value="No especificado" />
                <InfoItem icon={<Phone className="text-green-500" />} label="Teléfono" value={phoneNumber ? `+${countryCode} ${phoneNumber}` : "No especificado"} />
                <InfoItem icon={<MapPin className="text-orange-500" />} label="Ubicación" value={form.location} />
                <InfoItem icon={<Briefcase className="text-indigo-500" />} label="Profesión" value={form.occupation} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-gray-50 rounded-xl">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
      <p className="text-[#003A6C] font-medium text-sm">{value || "No especificado"}</p>
    </div>
  </div>
);

export default ViewProfilePage;
