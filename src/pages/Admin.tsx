import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Wifi, WifiOff, Copy, Users, AlertTriangle, Gauge } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Meter = { id: string; meter_id: string; name: string; location: string | null; status: string; owner_id: string | null; api_key: string; last_seen_at: string | null; total_volume: number; battery_level: number | null };
type Profile = { id: string; email: string | null; full_name: string | null };
type Alert = { id: string; meter_id: string; type: string; severity: string; message: string; created_at: string };

export default function Admin() {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ meter_id: "", name: "", location: "", owner_id: "" });

  const load = async () => {
    const [m, p, a] = await Promise.all([
      supabase.from("water_meters").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("id, email, full_name"),
      supabase.from("alerts").select("*").order("created_at", { ascending: false }).limit(50),
    ]);
    setMeters((m.data ?? []) as Meter[]);
    setProfiles((p.data ?? []) as Profile[]);
    setAlerts((a.data ?? []) as Alert[]);
  };

  useEffect(() => { load(); }, []);

  const createMeter = async () => {
    if (!form.meter_id || !form.name) return toast.error("ID et nom requis");
    const { error } = await supabase.from("water_meters").insert({
      meter_id: form.meter_id.trim(),
      name: form.name.trim(),
      location: form.location.trim() || null,
      owner_id: form.owner_id || null,
    });
    if (error) toast.error(error.message);
    else { toast.success("Compteur créé"); setOpen(false); setForm({ meter_id: "", name: "", location: "", owner_id: "" }); load(); }
  };

  const deleteMeter = async (id: string) => {
    if (!confirm("Supprimer ce compteur et toutes ses données ?")) return;
    const { error } = await supabase.from("water_meters").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Compteur supprimé"); load(); }
  };

  const activeCount = meters.filter((m) => m.status === "active" && m.last_seen_at && Date.now() - new Date(m.last_seen_at).getTime() < 10 * 60 * 1000).length;
  const totalVol = meters.reduce((s, m) => s + Number(m.total_volume), 0);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Administration</h1>
            <p className="text-muted-foreground">Gérez les compteurs et surveillez l'ensemble du parc</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white"><Plus className="h-4 w-4 mr-2" />Nouveau compteur</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Ajouter un compteur</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2"><Label>Identifiant (ex: WM001)</Label><Input value={form.meter_id} onChange={(e) => setForm({ ...form, meter_id: e.target.value })} /></div>
                <div className="space-y-2"><Label>Nom</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Emplacement</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
                <div className="space-y-2">
                  <Label>Propriétaire</Label>
                  <Select value={form.owner_id} onValueChange={(v) => setForm({ ...form, owner_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>{profiles.map((p) => (<SelectItem key={p.id} value={p.id}>{p.full_name || p.email}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter><Button onClick={createMeter} className="bg-gradient-primary text-white">Créer</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-5"><div className="text-xs text-muted-foreground uppercase tracking-wider">Compteurs</div><div className="text-3xl font-bold mt-1">{meters.length}</div></Card>
          <Card className="p-5"><div className="text-xs text-muted-foreground uppercase tracking-wider">Actifs</div><div className="text-3xl font-bold mt-1 text-success">{activeCount}</div></Card>
          <Card className="p-5"><div className="text-xs text-muted-foreground uppercase tracking-wider">Utilisateurs</div><div className="text-3xl font-bold mt-1">{profiles.length}</div></Card>
          <Card className="p-5"><div className="text-xs text-muted-foreground uppercase tracking-wider">Volume total</div><div className="text-3xl font-bold mt-1">{totalVol.toFixed(1)} m³</div></Card>
        </div>

        {/* Meters table */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Gauge className="h-5 w-5" />Compteurs</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>ID</TableHead><TableHead>Nom</TableHead><TableHead>Propriétaire</TableHead><TableHead>Statut</TableHead>
                <TableHead>Dernière sync</TableHead><TableHead>Volume</TableHead><TableHead>Clé API</TableHead><TableHead></TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {meters.map((m) => {
                  const owner = profiles.find((p) => p.id === m.owner_id);
                  const online = m.status === "active" && m.last_seen_at && Date.now() - new Date(m.last_seen_at).getTime() < 10 * 60 * 1000;
                  return (
                    <TableRow key={m.id}>
                      <TableCell className="font-mono text-xs">{m.meter_id}</TableCell>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell className="text-sm">{owner?.full_name || owner?.email || "—"}</TableCell>
                      <TableCell><Badge variant={online ? "default" : "secondary"} className={online ? "bg-success text-success-foreground" : ""}>
                        {online ? <Wifi className="h-3 w-3 mr-1" /> : <WifiOff className="h-3 w-3 mr-1" />}{online ? "Actif" : "Hors ligne"}
                      </Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.last_seen_at ? format(new Date(m.last_seen_at), "dd/MM HH:mm", { locale: fr }) : "—"}</TableCell>
                      <TableCell className="tabular-nums">{Number(m.total_volume).toFixed(2)} m³</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(m.api_key); toast.success("Clé copiée"); }}>
                          <Copy className="h-3 w-3 mr-1" />Copier
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => deleteMeter(m.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!meters.length && <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">Aucun compteur</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Alerts */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" />Alertes récentes (tous compteurs)</h2>
          {!alerts.length ? <p className="text-muted-foreground text-center py-8">Aucune alerte</p> : (
            <div className="space-y-2">
              {alerts.map((a) => {
                const meter = meters.find((m) => m.id === a.meter_id);
                return (
                  <div key={a.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                    a.severity === "critical" ? "bg-destructive/5 border-destructive/30" :
                    a.severity === "warning" ? "bg-warning/5 border-warning/30" : "bg-muted/30 border-border"
                  }`}>
                    <Badge variant={a.severity === "critical" ? "destructive" : "secondary"}>{a.type}</Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.message}</p>
                      <p className="text-xs text-muted-foreground">{meter?.meter_id} · {format(new Date(a.created_at), "dd MMM HH:mm", { locale: fr })}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Users */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-5 w-5" />Utilisateurs</h2>
          <Table>
            <TableHeader><TableRow><TableHead>Nom</TableHead><TableHead>Email</TableHead><TableHead>Compteurs</TableHead></TableRow></TableHeader>
            <TableBody>
              {profiles.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{p.email}</TableCell>
                  <TableCell>{meters.filter((m) => m.owner_id === p.id).length}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
