
import { useParams } from "react-router-dom";
import { Loader2, Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/view/ProfileHeader";
import { SaveContactButton } from "@/components/profile/view/SaveContactButton";
import { ProfileButtons } from "@/components/profile/view/ProfileButtons";
import { ProfileBio } from "@/components/profile/view/ProfileBio";
import { YouTubeEmbed } from "@/components/profile/view/YouTubeEmbed";
import { useProfileData } from "@/hooks/useProfileData";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ViewProfile = () => {
  const { id } = useParams<{ id: string }>();
  console.log('ViewProfile component mounted with id:', id);

  const { profile, buttons, isLoading, error } = useProfileData(id!);

  // Record visit when profile is loaded
  useEffect(() => {
    const recordVisit = async () => {
      if (profile?.id) {
        console.log('Recording visit for profile:', profile.id);
        const { error } = await supabase
          .from('profile_visits')
          .insert({ profile_id: profile.id });
        
        if (error) {
          console.error('Error recording visit:', error);
        }
      }
    };

    recordVisit();
  }, [profile?.id]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
        <p className="text-gray-600 mb-4">There was an error loading this profile. Please try again later.</p>
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
        <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4 pt-16 md:pt-4"
      style={{
        backgroundColor: profile.background_color || '#15202B',
        color: profile.text_color || '#FFFFFF',
      }}
    >
      <div className="max-w-md mx-auto space-y-6">
        <ProfileHeader profile={profile} />
        <SaveContactButton profile={profile} />
        <ProfileButtons profile={profile} buttons={buttons} />
        <YouTubeEmbed profile={profile} />
        <ProfileBio bio={profile.bio} />
        
        {/* Social Media Icons */}
        <div className="flex justify-center gap-4 mt-6">
          {profile.facebook_url && (
            <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer">
              <Facebook className="w-6 h-6" />
            </a>
          )}
          {profile.instagram_url && (
            <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer">
              <Instagram className="w-6 h-6" />
            </a>
          )}
          {profile.linkedin_url && (
            <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-6 h-6" />
            </a>
          )}
          {profile.twitter_url && (
            <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
              <X className="w-6 h-6" />
            </a>
          )}
          {profile.youtube_url && (
            <a href={profile.youtube_url} target="_blank" rel="noopener noreferrer">
              <Youtube className="w-6 h-6" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
