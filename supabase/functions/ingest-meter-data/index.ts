// ESP32 ingestion endpoint — public, secured per-meter via x-meter-key header
import { createClient } from "npm:@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-meter-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  try {
    const apiKey = req.headers.get("x-meter-key");
    if (!apiKey) return json({ error: "Missing x-meter-key header" }, 401);

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json({ error: "Invalid JSON body" }, 400);

    const { meter_id, flow_rate, volume, battery, timestamp } = body as Record<string, unknown>;
    if (typeof meter_id !== "string" || !meter_id) return json({ error: "meter_id required" }, 400);
    if (typeof flow_rate !== "number" || !isFinite(flow_rate) || flow_rate < 0 || flow_rate > 10000) return json({ error: "flow_rate invalid (0-10000)" }, 400);
    if (typeof volume !== "number" || !isFinite(volume) || volume < 0) return json({ error: "volume invalid" }, 400);
    if (battery !== undefined && battery !== null && (typeof battery !== "number" || battery < 0 || battery > 100)) return json({ error: "battery invalid (0-100)" }, 400);

    // Lookup meter + verify key
    const { data: meter, error: mErr } = await supabase
      .from("water_meters")
      .select("id, api_key")
      .eq("meter_id", meter_id)
      .maybeSingle();
    if (mErr) return json({ error: mErr.message }, 500);
    if (!meter) return json({ error: "Meter not found" }, 404);
    if (meter.api_key !== apiKey) return json({ error: "Invalid api key" }, 403);

    const recorded_at = typeof timestamp === "string" ? new Date(timestamp).toISOString() : new Date().toISOString();

    const { error: iErr } = await supabase.from("water_consumption").insert({
      meter_id: meter.id,
      flow_rate,
      volume,
      battery: battery ?? null,
      recorded_at,
    });
    if (iErr) return json({ error: iErr.message }, 500);

    return json({ ok: true, recorded_at }, 200);
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});

function json(payload: unknown, status: number) {
  return new Response(JSON.stringify(payload), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}
