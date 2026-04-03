import { useNavigate } from "react-router-dom"

import { HOME_VISITOR_ROUTE } from "@/routes/route-paths"
import { clearAuthSession } from "@/services/auth"

export function useLogout() {
  const navigate = useNavigate()

  return function logout() {
    clearAuthSession()
    navigate(HOME_VISITOR_ROUTE, { replace: true })
  }
}
