
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

export const useProfile = (id: string) => {
  const queryClient = useQueryClient();

  // Check if this is admin access
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminAccess = urlParams.get('admin') === 'true';

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id, isAdminAccess],
    queryFn: async () => {
      console.log('Fetching profile data for id:', id);
      
      // For admin access, fetch profile without user restrictions
      if (isAdminAccess) {
        // First verify the current user is actually an admin
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
        .from('nfc_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Tables<"nfc_profiles">>) => {
      const { error } = await supabase
        .from('nfc_profiles')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id, isAdminAccess] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
};
