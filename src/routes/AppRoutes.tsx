import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import UserHome from '@/pages/UserHome'
import UserPersonalData from "@/pages/UserPersonalData";
import ProfilePage from "../pages/ProfilePage";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<UserHome />} />
      <Route path="/personal" element={<UserPersonalData />} />
      <Route path="/perfil" element={<ProfilePage />} />
    </Routes>
  )
}

export default AppRoutes