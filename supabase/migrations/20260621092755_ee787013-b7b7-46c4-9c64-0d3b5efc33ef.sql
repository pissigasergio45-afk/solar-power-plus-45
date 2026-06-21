CREATE TABLE public.water_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  meter_id UUID REFERENCES public.water_meters(id) ON DELETE CASCADE,
  debit NUMERIC,
  volume NUMERIC,
  credit NUMERIC,
  alarme TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.water_readings TO authenticated;
GRANT ALL ON public.water_readings TO service_role;

ALTER TABLE public.water_readings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view their own water_readings"
  ON public.water_readings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users insert their own water_readings"
  ON public.water_readings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_water_readings_user_time ON public.water_readings (user_id, timestamp DESC);
CREATE INDEX idx_water_readings_meter_time ON public.water_readings (meter_id, timestamp DESC);

ALTER TABLE public.water_readings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.water_readings;