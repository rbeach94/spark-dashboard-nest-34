import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import { cleanupProfileButtons } from "@/utils/buttonCleanup";

export const useProfileButtons = (profileId: string) => {
  const queryClient = useQueryClient();

  const { data: buttons, isLoading, error } = useQuery({
    queryKey: ['profile_buttons', profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_buttons')
        .select('*')
        .eq('profile_id', profileId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching buttons:', error);
        throw error;
      }

      return data;
    },
    enabled: !!profileId,
  });

  const addButton = useMutation({
    mutationFn: async (buttonData: {
      label: string;
      action_type: string;
      action_value: string;
    }) => {
      const { error } = await supabase
        .from('profile_buttons')
        .insert({
          profile_id: profileId,
          label: buttonData.label,
          action_type: buttonData.action_type,
          action_value: buttonData.action_value,
          sort_order: buttons?.length || 0,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', profileId] });
      toast.success("Button added successfully!");
    },
    onError: (error) => {
      console.error('Error adding button:', error);
      toast.error("Failed to add button");
    },
  });

  const deleteButton = useMutation({
    mutationFn: async (buttonId: string) => {
      const { error } = await supabase
        .from('profile_buttons')
        .delete()
        .eq('id', buttonId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', profileId] });
      toast.success("Button deleted successfully!");
    },
    onError: (error) => {
      console.error('Error deleting button:', error);
      toast.error("Failed to delete button");
    },
  });

  const reorderButtons = useMutation({
    mutationFn: async (updates: Tables<"profile_buttons">[]) => {
      const { error } = await supabase
        .from('profile_buttons')
        .upsert(
          updates.map((button, index) => ({
            id: button.id,
            sort_order: index,
            profile_id: button.profile_id,
            label: button.label,
            action_type: button.action_type,
            action_value: button.action_value
          }))
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', profileId] });
      toast.success("Buttons reordered successfully!");
    },
    onError: (error) => {
      console.error('Error reordering buttons:', error);
      toast.error("Failed to reorder buttons");
    },
  });

  const cleanupButtons = useMutation({
    mutationFn: async () => {
      return await cleanupProfileButtons(profileId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', profileId] });
      toast.success("Profile buttons cleaned up successfully!");
    },
    onError: (error) => {
      console.error('Error cleaning up buttons:', error);
      toast.error("Failed to cleanup buttons");
    },
  });

  return {
    buttons,
    isLoading,
    error,
    addButton,
    deleteButton,
    reorderButtons,
    cleanupButtons,
  };
};
