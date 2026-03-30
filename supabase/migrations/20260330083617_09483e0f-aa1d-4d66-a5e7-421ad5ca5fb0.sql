-- Make gallery_photos only readable via service role (admin edge function)
DROP POLICY IF EXISTS "Anyone can view gallery photos" ON public.gallery_photos;