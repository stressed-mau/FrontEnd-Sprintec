import { useNavigate } from "react-router-dom"

import { LOGIN_ROUTE } from "@/routes/route-paths"
import { clearAuthSession } from "@/services/auth"

export function useLogout() {
  const navigate = useNavigate()

  return function logout() {
    clearAuthSession()
    navigate(LOGIN_ROUTE, { replace: true })
  }
}
