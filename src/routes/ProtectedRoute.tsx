import { Navigate, Outlet, useLocation } from "react-router-dom"

import { UserGuide } from "@/components/UserGuide"
import { LOGIN_ROUTE, USER_HOME_ROUTE } from "@/routes/route-paths"
import { getAuthSession, isAuthenticated } from "@/services/auth"

type ProtectedRouteProps = {
  requireAdmin?: boolean
}

export default function ProtectedRoute({ requireAdmin = false }: ProtectedRouteProps) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to={LOGIN_ROUTE} replace state={{ from: location }} />
  }

  const session = getAuthSession()
  const isAdmin = session?.user.is_admin === true || session?.user.role_id === 2

  if (requireAdmin && !isAdmin) {
    return <Navigate to={USER_HOME_ROUTE} replace />
  }

  return (
    <>
      <Outlet />
      {!requireAdmin && <UserGuide />}
    </>
  )
}
