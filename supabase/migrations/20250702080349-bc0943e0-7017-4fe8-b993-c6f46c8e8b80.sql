-- Add review_type field to nfc_codes table to track different review types
ALTER TABLE nfc_codes ADD COLUMN review_type TEXT DEFAULT 'google_review';

-- Add constraint to ensure valid review types
ALTER TABLE nfc_codes ADD CONSTRAINT nfc_codes_review_type_check 
CHECK (review_type IN ('google_review', 'facebook', 'custom'));