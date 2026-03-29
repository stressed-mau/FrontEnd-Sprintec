import { Routes, Route } from 'react-router-dom'
import UserHome from '@/pages/UserHome'
import UserPersonalData from "@/pages/UserPersonalData";
import NetworksPage from "@/pages/NetworksPage";
import ProfilePage from "../pages/ProfilePage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<UserHome />} />
      <Route path="/dashboard" element={<UserHome />} />
      <Route path="/personal" element={<UserPersonalData />} />
      <Route path="/red-profesional" element={<NetworksPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
    </Routes>
  )
}

export default AppRoutes
