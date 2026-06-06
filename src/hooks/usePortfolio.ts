import { useEffect, useState, useCallback } from "react";
import type { Portfolio} from "@/types/portfolio";
import { getAuthSession } from "@/services/auth/auth-storage";
import { api } from "@/services/api";
import { getUserInformation } from "@/services/personalDataService"; 
import { getSkills } from "@/services/skillsService";
import { getEducation } from "@/services/educationService";
import { getExperiences } from "@/services/experienceService";
import { getProjects } from "@/services/ProjectService";
import { getUserSocialNetworks } from "@/services/socialNetworksService";
import {
  normalizeProfile,
  mergeProjectDetails,
  normalizePortfolioProject,
  normalizePortfolioExperience,
  normalizePortfolioEducation,
} from "@/utils/PortfolioNormalizers";
type AuthSession = {
  user: {
    id: string | number;
    username: string;
    email?: string;
  };
};
type PortfolioApi = {
  id?: string | number;
  portfolio_id?: string | number;
  user_id?: string;
  userId?: string;
  owner_id?: string;
  owner?: { id?: string };
  creator_id?: string;
  config?: {
    id?: string | number;
    portfolio_id?: string | number;
    user_id?: string;
    userId?: string;
    owner_id?: string;
    user?: { id?: string };
    is_public?: boolean;
    template?: string | number;
    slug?: string;
  };
  profile?: {
    portfolio_id?: string | number;
    user_id?: string;
    userId?: string;
    id_user?: string;
    usuario_id?: string;
    user?: { id?: string };
    name?: string;
    occupation?: string;
    bio?: string;
    nationality?: string;
    email?: string;
    phone?: string;
    image?: string;
  };
  user?: { id?: string };
  user_information?: { user_id?: string };
  projects?: unknown[];
  skills?: unknown[];
  work_experiences?: unknown[];
  experiences?: unknown[];
  educations?: unknown[];
  social_networks?: SocialNetworkApi[];
  socialNetworks?: SocialNetworkApi[];
};
type SocialNetworkApi = {
  id?: string;
  name?: string;
  platform?: string;
  url?: string;
};
type TrackVisitInput = {
  slug: string;
  template_type: string;
};
const fetchPublicPortfolio = async (slug: string) => {
  const res = await api.get(`/p/${slug}`);
  return res.data?.success ? res.data.data : null;
};
const fetchUserPortfolio = async (session: AuthSession) => {
  const [userData, skills, experiences, education, projects, social] =
    await Promise.all([
      getUserInformation(String(session.user.id)),
      getSkills(),
      getExperiences(),
      getEducation(),
      getProjects(),
      getUserSocialNetworks(),
    ]);

  return {
    userData,
    skills,
    experiences,
    education,
    projects,
    social,
  };
};
const buildPortfolioFromApi = async (d:any , session: AuthSession | null, externalSlug?: string) => {
  const normalizedProjects = (d.projects || []).map(normalizePortfolioProject);

  const projectsWithDetails =
    !externalSlug && session?.user?.id
      ? await getProjects()
          .then((projects) => mergeProjectDetails(normalizedProjects, projects))
          .catch(() => normalizedProjects)
      : normalizedProjects;

  return {
    id: getPortfolioId(d) ? String(getPortfolioId(d)) : undefined,
    user_id: getPortfolioOwnerUserId(d) ? String(getPortfolioOwnerUserId(d)) : undefined,
    owner_id: getPortfolioOwnerUserId(d) ? String(getPortfolioOwnerUserId(d)) : undefined,
    user: {
      id: String(getPortfolioOwnerUserId(d) ?? ""),
      fullname: d.profile.name,
      occupation: d.profile.occupation || "",
      biography: d.profile.bio || "",
      nationality: d.profile.nationality || "",
      public_email: d.profile.email || "",
      phone_number: d.profile.phone || "",
      image_url: d.profile.image || "",
    },
    projects: projectsWithDetails,
    skills: d.skills,
    experiences: (d.work_experiences || d.experiences || []).map(normalizePortfolioExperience),
    educations: (d.educations || []).map(normalizePortfolioEducation),
    socialNetworks: (d.social_networks || d.socialNetworks || []).map((n: SocialNetworkApi, i: number) => ({
      id: String(n.id ?? `net-${i}`),
      name: n.name ?? n.platform ?? "Red social",
      platform: n.name ?? n.platform,
      url: n.url ?? "",
    })),
    certificates: [],
    isPublished: d.config.is_public ?? true,
    template: Number(d.config.template),
    config: d.config,
    profile: normalizeProfile(d),
  };
};
const trackVisit = async (portfolioData: TrackVisitInput) => {
  try {
    const res = await api.post('/tracking/visit', {
      portfolio_slug: portfolioData.slug,
      template_type: portfolioData.template_type,
      visited_at: new Date().toISOString(),
    });
    return res.data?.visit_id || res.data?.id || res.data?.data?.visit_id || res.data?.data?.id || null;
  } catch (error) {
    console.warn('Tracking no disponible:', error);
    return null;
  }
};

const getPortfolioId = (d: PortfolioApi) =>
  d.id ?? d.portfolio_id ?? d.config?.id ?? d.config?.portfolio_id ?? d.profile?.portfolio_id ?? null;

const getPortfolioOwnerUserId = (d: PortfolioApi): string | null => {
  const candidates = [
    d.user_id,
    d.userId,
    d.owner_id,
    d.owner?.id,
    d.creator_id,
    d.config?.user_id,
    d.config?.userId,
    d.config?.owner_id,
    d.config?.user?.id,
    d.profile?.user_id,
    d.profile?.userId,
    d.profile?.id_user,
    d.profile?.usuario_id,
    d.profile?.user?.id,
    d.user?.id,
    d.user_information?.user_id,
  ];

  const found = candidates.find((id) => Boolean(id));
  return found ? String(found) : null;
};

export const usePortfolio = (externalSlug?: string) => {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);
  const [visitId, setVisitId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    const session = getAuthSession();
    const slugToFetch = externalSlug || session?.user?.username;

    if (!slugToFetch) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const apiData = await fetchPublicPortfolio(slugToFetch);

      if (apiData) {
        const portfolio = await buildPortfolioFromApi(apiData, session, externalSlug);
        setPortfolio(portfolio);

        trackVisit({
          slug: apiData.config?.slug ?? slugToFetch,
          template_type: String(apiData.config?.template ?? "0"),
        }).then(setVisitId);

        return;
      }

      if (!externalSlug && session?.user?.id) {
        const userData = await fetchUserPortfolio(session);

        setPortfolio({
          id: undefined,
          user: {
            id: String(userData.userData.id),
            fullname: userData.userData.fullname || session.user.username,
            occupation: userData.userData.occupation || "",
            biography: userData.userData.biography || "",
            nationality: userData.userData.nationality || "",
            public_email: userData.userData.public_email || session.user.email,
            phone_number: userData.userData.phone_number || "",
          },
          skills: userData.skills,
          experiences: userData.experiences.map(normalizePortfolioExperience),
          educations: userData.education.map(normalizePortfolioEducation),
          projects: userData.projects.map(normalizePortfolioProject),
          socialNetworks: userData.social,
          certificates: [],
          template: 0,
          isPublished: false,
          config: (userData.userData as any).config || {},
          profile: normalizeProfile({ profile: userData.userData }),
        });

        return;
      }

      setPortfolio(null);
    } catch (error) {
      console.error("Error crítico en usePortfolio:", error);
      setPortfolio(null);
    } finally {
      setLoading(false);
    }
  }, [externalSlug]);;

  useEffect(() => {
    fetchAll();
    const handleUpdate = () => {
      fetchAll();
    };
    window.addEventListener("portfolioUpdated", handleUpdate);
    return () => window.removeEventListener("portfolioUpdated", handleUpdate);
  }, [fetchAll]);

  return { 
    portfolio, 
    loading, 
    refresh: fetchAll,
    visitId
  };
};
