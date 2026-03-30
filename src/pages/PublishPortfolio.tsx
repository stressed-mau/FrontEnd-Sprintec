import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';

const PublishPortfolio = () => {
  return (
    <div id="publishportfolio-page" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      <div className="flex flex-col md:flex-row">
        <Sidebar />

        <main id="publishportfolio-main" className="flex-1 p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center md:text-left">
                <h1 className="text-[#003A6C] text-3xl md:text-4xl font-bold mb-2">Publicar Portafolio</h1>
                <p className="text-gray-600 text-sm md:text-base">Configura tu portafolio, elige una plantilla y publícalo</p>
              </div>

            {/* Contenido aquí */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PublishPortfolio;