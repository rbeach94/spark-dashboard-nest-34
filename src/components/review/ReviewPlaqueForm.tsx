import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PlaceSearch } from "./PlaceSearch";

export const ReviewPlaqueForm = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [placeId, setPlaceId] = useState("");
  const [placeName, setPlaceName] = useState("");
  const [reviewType, setReviewType] = useState("google_review");
  const [facebookInput, setFacebookInput] = useState("");
  const [customUrl, setCustomUrl] = useState("");

  useEffect(() => {
    const fetchPlaqueData = async () => {
      if (!code) return;

      const { data: nfcCode, error } = await supabase
        .from("nfc_codes")
        .select("*")
        .eq("code", code)
        .single();

      if (error) {
        console.error("Error fetching NFC code:", error);
        toast.error("Error loading plaque data");
        return;
      }

      if (!nfcCode) {
        toast.error("Plaque not found");
        navigate("/dashboard");
        return;
      }

      if (nfcCode.title) setTitle(nfcCode.title);
      if (nfcCode.description) setDescription(nfcCode.description);
      if (nfcCode.review_type) setReviewType(nfcCode.review_type);
      if (nfcCode.redirect_url) {
        if (nfcCode.review_type === 'facebook') {
          setFacebookInput(nfcCode.redirect_url);
        } else if (nfcCode.review_type === 'custom') {
          setCustomUrl(nfcCode.redirect_url);
        }
      }
    };

    fetchPlaqueData();
  }, [code]);

  const generateFacebookReviewUrl = (input: string): string => {
    // If it's already a full Facebook review URL, return as-is
    if (input.includes('facebook.com') && input.includes('/reviews')) {
      return input;
    }
    
    // If it's a full Facebook profile URL, convert to review URL
    if (input.includes('facebook.com/')) {
      const username = input.split('/').pop();
      return `https://www.facebook.com/${username}/reviews`;
    }
    
    // If it's just a username, create the review URL
    return `https://www.facebook.com/${input}/reviews`;
  };

  const handlePlaceSelect = async (placeId: string, placeName: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please log in to continue");
        navigate("/login");
        return;
      }

      const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
      setPlaceId(placeId);
      setPlaceName(placeName);
      setTitle(`Review ${placeName}`);
      setDescription(`Please leave us a review on Google!`);
    } catch (error) {
      console.error("Error in handlePlaceSelect:", error);
      toast.error("Error setting up review link");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    // Generate redirect URL based on review type
    let redirectUrl = "";
    
    switch (reviewType) {
      case "google_review":
        if (!placeId) {
          toast.error("Please select a business for Google Review");
          return;
        }
        redirectUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
        break;
      case "facebook":
        if (!facebookInput.trim()) {
          toast.error("Please enter Facebook username or URL");
          return;
        }
        redirectUrl = generateFacebookReviewUrl(facebookInput.trim());
        break;
      case "custom":
        if (!customUrl.trim()) {
          toast.error("Please enter a custom review URL");
          return;
        }
        redirectUrl = customUrl.trim();
        break;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("nfc_codes")
        .update({
          title,
          description,
          type: "review",
          review_type: reviewType,
          redirect_url: redirectUrl,
          is_active: true,
        })
        .eq("code", code);

      if (error) throw error;

      toast.success("Review plaque updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating review plaque:", error);
      toast.error("Failed to update review plaque");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create Review Plaque</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reviewType">Review Type</Label>
              <select
                id="reviewType"
                value={reviewType}
                onChange={(e) => setReviewType(e.target.value)}
                className="w-full p-2 rounded border text-black"
                required
              >
                <option value="google_review">Google Review</option>
                <option value="facebook">Facebook Review</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>

            {reviewType === "google_review" && (
              <div className="space-y-2">
                <Label>Business Search</Label>
                <PlaceSearch onPlaceSelect={handlePlaceSelect} />
                {placeName && (
                  <div className="p-2 bg-green-50 rounded border text-green-800 text-sm">
                    Selected: {placeName}
                  </div>
                )}
              </div>
            )}

            {reviewType === "facebook" && (
              <div className="space-y-2">
                <Label htmlFor="facebookInput">Facebook Username or Profile URL</Label>
                <Input
                  id="facebookInput"
                  value={facebookInput}
                  onChange={(e) => setFacebookInput(e.target.value)}
                  placeholder="e.g., mybusiness or https://www.facebook.com/mybusiness"
                  required
                />
                <p className="text-sm text-gray-600">
                  Enter your Facebook username or full profile URL. We'll generate the review link for you.
                </p>
              </div>
            )}

            {reviewType === "custom" && (
              <div className="space-y-2">
                <Label htmlFor="customUrl">Custom Review URL</Label>
                <Input
                  id="customUrl"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/reviews"
                  required
                />
                <p className="text-sm text-gray-600">
                  Enter any URL where customers can leave reviews.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Review Plaque"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};