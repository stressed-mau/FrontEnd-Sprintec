import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';
import PortfolioCard from '../components/PortfolioCard';
import { Footer } from '@/components/Footer';
import { usePortfolio } from '../hooks/usePortfolio';

const UserHome = () => {
  const { portfolio, loading } = usePortfolio(); 

  return (
    <div id="userhome-page" className="min-h-screen bg-[#F7F0E1] flex flex-col">
      <Header />

      <div className="flex flex-col md:flex-row flex-1">
        <Sidebar />

        <main id="userhome-main" className="flex-1 p-4 md:p-10">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-12">
              <h1 className="text-[#003A6C] text-3xl md:text-5xl font-bold mb-4">
                Explorar Portafolios
              </h1>
              <p className="text-[#4982ad] text-lg">
                Descubre los portafolios de desarrolladores de software
              </p>
            </div>

            {/* 👇 Loading opcional */}
            {loading && (
              <p className="text-center text-gray-500">Cargando portafolios...</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {portfolio?.isPublished && (
                <PortfolioCard
                  name={portfolio.user.fullname}
                  role={portfolio.user.occupation}
                  location={portfolio.user.nationality}
                  description={portfolio.user.biography}
                  projectsCount={portfolio.projects.length}
                  skillsCount={portfolio.skills.length}
                  technologies={portfolio.skills.map(s => s.name)}
                  image={portfolio.user.image_url || "https://i.pravatar.cc/150"}
                  portfolioUrl={portfolio.portfolioUrl || "#"}
                />
              )}
            </div>

          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default UserHome;
