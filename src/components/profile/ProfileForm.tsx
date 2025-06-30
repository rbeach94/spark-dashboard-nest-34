
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useRef, useState } from "react";
import { BasicProfileInfo } from "./BasicProfileInfo";
import { ContactInfo } from "./ContactInfo";
import { SocialMediaLinks } from "./SocialMediaLinks";
import { ColorPickerSection } from "./ColorPickerSection";
import { YouTubeEmbedSection } from "./YouTubeEmbedSection";
import { Link } from "react-router-dom";

interface ProfileFormProps {
  profile: Tables<"nfc_profiles">;
  onUpdate: (updates: Partial<Tables<"nfc_profiles">>) => void;
  onSave: () => void;
  showColorPicker: string | null;
  setShowColorPicker: (value: string | null) => void;
}

export const ProfileForm = ({ 
  profile, 
  onUpdate, 
  onSave,
  showColorPicker,
  setShowColorPicker 
}: ProfileFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const [youtubeEmbedUrl, setYoutubeEmbedUrl] = useState(profile.youtube_embed_url || '');

  const formatUrl = (url: string | null) => {
    if (!url || url.trim() === '') return null;
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
      return trimmedUrl;
    }
    return `https://${trimmedUrl}`;
  };

  const handleYouTubeToggle = (enabled: boolean) => {
    if (!enabled) {
      setYoutubeEmbedUrl('');
      onUpdate({ youtube_embed_url: null });
    }
  };

  const handleYouTubeEmbedChange = (url: string) => {
    setYoutubeEmbedUrl(url);
    onUpdate({ youtube_embed_url: url || null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const updates: Partial<Tables<"nfc_profiles">> = {
      full_name: formData.get('full_name')?.toString() || null,
      job_title: formData.get('job_title')?.toString() || null,
      company: formData.get('company')?.toString() || null,
      email: formData.get('email')?.toString() || null,
      phone: formData.get('phone')?.toString() || null,
      website: formatUrl(formData.get('website')?.toString() || null),
      bio: formData.get('bio')?.toString() || null,
      facebook_url: formatUrl(formData.get('facebook_url')?.toString() || null),
      instagram_url: formatUrl(formData.get('instagram_url')?.toString() || null),
      twitter_url: formatUrl(formData.get('twitter_url')?.toString() || null),
      youtube_url: formatUrl(formData.get('youtube_url')?.toString() || null),
      linkedin_url: formatUrl(formData.get('linkedin_url')?.toString() || null),
      youtube_embed_url: youtubeEmbedUrl || null,
    };

    onUpdate(updates);
    onSave();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="sticky top-0 z-50 bg-background py-4 shadow-md">
        <div className="flex gap-4 px-4">
          <Button 
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Save Changes
          </Button>
          <Link 
            to={`/profile/${profile.id}/view`}
            className="flex-1"
          >
            <Button 
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <div className="py-12">
        <BasicProfileInfo defaultValues={profile} />
        <ContactInfo defaultValues={profile} />
        <SocialMediaLinks defaultValues={profile} />
        
        <YouTubeEmbedSection 
          defaultValues={profile}
          onToggle={handleYouTubeToggle}
          onEmbedUrlChange={handleYouTubeEmbedChange}
        />
        
        <div className="pt-8 border-t">
          <h2 className="text-lg font-semibold mb-6">Appearance Settings</h2>
          <ColorPickerSection 
            profile={profile}
            onColorChange={onUpdate}
          />
        </div>
      </div>
    </form>
  );
};
