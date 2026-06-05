import { useCallback, useEffect } from 'react';
import { getSkills } from '@/services/skillsService';
import {
  AUTH_SESSION_CHANGED_EVENT,
  getAuthToken,
} from '@/services/auth/auth-storage';
import { normalizeErrorMessage } from '@/utils/errorUtils';
import type { Skill } from '@/services/skillsService';

type Params = {
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>;
  setPageError: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export function useSkillsLoader({
  setSkills,
  setPageError,
  setIsLoading,
}: Params) {
  const loadSkills = useCallback(async () => {
    if (!getAuthToken()) {
      setSkills([]);
      setPageError('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setPageError('');

    try {
      const remoteSkills = await getSkills();
      setSkills(remoteSkills);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'No se pudieron cargar las habilidades.';

      setPageError(
        normalizeErrorMessage(message)
      );
    } finally {
      setIsLoading(false);
    }
  }, [setSkills, setPageError, setIsLoading]);

  useEffect(() => {
    const handleAuthSessionChanged = () => {
      if (getAuthToken()) {
        void loadSkills();
        return;
      }

      setSkills([]);
      setPageError('');
      setIsLoading(false);
    };

    handleAuthSessionChanged();

    window.addEventListener(
      AUTH_SESSION_CHANGED_EVENT,
      handleAuthSessionChanged
    );

    return () =>
      window.removeEventListener(
        AUTH_SESSION_CHANGED_EVENT,
        handleAuthSessionChanged
      );
  }, [
    loadSkills,
    setSkills,
    setPageError,
    setIsLoading,
  ]);

  return {
    loadSkills,
  };
}