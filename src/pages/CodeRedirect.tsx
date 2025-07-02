import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const CodeRedirect = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToProfile = async () => {
      console.log('Starting redirect process for code:', code);
      
      if (!code) {
        console.error('No code provided');
        navigate('/');
        return;
      }

      try {
        // Get the NFC code details
        console.log('Fetching NFC code details for:', code);
        const { data: nfcCode, error: nfcError } = await supabase
          .from('nfc_codes')
          .select('*')
          .eq('code', code)
          .maybeSingle();

        console.log('NFC code query result:', { nfcCode, nfcError });

        // If there was a database error
        if (nfcError) {
          console.error('Database error:', nfcError);
          navigate('/');
          return;
        }

        // If the code doesn't exist in the database
        if (!nfcCode) {
          console.log('Code not found, redirecting to activate page');
          navigate(`/activate/${code}`);
          return;
        }

        // Handle review plaque type
        if (nfcCode.type === 'review') {
          console.log('Review plaque detected:', nfcCode);
          
          // If the plaque is not active or has no redirect URL, redirect to edit page
          if (!nfcCode.is_active || !nfcCode.redirect_url) {
            console.log('Review plaque not active or no redirect URL, redirecting to edit:', { 
              is_active: nfcCode.is_active,
              redirect_url: nfcCode.redirect_url
            });
            navigate(`/plaque/${code}`);
            return;
          }

          try {
            // Record the visit before redirecting
            console.log('Recording visit for review plaque:', nfcCode.id);
            const { error: visitError } = await supabase
              .from('profile_visits')
              .insert({ profile_id: nfcCode.id });

            if (visitError) {
              console.error('Error recording visit:', visitError);
              // Continue with redirect even if visit recording fails
            } else {
              console.log('Visit recorded successfully');
            }

            // Redirect to the plaque's redirect URL
            console.log(`Redirecting to ${nfcCode.review_type || 'review'} URL:`, nfcCode.redirect_url);
            window.location.href = nfcCode.redirect_url;
          } catch (error) {
            console.error('Error during visit recording:', error);
            // Still redirect even if there's an error
            window.location.href = nfcCode.redirect_url;
          }
          return;
        }

        // Handle profile type
        if (!nfcCode.is_active) {
          console.log('Profile not active, redirecting to activate page');
          navigate(`/activate/${code}`);
          return;
        }

        if (!nfcCode.url) {
          console.log('No URL found for profile, redirecting to activate page');
          navigate(`/activate/${code}`);
          return;
        }

        // Construct and redirect to the profile URL
        const profileUrl = `/profile/${nfcCode.url}/view`;
        console.log('Redirecting to:', profileUrl);
        navigate(profileUrl);
        
      } catch (error) {
        console.error('Unexpected error during redirect:', error);
        navigate('/');
      }
    };

    redirectToProfile();
  }, [code, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default CodeRedirect;