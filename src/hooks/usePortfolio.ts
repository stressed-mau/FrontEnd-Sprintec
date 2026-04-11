import { useEffect, useState } from "react";
import { getAuthSession } from "@/services/auth/auth-storage";
import { getUserInformation } from "@/services/PersonalDataService";
import { getProjects } from "@/services/ProjectService";
import {getSkills} from "@/services/skillsService"
export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const session = getAuthSession();

        if (!session?.user?.id) {
          console.error("No hay sesión válida");
          return;
        }

        const userId = session.user.id;

        const [user, projects, skills] = await Promise.all([
          getUserInformation(userId),
          getProjects(),
          getSkills(),
        ]);

        setPortfolio({
          user,
          projects,
          skills
        });

      } catch (error) {
        console.error("Error cargando portafolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { portfolio, loading };
};