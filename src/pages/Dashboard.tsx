import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gauge, Droplets, Battery, Wifi, WifiOff, Bell, Download, AlertTriangle, Clock, TrendingDown, TrendingUp, Leaf, ShieldAlert, CheckCircle2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { toast } from "sonner";

type Meter = { id: string; meter_id: string; name: string; location: string | null; status: string; battery_level: number | null; last_seen_at: string | null; total_volume: number; api_key: string };
type Reading = { id: string; flow_rate: number; volume: number; battery: number | null; recorded_at: string };
type Alert = { id: string; type: string; severity: string; message: string; created_at: string; acknowledged: boolean };

export default function Dashboard() {
  const { user } = useAuth();
  const [meters, setMeters] = useState<Meter[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [readings, setReadings] = useState<Reading[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const selected = meters.find((m) => m.id === selectedId);

  // Load meters
  useEffect(() => {
    if (!user) return;
    supabase.from("water_meters").select("*").eq("owner_id", user.id).then(({ data }) => {
      const list = (data ?? []) as Meter[];
      setMeters(list);
      if (list.length && !selectedId) setSelectedId(list[0].id);
    });
  }, [user]);

  // Load readings + alerts for selected meter
  useEffect(() => {
    if (!selectedId) return;
    const since = subDays(new Date(), 30).toISOString();
    supabase.from("water_consumption").select("*").eq("meter_id", selectedId).gte("recorded_at", since).order("recorded_at", { ascending: true })
      .then(({ data }) => setReadings((data ?? []) as Reading[]));
    supabase.from("alerts").select("*").eq("meter_id", selectedId).order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setAlerts((data ?? []) as Alert[]));
  }, [selectedId]);

  // Realtime subscriptions
  useEffect(() => {
    if (!selectedId) return;
    const channel = supabase.channel(`meter-${selectedId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "water_consumption", filter: `meter_id=eq.${selectedId}` },
        (p) => setReadings((prev) => [...prev, p.new as Reading]))
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "alerts", filter: `meter_id=eq.${selectedId}` },
        (p) => { setAlerts((prev) => [p.new as Alert, ...prev]); toast.warning((p.new as Alert).message); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "water_meters", filter: `id=eq.${selectedId}` },
        (p) => setMeters((prev) => prev.map((m) => m.id === selectedId ? { ...m, ...(p.new as Meter) } : m)))
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedId]);

  // Aggregations
  const latest = readings[readings.length - 1];
  const flowRate = latest?.flow_rate ?? 0;
  const totalVolume = selected?.total_volume ?? 0;

  const today = startOfDay(new Date());
  const dailyVolume = readings.filter((r) => new Date(r.recorded_at) >= today).reduce((s, r, i, arr) => i === 0 ? 0 : s + Math.max(0, r.volume - arr[i - 1].volume), 0);

  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
  const prevMonthStart = new Date(monthStart); prevMonthStart.setMonth(prevMonthStart.getMonth() - 1);
  const sumBetween = (from: Date, to: Date) => {
    const arr = readings.filter((r) => { const t = new Date(r.recorded_at); return t >= from && t < to; });
    return arr.reduce((s, r, i) => i === 0 ? 0 : s + Math.max(0, r.volume - arr[i - 1].volume), 0);
  };
  const monthlyVolume = sumBetween(monthStart, new Date());
  const prevMonthlyVolume = sumBetween(prevMonthStart, monthStart);
  const savedVolume = Math.max(0, prevMonthlyVolume - monthlyVolume);
  const savingsPct = prevMonthlyVolume > 0 ? ((prevMonthlyVolume - monthlyVolume) / prevMonthlyVolume) * 100 : 0;
  // 1 m³ ≈ 4 € (tarif moyen estimatif) — ajustez selon votre tarif local
  const PRICE_PER_M3 = 4;
  const savedMoney = savedVolume * PRICE_PER_M3;
  const monthlyCost = monthlyVolume * PRICE_PER_M3;

  const isOnline = selected?.status === "active" && selected?.last_seen_at && (Date.now() - new Date(selected.last_seen_at).getTime() < 10 * 60 * 1000);

  // Leak detection (alerts of type 'leak')
  const leakAlerts = alerts.filter((a) => a.type === "leak");
  const activeLeaks = leakAlerts.filter((a) => !a.acknowledged);

  // Chart data
  const hourly = aggregate(readings, "hour", 24);
  const daily = aggregate(readings, "day", 14);
  const weekly = aggregate(readings, "week", 8);
  const monthly = aggregate(readings, "month", 12);

  const exportCsv = () => {
    if (!readings.length) return toast.info("Aucune donnée à exporter");
    const csv = ["timestamp,flow_rate_L_min,volume_m3,battery_pct", ...readings.map((r) => `${r.recorded_at},${r.flow_rate},${r.volume},${r.battery ?? ""}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `consommation-${selected?.meter_id}-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  if (!meters.length) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container py-20">
          <Card className="p-12 text-center max-w-xl mx-auto">
            <Droplets className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-2xl font-bold mb-2">Aucun compteur</h2>
            <p className="text-muted-foreground mb-4">Aucun compteur n'est encore associé à votre compte. Contactez votre administrateur pour en ajouter un.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <p className="text-muted-foreground">Surveillez votre consommation en temps réel</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="w-[220px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {meters.map((m) => (<SelectItem key={m.id} value={m.id}>{m.name} · {m.meter_id}</SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCsv}><Download className="h-4 w-4 mr-2" />Exporter</Button>
          </div>
        </div>

        {/* Status badge */}
        {selected && (
          <Card className="p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-card">
            <div className="flex items-center gap-3">
              <div className={`relative flex h-3 w-3 ${isOnline ? "" : "opacity-40"}`}>
                {isOnline && <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? "bg-success" : "bg-muted-foreground"}`} />
              </div>
              <div>
                <div className="font-semibold">{selected.name}</div>
                <div className="text-xs text-muted-foreground">{selected.location || selected.meter_id}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-success text-success-foreground" : ""}>
                {isOnline ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}
                {isOnline ? "Actif" : "Hors ligne"}
              </Badge>
              <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />
                {selected.last_seen_at ? format(new Date(selected.last_seen_at), "dd MMM HH:mm", { locale: fr }) : "Jamais"}
              </Badge>
            </div>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Gauge} label="Débit instantané" value={flowRate.toFixed(1)} unit="L/min" accent="primary" />
          <StatCard icon={Droplets} label="Volume total" value={totalVolume.toFixed(2)} unit="m³" accent="accent" />
          <StatCard icon={Droplets} label="Aujourd'hui" value={dailyVolume.toFixed(2)} unit="m³" accent="success" />
          <StatCard icon={Battery} label="Batterie" value={selected?.battery_level ?? "—"} unit="%" accent={(selected?.battery_level ?? 100) < 20 ? "destructive" : "success"} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard icon={Droplets} label="Ce mois" value={monthlyVolume.toFixed(2)} unit="m³" accent="primary" hint="Cumul mensuel calculé sur les lectures reçues" />
          <StatCard icon={Bell} label="Alertes non lues" value={alerts.filter((a) => !a.acknowledged).length} accent="warning" hint="Cliquez sur une alerte pour l'acquitter" />
        </div>

        {/* Charts */}
        <Card className="p-6">
          <Tabs defaultValue="hour">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Historique de consommation</h2>
              <TabsList>
                <TabsTrigger value="hour">Heure</TabsTrigger>
                <TabsTrigger value="day">Jour</TabsTrigger>
                <TabsTrigger value="week">Semaine</TabsTrigger>
                <TabsTrigger value="month">Mois</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="hour"><Chart data={hourly} type="line" /></TabsContent>
            <TabsContent value="day"><Chart data={daily} type="bar" /></TabsContent>
            <TabsContent value="week"><Chart data={weekly} type="bar" /></TabsContent>
            <TabsContent value="month"><Chart data={monthly} type="bar" /></TabsContent>
          </Tabs>
        </Card>

        {/* Alerts */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" />Centre de notifications</h2>
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Aucune alerte. Tout va bien ! 💧</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border ${a.acknowledged ? "opacity-60" : ""} ${
                  a.severity === "critical" ? "bg-destructive/5 border-destructive/30" :
                  a.severity === "warning" ? "bg-warning/5 border-warning/30" : "bg-muted/30 border-border"
                }`}>
                  <Badge variant={a.severity === "critical" ? "destructive" : "secondary"} className="mt-0.5">{a.type}</Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{format(new Date(a.created_at), "dd MMM yyyy · HH:mm", { locale: fr })}</p>
                  </div>
                  {!a.acknowledged && (
                    <Button size="sm" variant="ghost" onClick={async () => {
                      await supabase.from("alerts").update({ acknowledged: true }).eq("id", a.id);
                      setAlerts((prev) => prev.map((x) => x.id === a.id ? { ...x, acknowledged: true } : x));
                    }}>Acquitter</Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* ESP32 info */}
        {selected && (
          <Card className="p-6 bg-muted/30">
            <h3 className="font-semibold mb-2">🔌 Connexion ESP32</h3>
            <p className="text-sm text-muted-foreground mb-3">Envoyez vos données via POST à l'endpoint suivant :</p>
            <code className="block p-3 rounded bg-background border text-xs break-all">
              POST {import.meta.env.VITE_SUPABASE_URL}/functions/v1/ingest-meter-data<br/>
              Header: x-meter-key: {selected.api_key}<br/>
              Body: {`{ "meter_id": "${selected.meter_id}", "flow_rate": 12.5, "volume": 153.4, "battery": 95 }`}
            </code>
          </Card>
        )}
      </div>
    </div>
  );
}

function Chart({ data, type }: { data: { label: string; value: number }[]; type: "line" | "bar" }) {
  if (!data.length) return <p className="text-center text-muted-foreground py-12">Aucune donnée disponible</p>;
  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === "line" ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 3 }} />
        </LineChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      )}
    </ResponsiveContainer>
  );
}

function aggregate(readings: Reading[], bucket: "hour" | "day" | "week" | "month", count: number) {
  if (!readings.length) return [];
  const now = new Date();
  const buckets: { key: string; label: string; start: Date; end: Date }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    if (bucket === "hour") { d.setMinutes(0, 0, 0); d.setHours(d.getHours() - i); buckets.push({ key: d.toISOString(), label: format(d, "HH'h'"), start: d, end: new Date(d.getTime() + 3600e3) }); }
    else if (bucket === "day") { d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i); buckets.push({ key: d.toISOString(), label: format(d, "dd/MM"), start: d, end: new Date(d.getTime() + 86400e3) }); }
    else if (bucket === "week") { d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - i * 7); buckets.push({ key: d.toISOString(), label: format(d, "dd/MM"), start: d, end: new Date(d.getTime() + 7 * 86400e3) }); }
    else { d.setDate(1); d.setHours(0, 0, 0, 0); d.setMonth(d.getMonth() - i); const end = new Date(d); end.setMonth(end.getMonth() + 1); buckets.push({ key: d.toISOString(), label: format(d, "MMM", { locale: fr }), start: d, end }); }
  }
  return buckets.map((b) => {
    const inBucket = readings.filter((r) => { const t = new Date(r.recorded_at); return t >= b.start && t < b.end; });
    let value = 0;
    if (inBucket.length >= 2) value = Math.max(0, inBucket[inBucket.length - 1].volume - inBucket[0].volume);
    else if (inBucket.length === 1) value = inBucket[0].flow_rate / 60; // rough fallback
    return { label: b.label, value: +value.toFixed(3) };
  });
}
