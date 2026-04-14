import { useEffect, useState, useCallback } from "react";
import type { Portfolio } from "@/types/portfolio";
import { portfolioMock } from "@/mocks/portfolio.mock";
import { getAuthSession } from "@/services/auth/auth-storage";
import { api } from "@/services/api";

const USE_MOCK = false;

/** * Mapeadores: Mantenerlos es vital para que si el backend cambia 
 * un nombre de columna (ej: 'work_experiences' vs 'experiences'), 
 * tu componente no deje de funcionar.
 */
const mapProject = (p: any) => ({
  nombre: p.title,
  descripcion: p.description,
  tecnologias: p.technologies || [],
  rol: p.project_rol,
  fechaInicio: p.initial_date,
  fechaFin: p.final_date,
  is_current: p.is_current,
  github: p.url_to_project,
  demo: p.url_to_deploy,
  image: p.photoghaph || ""
});

const mapExperience = (e: any) => ({
  id: e.id,
  company: e.company_name, // Ajustado a tu nueva API
  position: e.rol,         // Ajustado a tu nueva API
  description: e.description,
  email: e.company_email,
  image: e.logo_url
});

export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);

      if (USE_MOCK) {
        setPortfolio(portfolioMock as any);
        return;
      }

      const session = getAuthSession();
      const username = session?.user?.username;

      if (!username) {
        setLoading(false);
        return;
      }

      // 1. PETICIÓN ÚNICA A LA NUEVA API
      const res = await api.get(`/p/${username}`);
      
      if (res.data.success) {
        const d = res.data.data;

        // 2. ARMADO DEL ESTADO CON EL MAPEO
        setPortfolio({
          user: {
            ...d.profile,
            fullname: d.profile.name, // Ajuste de compatibilidad
          },
          projects: d.projects.map(mapProject),
          skills: d.skills.map((s: any) => ({
            name: s.name,
            level: s.level_of_domain,
            type: s.type
          })),
          experiences: d.work_experiences.map(mapExperience),
          socialNetworks: d.social_networks,
          isPublished: d.config.is_public ?? true,
          portfolioUrl: d.config.slug,
          template: d.config.template
        });
      }
    } catch (error) {
      console.error("Error cargando portafolio:", error);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();

    // 3. ESCUCHAR EL EVENTO DE PUBLICACIÓN EXITOSA
    const handleUpdate = () => {
      console.log("Sincronizando: Portafolio actualizado...");
      fetchAll();
    };

    window.addEventListener("portfolioUpdated", handleUpdate);
    return () => window.removeEventListener("portfolioUpdated", handleUpdate);
  }, [fetchAll]);

  return { portfolio, loading, refresh: fetchAll };
};