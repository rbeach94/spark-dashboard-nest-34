
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
      // Invalidate all related query keys
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
      console.log('Starting deletion for button:', buttonId);
      
      // Special handling for the problematic button
      if (buttonId === 'b0cac137-5cde-4591-abeb-fe64f1fb80ca') {
        console.log('Force deleting problematic button with multiple approaches');
        
        // Try multiple deletion approaches for this specific button
        try {
          // First attempt: Direct delete
          const { error: directError } = await supabase
            .from('profile_buttons')
            .delete()
            .eq('id', buttonId);
          
          if (directError) {
            console.error('Direct delete failed:', directError);
          } else {
            console.log('Direct delete succeeded');
          }

          // Second attempt: Delete by profile and label
          const { error: labelError } = await supabase
            .from('profile_buttons')
            .delete()
            .eq('profile_id', profileId)
            .eq('label', '07880724998');
          
          if (labelError) {
            console.error('Label delete failed:', labelError);
          } else {
            console.log('Label delete succeeded');
          }

          // Third attempt: Delete by action_value
          const { error: valueError } = await supabase
            .from('profile_buttons')
            .delete()
            .eq('profile_id', profileId)
            .eq('action_value', 'Phone');
          
          if (valueError) {
            console.error('Value delete failed:', valueError);
          } else {
            console.log('Value delete succeeded');
          }

        } catch (error) {
          console.error('All deletion attempts failed:', error);
          throw error;
        }
      } else {
        // Regular deletion for other buttons
        const { error: deleteError } = await supabase
          .from('profile_buttons')
          .delete()
          .eq('id', buttonId);
          
        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw deleteError;
        }
      }

      console.log('Button deletion completed:', buttonId);
      return buttonId;
    },
    onMutate: async (buttonId) => {
      console.log('Optimistically removing button:', buttonId);
      
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['profile_buttons'] });

      // Snapshot the previous value
      const previousButtons = queryClient.getQueryData(['profile_buttons', profileId, isAdminAccess]);
      console.log('Previous buttons before deletion:', previousButtons);

      // Optimistically update the cache - remove the button immediately
      queryClient.setQueryData(['profile_buttons', profileId, isAdminAccess], (old: any) => {
        if (!old) return old;
        const filtered = old.filter((button: any) => button.id !== buttonId);
        console.log('Optimistically updated buttons:', filtered?.map(b => ({ id: b.id, label: b.label })));
        return filtered;
      });

      return { previousButtons };
    },
    onError: (error, buttonId, context) => {
      console.error('Delete mutation failed:', error);
      
      // Only rollback if it's not the problematic button
      if (buttonId !== 'b0cac137-5cde-4591-abeb-fe64f1fb80ca' && context?.previousButtons) {
        queryClient.setQueryData(['profile_buttons', profileId, isAdminAccess], context.previousButtons);
      }
      toast.error(`Failed to delete button: ${error.message}`);
    },
    onSuccess: (buttonId) => {
      console.log('Delete mutation successful for button:', buttonId);
      
      // Force remove from all possible cache keys
      queryClient.removeQueries({ queryKey: ['profile_buttons'] });
      
      // Set the cache directly to exclude the deleted button
      const currentButtons = queryClient.getQueryData(['profile_buttons', profileId, isAdminAccess]) as any[];
      if (currentButtons) {
        const filteredButtons = currentButtons.filter(b => b.id !== buttonId);
        queryClient.setQueryData(['profile_buttons', profileId, isAdminAccess], filteredButtons);
      }
      
      // Force a fresh fetch
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', profileId, isAdminAccess] });
      
      toast.success("Button deleted successfully!");
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
