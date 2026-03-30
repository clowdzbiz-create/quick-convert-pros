CREATE TABLE public.conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_format TEXT NOT NULL,
  target_format TEXT NOT NULL,
  file_size_bytes BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.conversions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous selects" ON public.conversions
  FOR SELECT TO anon USING (true);