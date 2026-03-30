-- Storage bucket for gallery photos
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Gallery metadata table
CREATE TABLE public.gallery_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  ai_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.gallery_photos ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view gallery photos" ON public.gallery_photos
  FOR SELECT TO anon USING (true);

-- Public insert (password-gated in UI)
CREATE POLICY "Anyone can insert gallery photos" ON public.gallery_photos
  FOR INSERT TO anon WITH CHECK (true);

-- Storage policies
CREATE POLICY "Anyone can upload to gallery" ON storage.objects
  FOR INSERT TO anon WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Anyone can view gallery files" ON storage.objects
  FOR SELECT TO anon USING (bucket_id = 'gallery');