
import { Tables } from "@/integrations/supabase/types";

interface YouTubeEmbedProps {
  profile: Tables<"nfc_profiles">;
}

export const YouTubeEmbed = ({ profile }: YouTubeEmbedProps) => {
  if (!profile.youtube_embed_url) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="aspect-video bg-black/20 rounded-lg overflow-hidden shadow-lg">
        <iframe
          src={profile.youtube_embed_url}
          title="YouTube video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
          loading="lazy"
        />
      </div>
    </div>
  );
};
