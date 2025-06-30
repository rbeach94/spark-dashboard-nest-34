
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

export const useProfileButtons = (profileId: string) => {
  const queryClient = useQueryClient();

  // Check if this is admin access
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminAccess = urlParams.get('admin') === 'true';

  const { data: buttons, isLoading, error } = useQuery({
    queryKey: ['profile_buttons', profileId, isAdminAccess],
    queryFn: async () => {
      console.log('Fetching buttons for profile:', profileId, 'isAdmin:', isAdminAccess);
      
      // For admin access, verify admin permissions
      if (isAdminAccess) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');
        
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();
          
        if (userRole?.role !== 'admin') {
          throw new Error('Insufficient permissions');
        }
      }

      const { data, error } = await supabase
        .from('profile_buttons')
        .select('*')
        .eq('profile_id', profileId)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching buttons:', error);
        throw error;
      }

      console.log('Fetched buttons:', data?.map(b => ({ id: b.id, label: b.label })));
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
      queryClient.invalidateQueries({ queryKey: ['profile_buttons'] });
      toast.success("Button added successfully!");
    },
    onError: (error) => {
      console.error('Error adding button:', error);
      toast.error("Failed to add button");
    },
  });

  const deleteButton = useMutation({
    mutationFn: async (buttonId: string) => {
      console.log('Deleting button:', buttonId);
      
      const { error } = await supabase
        .from('profile_buttons')
        .delete()
        .eq('id', buttonId);
        
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      console.log('Button deletion completed:', buttonId);
      return buttonId;
    },
    onSuccess: (buttonId) => {
      console.log('Delete mutation successful for button:', buttonId);
      queryClient.invalidateQueries({ queryKey: ['profile_buttons'] });
      toast.success("Button deleted successfully!");
    },
    onError: (error) => {
      console.error('Delete mutation failed:', error);
      toast.error(`Failed to delete button: ${error.message}`);
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
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', profileId, isAdminAccess] });
      toast.success("Buttons reordered successfully!");
    },
    onError: (error) => {
      console.error('Error reordering buttons:', error);
      toast.error("Failed to reorder buttons");
    },
  });

  return {
    buttons,
    isLoading,
    error,
    addButton,
    deleteButton,
    reorderButtons,
  };
};
