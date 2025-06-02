
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const cleanupProfileButtons = async (profileId: string) => {
  try {
    console.log('Starting button cleanup for profile:', profileId);
    
    // Step 1: Get current user to verify permissions
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('User not authenticated');
    }

    // Step 2: Verify user owns this profile
    const { data: profile, error: profileError } = await supabase
      .from('nfc_profiles')
      .select('user_id')
      .eq('id', profileId)
      .single();

    if (profileError || !profile) {
      throw new Error('Profile not found');
    }

    if (profile.user_id !== user.id) {
      throw new Error('Unauthorized to modify this profile');
    }

    // Step 3: Delete the problematic button (malformed phone button)
    const { error: deleteError } = await supabase
      .from('profile_buttons')
      .delete()
      .eq('id', 'b0cac137-5cde-4591-abeb-fe64f1fb80ca')
      .eq('profile_id', profileId);

    if (deleteError) {
      console.error('Error deleting problematic button:', deleteError);
      throw deleteError;
    }

    console.log('Successfully deleted problematic button');

    // Step 4: Get remaining buttons and reorder them
    const { data: remainingButtons, error: fetchError } = await supabase
      .from('profile_buttons')
      .select('*')
      .eq('profile_id', profileId)
      .order('sort_order', { ascending: true });

    if (fetchError) {
      console.error('Error fetching remaining buttons:', fetchError);
      throw fetchError;
    }

    // Step 5: Reorder buttons sequentially
    if (remainingButtons && remainingButtons.length > 0) {
      const updates = remainingButtons.map((button, index) => ({
        id: button.id,
        sort_order: index,
        profile_id: button.profile_id,
        label: button.label,
        action_type: button.action_type,
        action_value: button.action_value
      }));

      const { error: reorderError } = await supabase
        .from('profile_buttons')
        .upsert(updates);

      if (reorderError) {
        console.error('Error reordering buttons:', reorderError);
        throw reorderError;
      }

      console.log('Successfully reordered remaining buttons');
    }

    toast.success("Profile buttons cleaned up successfully!");
    return { success: true, remainingCount: remainingButtons?.length || 0 };

  } catch (error) {
    console.error('Button cleanup failed:', error);
    toast.error("Failed to cleanup profile buttons");
    throw error;
  }
};
