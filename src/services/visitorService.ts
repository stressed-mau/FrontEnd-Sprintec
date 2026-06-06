import { api } from "@/services/api"

export async function registerVisitor() {
  return api.post("/visitor")
}