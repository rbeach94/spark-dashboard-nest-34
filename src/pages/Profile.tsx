
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileButtons } from "@/components/profile/ProfileButtons";
import { ButtonForm } from "@/components/profile/ButtonForm";
import { LogoUpload } from "@/components/profile/LogoUpload";
import { useProfileData } from "@/hooks/useProfileData";
import { Tables } from "@/integrations/supabase/types";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  // Check if this is an admin accessing the profile
  const urlParams = new URLSearchParams(window.location.search);
  const isAdminAccess = urlParams.get('admin') === 'true';

  const {
    profile,
    buttons,
    isLoading,
    error,
    updateProfile,
    addButton,
    deleteButton,
    reorderButtons,
  } = useProfileData(id);

  const handleButtonClick = (button: Tables<"profile_buttons">) => {
    switch (button.action_type) {
      case 'link':
        window.open(button.action_value, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${button.action_value}`;
        break;
      case 'call':
        window.location.href = `tel:${button.action_value}`;
        break;
    }
  };

  const handleFormSubmit = async (formData: FormData) => {
    const label = formData.get('label')?.toString() || '';
    const action_type = formData.get('action_type')?.toString() || '';
    const action_value = formData.get('action_value')?.toString() || '';

    if (!label || !action_type || !action_value) {
      toast.error("All fields are required");
      return;
    }

    addButton.mutate({
      label,
      action_type,
      action_value,
    });
  };

  const handleReorder = (reorderedButtons: Tables<"profile_buttons">[]) => {
    reorderButtons.mutate(reorderedButtons);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {isAdminAccess && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Admin Mode</h3>
              <p className="text-blue-700">
                You are editing this profile as an administrator.
              </p>
            </div>
          )}

          <ProfileHeader 
            profile={profile}
            isLoading={isLoading}
            error={error}
          />

          <LogoUpload
            profileId={profile.id}
            logoUrl={profile.logo_url}
            onLogoUpdate={(url) => updateProfile.mutate({ logo_url: url })}
          />
          
          <div className="grid gap-8">
            <ProfileForm
              profile={profile}
              onUpdate={updateProfile.mutate}
              onSave={() => {}}
              showColorPicker={null}
              setShowColorPicker={() => {}}
            />

            <div className="space-y-6">
              <ButtonForm
                buttonColor={profile.button_color || '#8899ac'}
                buttonTextColor={profile.button_text_color || '#000000'}
                onSubmit={handleFormSubmit}
              />

              <ProfileButtons
                buttons={buttons || []}
                buttonColor={profile.button_color || '#8899ac'}
                buttonTextColor={profile.button_text_color || '#000000'}
                onDelete={(buttonId) => deleteButton.mutate(buttonId)}
                onButtonClick={handleButtonClick}
                onReorder={handleReorder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
