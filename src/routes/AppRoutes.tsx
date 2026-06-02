import { Navigate, Route, Routes } from "react-router-dom"

import AboutPage from "@/pages/AboutPage"
import ContactPage from "@/pages/ContactPage"
import AddEducationPage from "@/pages/education/AddEducationPage"
import DeleteEducationPage from "@/pages/education/DeleteEducationPage"
import EditEducationPage from "@/pages/education/EditEducationPage"
import ViewEducationPage from "@/pages/education/ViewEducationPage"
import AddExperiencePage from "@/pages/experience/AddExperiencePage"
import DeleteExperiencePage from "@/pages/experience/DeleteExperiencePage"
import EditExperiencePage from "@/pages/experience/EditExperiencePage"
import ViewExperiencePage from "@/pages/experience/ViewExperiencePage"
import HomeVisitor from "@/pages/HomeVisitor"
import LoginPage from "@/pages/LoginPage"
import NetworksPage from "@/pages/NetworksPage"
import PortfolioTemplatesPage from "@/pages/PortfolioTemplatesPage"
import PortfolioVisibilityConfigPage from "@/pages/PortfolioVisibilityConfigPage"
import PortfolioViewsReportPage from "@/pages/PortfolioViewsReportPage"
import ProfilePage from "@/pages/ProfilePage"
import PublishPortfolio from "@/pages/PublishPortfolio"
import RegisterPage from "@/pages/RegisterPage"
import UserHome from "@/pages/UserHome"
import MyPortfolio from "@/pages/MyPortfolio"
import ProtectedRoute from "@/routes/ProtectedRoute"
import PublicPortfolio from "@/pages/PublicPortfolio"
import ExplorePortfolios from "@/pages/ExplorePortfolio"
import ViewSkillsPage from "@/pages/skills/ViewSkillsPage"
import AddSkillsPage from "@/pages/skills/AddSkillsPage"
import EditSkillsPage from "@/pages/skills/EditSkillsPage"
import DeleteSkillsPage from "@/pages/skills/DeleteSkillsPage"
import ViewCertificatesPage from "@/pages/certificates/ViewCertificatesPage"
import AddCertificatesPage from "@/pages/certificates/AddCertificatesPage"
import DeleteCertificatesPage from "@/pages/certificates/DeleteCertificatesPage"
import AddProjectsPage from "@/pages/projects/AddProjectsPage"
import DeleteProjectsPage from "@/pages/projects/DeleteProjectsPage"
import EditProjectsPage from "@/pages/projects/EditProjectsPage"
import ViewProjectsPage from "@/pages/projects/ViewProjectsPage"
import RegisterProfilePage from '@/pages/profile/RegisterProfilePage';
import EditProfilePage from '@/pages/profile/EditProfilePage';
import ViewProfilePage from '@/pages/profile/ViewProfilePage';
import UserReports from "@/pages/admin/UserReports"
import CertificateReports from "@/pages/admin/CertificateReports"
import TendenciaPlantillasPage from "@/pages/TendenciaPlantillasPage"
import ReportsIndexPage from "@/pages/ReportsIndexPage"
import { NotificationsPage } from "@/pages/NotificationsPage"
import { MessagesPage } from "@/pages/MessagesPage"
import AdminHome from "@/pages/AdminHome"
import TermsPage from "@/pages/TermsPage" 
import { ADMIN_DASHBOARD_ROUTE, CERTIFICATES_ROUTE, LEGACY_DASHBOARD_ROUTE, LOGIN_ROUTE, MESSAGES_ROUTE, NOTIFICATIONS_ROUTE, REGISTER_PROFILE_ROUTE, REGISTER_ROUTE, TEMPLATE_TRENDS_ROUTE, REPORTES_INDEX_ROUTE, USER_HOME_ROUTE } from "@/routes/route-paths"


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeVisitor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path={LOGIN_ROUTE} element={<LoginPage />} />
      <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
      <Route path="/explore" element={<ExplorePortfolios />} />
      <Route path="/terminos" element={<TermsPage />} />
      <Route element={<ProtectedRoute />}>
        
        <Route path={LEGACY_DASHBOARD_ROUTE} element={<Navigate to={USER_HOME_ROUTE} replace />} />
        <Route path={USER_HOME_ROUTE} element={<UserHome />} />
        <Route path="/publicar" element={<PublishPortfolio />} />
        <Route path="/plantillas" element={<PortfolioTemplatesPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/visualizaciones" element={<PortfolioViewsReportPage />} />
        <Route path={REGISTER_PROFILE_ROUTE} element={<RegisterProfilePage />} />
         
        <Route path="/habilidades" element={<ViewSkillsPage />} /> 
        <Route path="/habilidades/ver" element={<ViewSkillsPage />} />
        <Route path="/habilidades/añadir" element={<AddSkillsPage />} />
        <Route path="/habilidades/editar" element={<EditSkillsPage />} />
        <Route path="/habilidades/eliminar" element={<DeleteSkillsPage />} />
        <Route path="/red-profesional" element={<NetworksPage />} />
        <Route path="/proyectos" element={<Navigate to="/proyectos/ver" replace />} />
        <Route path="/proyectos/ver" element={<ViewProjectsPage />} />
        <Route path="/proyectos/añadir" element={<AddProjectsPage />} />
        <Route path="/proyectos/editar" element={<EditProjectsPage />} />
        <Route path="/proyectos/eliminar" element={<DeleteProjectsPage />} />
        <Route path="/formacion-academica" element={<Navigate to="/formacion-academica/ver" replace />} />
        <Route path="/formacion-academica/agregar" element={<AddEducationPage />} />
        <Route path="/formacion-academica/ver" element={<ViewEducationPage />} />
        <Route path="/formacion-academica/editar" element={<EditEducationPage />} />
        <Route path="/formacion-academica/eliminar" element={<DeleteEducationPage />} />
        <Route path="/experiencia" element={<Navigate to="/experiencia/ver" replace />} />
        <Route path="/experiencia/agregar" element={<AddExperiencePage />} />
        <Route path="/experiencia/ver" element={<ViewExperiencePage />} />
        <Route path="/experiencia/editar" element={<EditExperiencePage />} />
        <Route path="/experiencia/eliminar" element={<DeleteExperiencePage />} />
        <Route path={CERTIFICATES_ROUTE} element={<Navigate to="/certificados/ver" replace />} />
        <Route path="/certificados/ver" element={<ViewCertificatesPage />} />
        <Route path="/certificados/añadir" element={<AddCertificatesPage />} />
        <Route path="/certificados/editar" element={<Navigate to="/certificados/ver" replace />} />
        <Route path="/certificados/eliminar" element={<DeleteCertificatesPage />} />
                
        <Route path="/configuracion-visibilidad" element={<PortfolioVisibilityConfigPage />} />
        <Route path={REPORTES_INDEX_ROUTE} element={<ReportsIndexPage />} />
        <Route path={TEMPLATE_TRENDS_ROUTE} element={<TendenciaPlantillasPage />} />
        <Route path={NOTIFICATIONS_ROUTE} element={<NotificationsPage />} />
        <Route path={MESSAGES_ROUTE} element={<MessagesPage />} />
        <Route path={`${MESSAGES_ROUTE}/:messageId`} element={<MessagesPage />} />
        <Route path="/messages/:messageId" element={<MessagesPage />} />
        <Route path="/personal/ver" element={<ViewProfilePage />} />
        <Route path="/personal/editar" element={<EditProfilePage />} />
        
        <Route path="/portafolio" element={<MyPortfolio />} />
      </Route> 
      <Route path="/p/:slug" element={<PublicPortfolio />} />
      <Route element={<ProtectedRoute requireAdmin />}>
        <Route path="/admin" element={<Navigate to={ADMIN_DASHBOARD_ROUTE} replace />} />
        <Route path={ADMIN_DASHBOARD_ROUTE} element={<AdminHome />} />
        <Route path="/admin/usuarios" element={<UserReports />} />
        <Route path="/admin/certificados" element={<CertificateReports />} />

      </Route>
    </Routes>
  )
}

export default AppRoutes
