import { Eye, Globe, ExternalLink } from "lucide-react";
import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
const MyPortfolio = () => {
  return (
    <div className="min-h-screen bg-[#F7F0E1]">
      <Header />
      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main className="flex-1 p-4 md:p-10">
          <div className="max-w-6xl mx-auto">
            {/* Header de la sección */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              
              
            </div>
          </div>
        </main>
      </div>
 
    </div>
  );
};

export default MyPortfolio;