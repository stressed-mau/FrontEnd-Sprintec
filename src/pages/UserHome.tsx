import Header from '../components/HeaderUser';
import Sidebar from '../components/Sidebar';

const UserHome = () => {
  return (
    <div id="userhome-page" className="min-h-screen bg-[#F7F0E1]">
      <Header />

      {/* En móvil usamos flex-col para que el Sidebar (Grid) salga arriba del contenido */}
      <div className="flex flex-col md:flex-row">
        
        {/* En móvil este componente será el Grid, en escritorio será la barra lateral */}
        <Sidebar />

        <main id="userhome-main" className="flex-1 p-4 md:p-10">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 id="userhome-title"className="text-[#003A6C] text-3xl md:text-5xl font-bold mb-4">
                Explorar Portafolios
              </h1>
              <p className="text-[#4982ad] text-lg">
                Descubre los portafolios de desarrolladores de software
              </p>
            </div>
            
            {/* Contenido de portafolios aquí */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserHome;