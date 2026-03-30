import { Routes, Route } from 'react-router-dom'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import HomeVisitor from '../pages/HomeVisitor'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import UserHome from '@/pages/UserHome'
import UserPersonalData from "@/pages/UserPersonalData";
import ProfilePage from "../pages/ProfilePage";
import CreateProyect from '../pages/CreateProyect';
import UserSkills from "@/pages/UserSkills";
import NetworksPage from '../pages/NetworksPage';
import ExperiencePage from '../pages/ExperiencePage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomeVisitor />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<UserHome />} />
      <Route path="/personal" element={<UserPersonalData />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/proyectos" element={<CreateProyect />} />
      <Route path="/habilidades" element={<UserSkills />} />
      <Route path="/red-profesional" element={<NetworksPage />} />
      <Route path="/experiencia" element={<ExperiencePage />} />
    </Routes>
  )
}

export default AppRoutes
