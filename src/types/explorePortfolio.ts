export interface PortfolioSkillApiDto {
  name?: string | null;
}

export interface PortfolioCardApiDto {
  user_id?: string | number | null;
  slug?: string | null;
  username?: string | null;
  fullname?: string | null;
  name?: string | null;
  occupation?: string | null;
  image_url?: string | null;
  image?: string | null;
  photo?: string | null;
  avatar?: string | null;
  profile_image?: string | null;
  profileImage?: string | null;

  user?: {
    image_url?: string | null;
    image?: string | null;
    photo?: string | null;
    avatar?: string | null;
  } | null;

  user_information?: {
    image_url?: string | null;
    image?: string | null;
    photo?: string | null;
    avatar?: string | null;
  } | null;

  skills_count?: number | null;
  projects_count?: number | null;

  skills?: Array<string | PortfolioSkillApiDto>;
}

export interface CardsResponseDto {
  success?: boolean;

  data?:
    | PortfolioCardApiDto[]
    | {
        count?: number;
        portfolios?: PortfolioCardApiDto[];
      };
}