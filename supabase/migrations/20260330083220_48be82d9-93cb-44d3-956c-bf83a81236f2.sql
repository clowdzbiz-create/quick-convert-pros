-- Remove public SELECT on visitors (sensitive data exposure)
DROP POLICY IF EXISTS "Anyone can read visitor logs" ON public.visitors;

-- Add validation on gallery inserts
DROP POLICY IF EXISTS "Anyone can insert gallery photos" ON public.gallery_photos;
CREATE POLICY "Validated gallery inserts" ON public.gallery_photos
  FOR INSERT TO anon
  WITH CHECK (
    file_name IS NOT NULL AND
    file_path IS NOT NULL AND
    length(file_name) <= 500 AND
    length(file_path) <= 500
  );

-- Add validation on conversion inserts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.conversions;
CREATE POLICY "Validated conversion inserts" ON public.conversions
  FOR INSERT TO anon
  WITH CHECK (
    source_format IS NOT NULL AND
    target_format IS NOT NULL AND
    length(source_format) <= 20 AND
    length(target_format) <= 20
  );