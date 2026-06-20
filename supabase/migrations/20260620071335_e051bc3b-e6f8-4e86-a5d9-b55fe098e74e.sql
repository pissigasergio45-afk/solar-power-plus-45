DROP TRIGGER IF EXISTS trg_process_water_reading ON public.water_consumption;
CREATE TRIGGER trg_process_water_reading
AFTER INSERT ON public.water_consumption
FOR EACH ROW EXECUTE FUNCTION public.process_water_reading();