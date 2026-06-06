import { useMemo } from 'react';
import type { Skill } from '@/services/skillsService';
import { sortTechnicalSkills, sortSoftSkills, filterSkills, filterTechnicalSkills, filterSoftSkills} from '@/utils/skills/skillFilters';

type Params = {
  skills: Skill[];
  searchQuery: string;
};

export function useSkillFilters({
  skills,
  searchQuery,
}: Params) {
  const technicalSkills = useMemo(
    () => sortTechnicalSkills(skills),
    [skills]
  );

  const softSkills = useMemo(
    () => sortSoftSkills(skills),
    [skills]
  );

  const filteredSkills = useMemo(
    () => filterSkills(skills, searchQuery),
    [skills, searchQuery]
  );

  const filteredTechnicalSkills = useMemo(
    () => filterTechnicalSkills(
      technicalSkills,
      searchQuery
    ),
    [technicalSkills, searchQuery]
  );

  const filteredSoftSkills = useMemo(
    () => filterSoftSkills(
      softSkills,
      searchQuery
    ),
    [softSkills, searchQuery]
  );

  return { technicalSkills, softSkills, filteredSkills, filteredTechnicalSkills, filteredSoftSkills };
}