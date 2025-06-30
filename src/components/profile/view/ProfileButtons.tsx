
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

interface ProfileButtonsProps {
  profile: Tables<"nfc_profiles">;
  buttons?: {
    id: string;
    label: string;
    action_type: string;
    action_value: string;
  }[];
}

export const ProfileButtons = ({ profile, buttons }: ProfileButtonsProps) => {
  const handleButtonClick = async (button: { id: string, action_type: string, action_value: string, label: string }) => {
    console.log('Button clicked:', button.label, button.action_type, button.action_value);
    
    try {
      // Record the button click
      const { error } = await supabase
        .from('profile_button_clicks')
        .insert({
          button_id: button.id,
          profile_id: profile.id
        });

      if (error) {
        console.error('Error recording button click:', error);
      }

      // Perform the button action
      switch (button.action_type) {
        case 'link':
          console.log('Opening link:', button.action_value);
          // Use window.open for better iOS compatibility
          const newWindow = window.open(button.action_value, '_blank', 'noopener,noreferrer');
          if (!newWindow) {
            // Fallback if popup blocked
            window.location.href = button.action_value;
          }
          break;
        case 'email':
          console.log('Opening email:', button.action_value);
          window.location.href = `mailto:${button.action_value}`;
          break;
        case 'call':
          console.log('Opening phone:', button.action_value);
          window.location.href = `tel:${button.action_value}`;
          break;
        case 'google_review':
          console.log('Opening Google Review:', button.action_value);
          const reviewWindow = window.open(button.action_value, '_blank', 'noopener,noreferrer');
          if (!reviewWindow) {
            // Fallback if popup blocked
            window.location.href = button.action_value;
          }
          break;
        default:
          console.warn('Unknown button action type:', button.action_type);
      }
    } catch (error) {
      console.error('Error handling button click:', error);
    }
  };

  if (!buttons || buttons.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {buttons.map((button) => (
        <Button
          key={button.id}
          className="w-full touch-manipulation"
          style={{ 
            backgroundColor: profile.button_color || '#8899ac',
            color: profile.button_text_color || '#FFFFFF'
          }}
          onClick={() => handleButtonClick(button)}
          type="button"
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};
