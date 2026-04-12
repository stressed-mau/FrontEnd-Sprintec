import { useEffect, useState } from "react";
import type { Portfolio } from "@/types/portfolio";
//import { portfolioMock } from "@/mocks/portfolio.mock";

import { getAuthSession } from "@/services/auth/auth-storage";
import { getUserInformation } from "@/services/PersonalDataService";
import { getProjects } from "@/services/ProjectService";
import { getSkills } from "@/services/skillsService";
import { getUserSocialNetworks } from "@/services/socialNetworksService";
import { getExperiences } from "@/services/experienceService";

const USE_MOCK = false;

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
  type: e.type,
  company: e.company,
  email: e.email,
  position: e.position,
  description: e.description,
  startDate: e.startDate ?? e.start_date,
  endDate: e.endDate ?? e.end_date,
  current: e.current,
  image: e.image
});

const mapSkill = (s: any) => ({
  id: s.id,
  name: s.name,
  type: s.type,
  level: s.level
});

const mapSocialNetwork = (sn: any) => ({
  id: sn.id,
  name: sn.name,
  url: sn.url
});


export const usePortfolio = () => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // MOCK MODE

        const session = getAuthSession();

        if (!session?.user?.id) {
          console.error("No hay sesión válida");
          setLoading(false);
          return;
        }

        const userId = session.user.id;

        const [user, projects, skills, experiences, socialNetworks] =
          await Promise.all([
            getUserInformation(userId),
            getProjects(),
            getSkills(),
            getExperiences(),
            getUserSocialNetworks()
          ]);

        const mappedProjects = projects.map(mapProject);
        const mappedSkills = skills.map(mapSkill);
        const mappedExperiences = experiences.map(mapExperience);
        const mappedSocialNetworks = socialNetworks.map(mapSocialNetwork);

        setPortfolio({
          user,
          projects: mappedProjects,
          skills: mappedSkills,
          experiences: mappedExperiences,
          socialNetworks: mappedSocialNetworks,
          isPublished: user.is_published, 
          portfolioUrl: user.portfolio_url,
          template: user.template_id
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