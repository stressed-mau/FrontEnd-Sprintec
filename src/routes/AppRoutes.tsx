import { Navigate, Route, Routes } from "react-router-dom"

import AboutPage from "@/pages/AboutPage"
import AcademicFormationPage from "@/pages/AcademicFormationPage"
import ContactPage from "@/pages/ContactPage"
import CreateProyect from "@/pages/CreateProyect"
import ExperiencePage from "@/pages/ExperiencePage"
import HomeVisitor from "@/pages/HomeVisitor"
import LoginPage from "@/pages/LoginPage"
import NetworksPage from "@/pages/NetworksPage"
import PortfolioTemplatesPage from "@/pages/PortfolioTemplatesPage"
import PortfolioVisibilityConfigPage from "@/pages/PortfolioVisibilityConfigPage"
import ProfilePage from "@/pages/ProfilePage"
import PublishPortfolio from "@/pages/PublishPortfolio"
import RegisterPage from "@/pages/RegisterPage"
import RegisterProfilePage from '@/pages/profile/RegisterProfilePage';
import UserHome from "@/pages/UserHome"
import UserPersonalData from "@/pages/UserPersonalData"
import EditProfilePage from '@/pages/profile/EditProfilePage';
import ViewProfilePage from '@/pages/profile/ViewProfilePage';
import UserSkills from "@/pages/UserSkills"
import MyPortfolio from "@/pages/MyPortfolio"
import ProtectedRoute from "@/routes/ProtectedRoute"
import PublicPortfolio from "@/pages/PublicPortfolio"
import ExplorePortfolios from "@/pages/ExplorePortfolio"

import { LEGACY_DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, REGISTER_PROFILE_ROUTE, USER_HOME_ROUTE } from "@/routes/route-paths"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeVisitor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path={LOGIN_ROUTE} element={<LoginPage />} />
      <Route path={REGISTER_ROUTE} element={<RegisterPage />} />
      <Route path="/explore" element={<ExplorePortfolios />} />
      <Route path={REGISTER_PROFILE_ROUTE} element={<RegisterProfilePage />} />
      <Route element={<ProtectedRoute />}>
        
        <Route path={USER_HOME_ROUTE} element={<UserHome />} />
        <Route path={LEGACY_DASHBOARD_ROUTE} element={<Navigate to={USER_HOME_ROUTE} replace />} />       
        <Route path="/perfil" element={<ProfilePage />} />       
        <Route path="/habilidades" element={<UserSkills />} />
        <Route path="/red-profesional" element={<NetworksPage />} />
        <Route path="/formacion-academica" element={<AcademicFormationPage />} />
        <Route path="/experiencia" element={<ExperiencePage />} />
        <Route path="/plantillas" element={<PortfolioTemplatesPage />} />
        <Route path="/configuracion-visibilidad" element={<PortfolioVisibilityConfigPage />} />
        
      </Route>
      <Route path="/personal/ver" element={<ViewProfilePage />} />
      <Route path="/personal/editar" element={<EditProfilePage />} />
      <Route path="/proyectos" element={<CreateProyect />} />
      <Route path="/publicar" element={<PublishPortfolio />} />
      <Route path="/portafolio" element={<MyPortfolio />} />
      <Route path="/p/:slug" element={<PublicPortfolio />} />
    </Routes>
  )
}

export default AppRoutes
