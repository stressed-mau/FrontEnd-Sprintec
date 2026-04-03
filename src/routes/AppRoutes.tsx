import { Navigate, Route, Routes } from "react-router-dom"

import AboutPage from "@/pages/AboutPage"
import ContactPage from "@/pages/ContactPage"
import CreateProyect from "@/pages/CreateProyect"
import ExperiencePage from "@/pages/ExperiencePage"
import HomeVisitor from "@/pages/HomeVisitor"
import LoginPage from "@/pages/LoginPage"
import NetworksPage from "@/pages/NetworksPage"
import ProfilePage from "@/pages/ProfilePage"
import PublishPortfolio from "@/pages/PublishPortfolio"
import RegisterPage from "@/pages/RegisterPage"
import UserHome from "@/pages/UserHome"
import UserPersonalData from "@/pages/UserPersonalData"
import UserSkills from "@/pages/UserSkills"
import ProtectedRoute from "@/routes/ProtectedRoute"
import { LEGACY_DASHBOARD_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE, USER_HOME_ROUTE } from "@/routes/route-paths"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeVisitor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path={LOGIN_ROUTE} element={<LoginPage />} />
      <Route path={REGISTER_ROUTE} element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path={USER_HOME_ROUTE} element={<UserHome />} />
        <Route path={LEGACY_DASHBOARD_ROUTE} element={<Navigate to={USER_HOME_ROUTE} replace />} />
        <Route path="/personal" element={<UserPersonalData />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/proyectos" element={<CreateProyect />} />
        <Route path="/habilidades" element={<UserSkills />} />
        <Route path="/red-profesional" element={<NetworksPage />} />
        <Route path="/experiencia" element={<ExperiencePage />} />
        <Route path="/publicar" element={<PublishPortfolio />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
