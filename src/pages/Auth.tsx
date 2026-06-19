import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { Droplets, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const emailSchema = z.string().trim().email("Email invalide").max(255);
const pwdSchema = z.string().min(6, "Au moins 6 caractères").max(72);
const nameSchema = z.string().trim().min(1, "Nom requis").max(100);

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");

  useEffect(() => { if (user) navigate("/dashboard"); }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    try {
      emailSchema.parse(email); pwdSchema.parse(password);
    } catch (err: any) { toast.error(err.errors?.[0]?.message ?? "Données invalides"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Connexion réussie"); navigate("/dashboard"); }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    const full_name = String(fd.get("full_name") || "");
    try {
      nameSchema.parse(full_name); emailSchema.parse(email); pwdSchema.parse(password);
    } catch (err: any) { toast.error(err.errors?.[0]?.message ?? "Données invalides"); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { full_name } },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Compte créé ! Vous êtes connecté."); navigate("/dashboard"); }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    try { emailSchema.parse(email); } catch (err: any) { toast.error(err.errors?.[0]?.message); return; }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` });
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Email de réinitialisation envoyé"); setMode("signin"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 text-white">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Droplets className="h-5 w-5" />
          </div>
          <span className="font-bold text-xl">Smart Water Meter</span>
        </Link>

        <Card className="p-8 shadow-elevated">
          {mode === "reset" ? (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
                <p className="text-sm text-muted-foreground mt-1">Recevez un lien par email</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required maxLength={255} />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-white">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Envoyer le lien
              </Button>
              <button type="button" onClick={() => setMode("signin")} className="text-sm text-primary hover:underline w-full text-center">
                Retour à la connexion
              </button>
            </form>
          ) : (
            <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={255} /></div>
                  <div className="space-y-2"><Label htmlFor="password">Mot de passe</Label><Input id="password" name="password" type="password" required maxLength={72} /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-white">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Se connecter
                  </Button>
                  <button type="button" onClick={() => setMode("reset")} className="text-sm text-primary hover:underline w-full text-center">
                    Mot de passe oublié ?
                  </button>
                </form>
              </TabsContent>
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2"><Label htmlFor="full_name">Nom complet</Label><Input id="full_name" name="full_name" required maxLength={100} /></div>
                  <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required maxLength={255} /></div>
                  <div className="space-y-2"><Label htmlFor="password">Mot de passe</Label><Input id="password" name="password" type="password" required minLength={6} maxLength={72} /></div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-white">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Créer mon compte
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </Card>
      </div>
    </div>
  );
}
