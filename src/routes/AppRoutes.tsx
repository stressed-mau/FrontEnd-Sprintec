import { Routes, Route } from 'react-router-dom'
import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import HomeVisitor from '../pages/HomeVisitor'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import UserHome from '@/pages/UserHome'
import UserPersonalData from "@/pages/UserPersonalData";
import ProfilePage from "../pages/ProfilePage";
<<<<<<< HEAD
<<<<<<< HEAD
import CreateProyect from '../pages/CreateProyect';
=======
import UserSkills from "@/pages/UserSkills";
>>>>>>> 46a10fa7d79558f1c407ddab3f9259abc432aae2
=======
import ExperiencePage from "@/pages/ExperiencePage";
>>>>>>> 3fbf0f81a1fbdeb04e3466d6bdd802fc57f1ba4b

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
      <Route path="/red-profesional" element={<NetworksPage />} />
      <Route path="/experiencia" element={<ExperiencePage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/proyectos" element={<CreateProyect />} />
=======
      <Route path="/habilidades" element={<UserSkills />} />
    </Routes>
  )
}

export default AppRoutes
