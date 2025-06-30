
-- Add 'google_review' to the allowed action types for profile_buttons
ALTER TABLE profile_buttons DROP CONSTRAINT IF EXISTS profile_buttons_action_type_check;

ALTER TABLE profile_buttons ADD CONSTRAINT profile_buttons_action_type_check 
CHECK (action_type IN ('link', 'email', 'call', 'google_review'));
