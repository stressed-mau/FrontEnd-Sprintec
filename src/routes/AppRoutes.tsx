import { Routes, Route } from 'react-router-dom'
import UserHome from '@/pages/UserHome'
import UserPersonalData from "@/pages/UserPersonalData";
import ProfilePage from "../pages/ProfilePage";
import CreateProyect from '../pages/CreateProyect';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/dashboard" element={<UserHome />} />
      <Route path="/personal" element={<UserPersonalData />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/proyectos" element={<CreateProyect />} />
    </Routes>
  )
}

export default AppRoutes
