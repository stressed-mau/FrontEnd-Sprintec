import { Navigate, Outlet, useLocation } from "react-router-dom"

import { LOGIN_ROUTE } from "@/routes/route-paths"
import { isAuthenticated } from "@/services/auth"

export default function ProtectedRoute() {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to={LOGIN_ROUTE} replace state={{ from: location }} />
  }

  return <Outlet />
}
