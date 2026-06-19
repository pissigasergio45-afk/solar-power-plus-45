
-- =========================
-- ENUMS
-- =========================
CREATE TYPE public.app_role AS ENUM ('admin', 'client');
CREATE TYPE public.alert_type AS ENUM ('leak', 'high_consumption', 'low_battery', 'offline', 'no_transmission');
CREATE TYPE public.alert_severity AS ENUM ('info', 'warning', 'critical');

-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- =========================
-- USER ROLES
-- =========================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Admin can view all profiles and roles
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- WATER METERS
-- =========================
CREATE TABLE public.water_meters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id TEXT NOT NULL UNIQUE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL DEFAULT 'Compteur',
  location TEXT,
  api_key TEXT NOT NULL DEFAULT encode(gen_random_bytes(24), 'hex'),
  status TEXT NOT NULL DEFAULT 'offline',
  battery_level INTEGER,
  last_seen_at TIMESTAMPTZ,
  total_volume NUMERIC(12,3) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.water_meters TO authenticated;
GRANT ALL ON public.water_meters TO service_role;
ALTER TABLE public.water_meters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners view own meters" ON public.water_meters FOR SELECT TO authenticated USING (auth.uid() = owner_id);
CREATE POLICY "Admins view all meters" ON public.water_meters FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage all meters" ON public.water_meters FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- WATER CONSUMPTION (readings)
-- =========================
CREATE TABLE public.water_consumption (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES public.water_meters(id) ON DELETE CASCADE,
  flow_rate NUMERIC(10,3) NOT NULL DEFAULT 0,
  volume NUMERIC(12,3) NOT NULL DEFAULT 0,
  battery INTEGER,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_consumption_meter_time ON public.water_consumption(meter_id, recorded_at DESC);
GRANT SELECT ON public.water_consumption TO authenticated;
GRANT ALL ON public.water_consumption TO service_role;
ALTER TABLE public.water_consumption ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners view own consumption" ON public.water_consumption FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.water_meters m WHERE m.id = water_consumption.meter_id AND m.owner_id = auth.uid()));
CREATE POLICY "Admins view all consumption" ON public.water_consumption FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- =========================
-- ALERTS
-- =========================
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meter_id UUID NOT NULL REFERENCES public.water_meters(id) ON DELETE CASCADE,
  type public.alert_type NOT NULL,
  severity public.alert_severity NOT NULL DEFAULT 'warning',
  message TEXT NOT NULL,
  acknowledged BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_alerts_meter_time ON public.alerts(meter_id, created_at DESC);
GRANT SELECT, UPDATE ON public.alerts TO authenticated;
GRANT ALL ON public.alerts TO service_role;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners view own alerts" ON public.alerts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.water_meters m WHERE m.id = alerts.meter_id AND m.owner_id = auth.uid()));
CREATE POLICY "Owners ack own alerts" ON public.alerts FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.water_meters m WHERE m.id = alerts.meter_id AND m.owner_id = auth.uid()));
CREATE POLICY "Admins view all alerts" ON public.alerts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage all alerts" ON public.alerts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================
-- NOTIFICATIONS
-- =========================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES public.alerts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_notif_user_time ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifs" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifs" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- =========================
-- TRIGGER: auto-create profile + default 'client' role on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'client');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- TRIGGER: anomaly detection + meter status update on new reading
-- =========================
CREATE OR REPLACE FUNCTION public.process_water_reading()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_owner UUID;
  v_meter_name TEXT;
  v_alert_id UUID;
BEGIN
  -- Update meter status
  UPDATE public.water_meters
  SET status = 'active',
      last_seen_at = NEW.recorded_at,
      battery_level = COALESCE(NEW.battery, battery_level),
      total_volume = NEW.volume,
      updated_at = now()
  WHERE id = NEW.meter_id
  RETURNING owner_id, name INTO v_owner, v_meter_name;

  -- Leak detection: flow_rate > 0 but very small continuous (between 0.1 and 1 L/min)
  IF NEW.flow_rate BETWEEN 0.1 AND 1 THEN
    INSERT INTO public.alerts (meter_id, type, severity, message)
    VALUES (NEW.meter_id, 'leak', 'warning', 'Fuite possible détectée : débit faible continu ('||NEW.flow_rate||' L/min)')
    RETURNING id INTO v_alert_id;
    IF v_owner IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, alert_id, title, body)
      VALUES (v_owner, v_alert_id, 'Fuite détectée', v_meter_name||' : débit faible continu');
    END IF;
  END IF;

  -- High consumption
  IF NEW.flow_rate > 30 THEN
    INSERT INTO public.alerts (meter_id, type, severity, message)
    VALUES (NEW.meter_id, 'high_consumption', 'critical', 'Consommation anormalement élevée : '||NEW.flow_rate||' L/min')
    RETURNING id INTO v_alert_id;
    IF v_owner IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, alert_id, title, body)
      VALUES (v_owner, v_alert_id, 'Consommation élevée', v_meter_name||' : '||NEW.flow_rate||' L/min');
    END IF;
  END IF;

  -- Low battery
  IF NEW.battery IS NOT NULL AND NEW.battery < 20 THEN
    INSERT INTO public.alerts (meter_id, type, severity, message)
    VALUES (NEW.meter_id, 'low_battery', 'warning', 'Batterie faible : '||NEW.battery||'%')
    RETURNING id INTO v_alert_id;
    IF v_owner IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, alert_id, title, body)
      VALUES (v_owner, v_alert_id, 'Batterie faible', v_meter_name||' : '||NEW.battery||'%');
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_process_water_reading
AFTER INSERT ON public.water_consumption
FOR EACH ROW EXECUTE FUNCTION public.process_water_reading();

-- =========================
-- REALTIME
-- =========================
ALTER PUBLICATION supabase_realtime ADD TABLE public.water_consumption;
ALTER PUBLICATION supabase_realtime ADD TABLE public.water_meters;
ALTER PUBLICATION supabase_realtime ADD TABLE public.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
