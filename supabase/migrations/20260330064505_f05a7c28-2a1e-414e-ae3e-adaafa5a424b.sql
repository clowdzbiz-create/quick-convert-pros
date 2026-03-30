CREATE TABLE public.visitors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  session_id TEXT NOT NULL,
  page TEXT NOT NULL DEFAULT '/',
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert visitor logs" ON public.visitors
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Anyone can read visitor logs" ON public.visitors
  FOR SELECT TO anon USING (true);

CREATE INDEX idx_visitors_visitor_id ON public.visitors(visitor_id);
CREATE INDEX idx_visitors_created_at ON public.visitors(created_at);