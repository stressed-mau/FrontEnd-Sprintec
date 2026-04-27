import { Navigate, Route, Routes } from "react-router-dom";

// Páginas Públicas
import HomeVisitor from "@/pages/HomeVisitor";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ExplorePortfolios from "@/pages/ExplorePortfolio";
import PublicPortfolio from "@/pages/PublicPortfolio";

// Páginas de Usuario / Perfil
import UserHome from "@/pages/UserHome";
import ProfilePage from "@/pages/ProfilePage";
import RegisterProfilePage from '@/pages/profile/RegisterProfilePage';
import EditProfilePage from '@/pages/profile/EditProfilePage';
import ViewProfilePage from '@/pages/profile/ViewProfilePage';
import UserPersonalData from "@/pages/UserPersonalData";

// Educación
import AddEducationPage from "@/pages/education/AddEducationPage";
import DeleteEducationPage from "@/pages/education/DeleteEducationPage";
import EditEducationPage from "@/pages/education/EditEducationPage";
import ViewEducationPage from "@/pages/education/ViewEducationPage";

// Experiencia
import AddExperiencePage from "@/pages/experience/AddExperiencePage";
import DeleteExperiencePage from "@/pages/experience/DeleteExperiencePage";
import EditExperiencePage from "@/pages/experience/EditExperiencePage";
import ViewExperiencePage from "@/pages/experience/ViewExperiencePage";

// Habilidades (Skills)
import ViewSkillsPage from "@/pages/skills/ViewSkillsPage";
import AddSkillsPage from "@/pages/skills/AddSkillsPage";
import EditSkillsPage from "@/pages/skills/EditSkillsPage";
import DeleteSkillsPage from "@/pages/skills/DeleteSkillsPage";

// Certificados
import ViewCertificatesPage from "@/pages/certificates/ViewCertificatesPage";
import AddCertificatesPage from "@/pages/certificates/AddCertificatesPage";
import EditCertificatesPage from "@/pages/certificates/EditCertificatesPage";
import DeleteCertificatesPage from "@/pages/certificates/DeleteCertificatesPage";

// Proyectos
import AddProjectsPage from "@/pages/projects/AddProjectsPage";
import DeleteProjectsPage from "@/pages/projects/DeleteProjectsPage";
import EditProjectsPage from "@/pages/projects/EditProjectsPage";
import ViewProjectsPage from "@/pages/projects/ViewProjectsPage";

// Portafolio y Otros
import NetworksPage from "@/pages/NetworksPage";
import PortfolioTemplatesPage from "@/pages/PortfolioTemplatesPage";
import PortfolioVisibilityConfigPage from "@/pages/PortfolioVisibilityConfigPage";
import PublishPortfolio from "@/pages/PublishPortfolio";
import MyPortfolio from "@/pages/MyPortfolio";
import ProtectedRoute from "@/routes/ProtectedRoute";

import { 
  LEGACY_DASHBOARD_ROUTE, 
  LOGIN_ROUTE, 
  REGISTER_ROUTE, 
  REGISTER_PROFILE_ROUTE, 
  USER_HOME_ROUTE, 
  CERTIFICATES_ROUTE 
} from "@/routes/route-paths";

function AppRoutes() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      <Route path="/" element={<HomeVisitor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path={LOGIN_ROUTE} element={<LoginPage />} />
      <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
      <Route path="/explore" element={<ExplorePortfolios />} />
      <Route path="/p/:slug" element={<PublicPortfolio />} />
      
      {/* --- RUTAS PROTEGIDAS --- */}
      <Route element={<ProtectedRoute />}>
        <Route path={USER_HOME_ROUTE} element={<UserHome />} />
        <Route path={LEGACY_DASHBOARD_ROUTE} element={<Navigate to={USER_HOME_ROUTE} replace />} />
        
        {/* Perfil y Datos Personales */}
        <Route path={REGISTER_PROFILE_ROUTE} element={<RegisterProfilePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/personal" element={<UserPersonalData />} />
        <Route path="/personal/ver" element={<ViewProfilePage />} />
        <Route path="/personal/editar" element={<EditProfilePage />} />

        {/* Habilidades */}
        <Route path="/habilidades" element={<Navigate to="/habilidades/ver" replace />} />
        <Route path="/habilidades/ver" element={<ViewSkillsPage />} />
        <Route path="/habilidades/añadir" element={<AddSkillsPage />} />
        <Route path="/habilidades/editar" element={<EditSkillsPage />} />
        <Route path="/habilidades/eliminar" element={<DeleteSkillsPage />} />

        {/* Proyectos */}
        <Route path="/proyectos" element={<Navigate to="/proyectos/ver" replace />} />
        <Route path="/proyectos/ver" element={<ViewProjectsPage />} />
        <Route path="/proyectos/añadir" element={<AddProjectsPage />} />
        <Route path="/proyectos/editar" element={<EditProjectsPage />} />
        <Route path="/proyectos/eliminar" element={<DeleteProjectsPage />} />

        {/* Formación Académica */}
        <Route path="/formacion-academica" element={<Navigate to="/formacion-academica/ver" replace />} />
        <Route path="/formacion-academica/ver" element={<ViewEducationPage />} />
        <Route path="/formacion-academica/agregar" element={<AddEducationPage />} />
        <Route path="/formacion-academica/editar" element={<EditEducationPage />} />
        <Route path="/formacion-academica/eliminar" element={<DeleteEducationPage />} />

        {/* Experiencia */}
        <Route path="/experiencia" element={<Navigate to="/experiencia/ver" replace />} />
        <Route path="/experiencia/ver" element={<ViewExperiencePage />} />
        <Route path="/experiencia/agregar" element={<AddExperiencePage />} />
        <Route path="/experiencia/editar" element={<EditExperiencePage />} />
        <Route path="/experiencia/eliminar" element={<DeleteExperiencePage />} />

        {/* Certificados */}
        <Route path={CERTIFICATES_ROUTE} element={<Navigate to="/certificados/ver" replace />} />
        <Route path="/certificados/ver" element={<ViewCertificatesPage />} />
        <Route path="/certificados/añadir" element={<AddCertificatesPage />} />
        <Route path="/certificados/editar" element={<EditCertificatesPage />} />
        <Route path="/certificados/eliminar" element={<DeleteCertificatesPage />} />

        {/* Configuración y Portafolio Propio */}
        <Route path="/red-profesional" element={<NetworksPage />} />
        <Route path="/plantillas" element={<PortfolioTemplatesPage />} />
        <Route path="/configuracion-visibilidad" element={<PortfolioVisibilityConfigPage />} />
        <Route path="/publicar" element={<PublishPortfolio />} />
        <Route path="/portafolio" element={<MyPortfolio />} />
      </Route>

      {/* Redirección por defecto si no encuentra la ruta */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;