
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PlaceSearch } from "@/components/review/PlaceSearch";

interface ButtonFormProps {
  buttonColor: string;
  buttonTextColor: string;
  onSubmit: (formData: FormData) => void;
}

export const ButtonForm = ({ buttonColor, buttonTextColor, onSubmit }: ButtonFormProps) => {
  const [actionType, setActionType] = useState('link');
  const [selectedPlace, setSelectedPlace] = useState<{ id: string; name: string } | null>(null);

  const formatUrl = (actionType: string, value: string): string => {
    if (actionType !== 'link') return value;
    if (!value || value.trim() === '') return value;
    const trimmedValue = value.trim();
    if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
      return trimmedValue;
    }
    return `https://${trimmedValue}`;
  };

  const handlePlaceSelect = (placeId: string, placeName: string) => {
    setSelectedPlace({ id: placeId, name: placeName });
  };

  const generateGoogleReviewUrl = (placeId: string) => {
    return `https://search.google.com/local/writereview?placeid=${placeId}`;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const currentActionType = formData.get('action_type')?.toString() || '';
        let actionValue = formData.get('action_value')?.toString() || '';
        
        // Handle Google Review case
        if (currentActionType === 'google_review' && selectedPlace) {
          actionValue = generateGoogleReviewUrl(selectedPlace.id);
        }
        
        // Create a new FormData object with the processed data
        const processedFormData = new FormData();
        processedFormData.append('label', formData.get('label') || '');
        processedFormData.append('action_type', currentActionType);
        processedFormData.append('action_value', formatUrl(currentActionType, actionValue));
        
        onSubmit(processedFormData);
        (e.target as HTMLFormElement).reset();
        setSelectedPlace(null);
        setActionType('link');
      }}
      className="space-y-4"
    >
      <Input name="label" placeholder="Button Label" required className="text-black" />
      <select 
        name="action_type" 
        required 
        className="w-full p-2 rounded border text-black"
        value={actionType}
        onChange={(e) => setActionType(e.target.value)}
      >
        <option value="link">Link</option>
        <option value="email">Email</option>
        <option value="call">Call</option>
        <option value="google_review">Google Review</option>
      </select>
      
      {actionType === 'google_review' ? (
        <div className="space-y-2">
          <PlaceSearch onPlaceSelect={handlePlaceSelect} />
          {selectedPlace && (
            <div className="p-2 bg-green-50 rounded border text-green-800 text-sm">
              Selected: {selectedPlace.name}
            </div>
          )}
          <input type="hidden" name="action_value" value={selectedPlace?.id || ''} />
        </div>
      ) : (
        <Input 
          name="action_value" 
          placeholder={
            actionType === 'email' ? 'Email Address' :
            actionType === 'call' ? 'Phone Number' :
            'URL'
          } 
          required 
          className="text-black" 
        />
      )}
      
      <Button 
        type="submit" 
        className="w-full"
        style={{ 
          backgroundColor: buttonColor,
          color: buttonTextColor
        }}
        disabled={actionType === 'google_review' && !selectedPlace}
      >
        Add Button
      </Button>
    </form>
  );
};
