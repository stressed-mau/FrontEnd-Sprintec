import { useEffect, useState, useCallback } from "react";
import type { Portfolio, Experience, Project, Skill, SocialNetwork } from "@/types/portfolio";
import { getAuthSession } from "@/services/auth/auth-storage";
import { api } from "@/services/api";

import { getUserInformation } from "@/services/PersonalDataService"; 
import { getSkills } from "@/services/skillsService";
import { getEducation } from "@/services/educationService";
import { getExperiences } from "@/services/experienceService";
import { getProjects } from "@/services/ProjectService";
import { getUserSocialNetworks } from "@/services/socialNetworksService";
const normalizeProfile = (d: any) => ({
  fullname: d.profile.name || "",
  occupation: d.profile.occupation || "",
  biography: d.profile.bio || "",
  image_url: d.profile.image || "",
  public_email: d.profile.email || "",
  phone_number: d.profile.phone || "",
  nationality: d.profile.nacionality || d.profile.nationality || "",
});
export const usePortfolio = (externalSlug?: string) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const session = getAuthSession();
    // Priorizamos el slug externo (público), si no, usamos el del usuario logueado
    const slugToFetch = externalSlug || session?.user?.username;

    if (!slugToFetch) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // --- PASO 1: INTENTAR CARGAR PORTAFOLIO PUBLICADO ---
      try {
        const res = await api.get(`/p/${slugToFetch}`);
        
        if (res.data.success) {
          const d = res.data.data;
          setPortfolio({
            user: {
              id: String(d.profile.id),
              fullname: d.profile.name,
              occupation: d.profile.occupation || "",
              biography: d.profile.bio || "",
              nationality: d.profile.nationality || "",
              public_email: d.profile.email || "",
              phone_number: d.profile.phone || "",
              image_url: d.profile.image || "",
            },
            projects: d.projects.map((p: any) => ({
              ...p,
              nombre: p.title,
              descripcion: p.description, 
            })),
            skills: d.skills,
            experiences: d.work_experiences,
            educations: d.educations ?? [],
            socialNetworks: d.social_networks,
            certificates: d.certificates ?? [],
            isPublished: d.config.is_public ?? true,
            template: Number(d.config.template),
            config: d.config, 
            profile: normalizeProfile(d)
          });
          return; // Éxito: salimos de la función
        }
      } catch {
        console.warn("No se encontró portafolio publicado o error en endpoint /p/.");
      }

      // --- PASO 2: CARGA DE EMERGENCIA (DATOS INDIVIDUALES) ---
      // Si no hay portafolio publicado pero tenemos sesión, traemos sus datos base
      if (session?.user?.id) {
        const [userData, skills, experiences, education, projects, social] = await Promise.all([
          getUserInformation(String(session.user.id)),
          getSkills(),
          getExperiences(),
          getEducation(),
          getProjects(),
          getUserSocialNetworks(),
        ]);

        setPortfolio({
          user: {
            id: String(userData.id),
            fullname: (userData as any).name || (userData as any).fullname || (userData as any).full_name || session.user.username,
            occupation: userData.occupation || "",
            biography: (userData as any).bio || "",
            nationality: userData.nationality || "",
            public_email: (userData as any).email || session.user.email,
          phone_number: (userData as any).phone || "",
          },
          
          skills: skills as Skill[],
          experiences: [...experiences, ...education] as unknown as Experience[],
          educations: education as unknown as Experience[],
          projects: projects as unknown as Project[],
          socialNetworks: social as SocialNetwork[],
          certificates: [],
          template: 0, // Template 0 indica que no ha elegido uno aún
          isPublished: false,
          config: (userData as any).config || {}, 
          profile: normalizeProfile({ profile: userData }) || {},
          
        });
      } else {
        // Si no hay slug público y no hay sesión, no hay nada que mostrar
        setPortfolio(null);
      }
    } catch (error) {
      console.error("Error crítico en usePortfolio:", error);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, [externalSlug]);

  useEffect(() => {
    fetchAll();

    // Sincronización mediante eventos globales (útil para el Sidebar de Visibilidad)
    const handleUpdate = () => {
      console.log("Sincronizando datos de portafolio...");
      fetchAll();
    };

    window.addEventListener("portfolioUpdated", handleUpdate);
    return () => window.removeEventListener("portfolioUpdated", handleUpdate);
  }, [fetchAll]);

  return { 
    portfolio, 
    loading, 
    refresh: fetchAll 
  };
};
