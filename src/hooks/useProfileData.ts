
import { useProfile } from "./useProfile";
import { useProfileButtons } from "./useProfileButtons";

export const useProfileData = (id: string) => {
  const { 
    profile, 
    isLoading: profileLoading, 
    error: profileError,
    updateProfile 
  } = useProfile(id);

  const {
    buttons,
    isLoading: buttonsLoading,
    error: buttonsError,
    addButton,
    deleteButton,
    reorderButtons,
    cleanupButtons
  } = useProfileButtons(id);

  return {
    profile,
    buttons,
    isLoading: profileLoading || buttonsLoading,
    error: profileError || buttonsError,
    updateProfile,
    addButton,
    deleteButton,
    reorderButtons,
    cleanupButtons,
  };
};
