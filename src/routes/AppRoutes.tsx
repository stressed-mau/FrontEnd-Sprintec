import { Navigate, Route, Routes } from "react-router-dom"

import AboutPage from "@/pages/AboutPage"
import ContactPage from "@/pages/ContactPage"
import CreateProyect from "@/pages/CreateProyect"
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
import ProfilePage from "@/pages/ProfilePage"
import PublishPortfolio from "@/pages/PublishPortfolio"
import RegisterPage from "@/pages/RegisterPage"
import UserHome from "@/pages/UserHome"
import UserPersonalData from "@/pages/UserPersonalData"
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
import EditCertificatesPage from "@/pages/certificates/EditCertificatesPage"
import DeleteCertificatesPage from "@/pages/certificates/DeleteCertificatesPage"

import { LEGACY_DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, USER_HOME_ROUTE, CERTIFICATES_ROUTE } from "@/routes/route-paths"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeVisitor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path={LOGIN_ROUTE} element={<LoginPage />} />
      <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
      <Route path="/explore" element={<ExplorePortfolios />} />

      <Route element={<ProtectedRoute />}>
        <Route path={USER_HOME_ROUTE} element={<UserHome />} />
        <Route path={LEGACY_DASHBOARD_ROUTE} element={<Navigate to={USER_HOME_ROUTE} replace />} />
        
        <Route path="/perfil" element={<ProfilePage />} />
        
        <Route path="/habilidades" element={<ViewSkillsPage />} /> 
        <Route path="/habilidades/ver" element={<ViewSkillsPage />} />
        <Route path="/habilidades/añadir" element={<AddSkillsPage />} />
        <Route path="/habilidades/editar" element={<EditSkillsPage />} />
        <Route path="/habilidades/eliminar" element={<DeleteSkillsPage />} />
        <Route path="/red-profesional" element={<NetworksPage />} />
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
        <Route path="/certificados/editar" element={<EditCertificatesPage />} />
        <Route path="/certificados/eliminar" element={<DeleteCertificatesPage />} />
        <Route path="/plantillas" element={<PortfolioTemplatesPage />} />
        <Route path="/configuracion-visibilidad" element={<PortfolioVisibilityConfigPage />} />
        
      </Route>
      <Route path="/personal" element={<UserPersonalData />} />
      <Route path="/proyectos" element={<CreateProyect />} />
      <Route path="/publicar" element={<PublishPortfolio />} />
      <Route path="/portafolio" element={<MyPortfolio />} />
      <Route path="/p/:slug" element={<PublicPortfolio />} />
    </Routes>
  )
}

export default AppRoutes
