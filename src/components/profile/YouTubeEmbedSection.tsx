
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";

interface YouTubeEmbedSectionProps {
  defaultValues: Tables<"nfc_profiles">;
  onToggle: (enabled: boolean) => void;
  onEmbedUrlChange: (url: string) => void;
}

export const YouTubeEmbedSection = ({ 
  defaultValues, 
  onToggle, 
  onEmbedUrlChange 
}: YouTubeEmbedSectionProps) => {
  const [embedEnabled, setEmbedEnabled] = useState(!!defaultValues.youtube_embed_url);

  const handleToggle = (checked: boolean) => {
    setEmbedEnabled(checked);
    onToggle(checked);
    if (!checked) {
      onEmbedUrlChange('');
    }
  };

  const extractVideoId = (url: string) => {
    if (!url) return '';
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return url; // Return as-is if no pattern matches (might already be video ID)
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    const videoId = extractVideoId(url);
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    onEmbedUrlChange(embedUrl);
  };

  return (
    <div className="space-y-4 pt-6 border-t">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base font-medium">YouTube Video Embed</Label>
          <p className="text-sm text-muted-foreground">
            Add a YouTube video to your profile
          </p>
        </div>
        <Switch
          checked={embedEnabled}
          onCheckedChange={handleToggle}
        />
      </div>
      
      {embedEnabled && (
        <div className="space-y-4 pl-4 border-l-2 border-muted">
          <div>
            <Label htmlFor="youtube_embed_url" className="text-sm font-medium">
              YouTube Video URL
            </Label>
            <Input
              id="youtube_embed_url"
              name="youtube_embed_url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              defaultValue={defaultValues.youtube_embed_url || ''}
              onChange={handleUrlChange}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Paste any YouTube video URL (watch, share, or embed format)
            </p>
          </div>
          
          {defaultValues.youtube_embed_url && (
            <div className="mt-4">
              <Label className="text-sm font-medium">Preview:</Label>
              <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden">
                <iframe
                  src={defaultValues.youtube_embed_url}
                  title="YouTube video preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
