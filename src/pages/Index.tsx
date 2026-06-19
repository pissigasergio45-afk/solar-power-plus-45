import { Link } from "react-router-dom";
import { Droplets, Activity, Bell, ShieldAlert, TrendingDown, Wifi, ArrowRight, Gauge, Smartphone, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

const features = [
  { icon: Activity, title: "Temps réel", desc: "Visualisez votre débit instantané et votre consommation en direct depuis votre ESP32." },
  { icon: ShieldAlert, title: "Détection de fuites", desc: "Alertes automatiques en cas de fuite ou de débit anormal continu." },
  { icon: TrendingDown, title: "Économies d'eau", desc: "Identifiez les surconsommations et réduisez votre facture jusqu'à 30%." },
  { icon: Bell, title: "Notifications", desc: "Soyez averti immédiatement : fuite, batterie faible, perte de signal." },
  { icon: BarChart3, title: "Historiques détaillés", desc: "Graphiques horaires, journaliers, hebdomadaires et mensuels." },
  { icon: Smartphone, title: "Multi-supports", desc: "Interface responsive optimisée pour ordinateur et smartphone." },
];

const Index = () => (
  <div className="min-h-screen">
    <Navbar />

    {/* Hero */}
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0%, transparent 40%), radial-gradient(circle at 80% 70%, white 0%, transparent 40%)" }} />
      <div className="container relative py-24 md:py-32">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm mb-6">
            <Wifi className="h-3.5 w-3.5" /> IoT · ESP32 · Temps réel
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Suivi intelligent<br />de la consommation d'eau
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Surveillez votre compteur, détectez les fuites et économisez l'eau grâce à notre plateforme IoT connectée à votre ESP32.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-white text-water-deep hover:bg-white/90 shadow-elevated">
                Accéder au tableau de bord <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm">
                Découvrir les fonctionnalités
              </Button>
            </a>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1 left-0 right-0 h-16" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--background)))" }} />
    </section>

    {/* Stats showcase */}
    <section className="container -mt-12 relative z-10">
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: Gauge, label: "Débit instantané", value: "12.5 L/min", color: "from-blue-500 to-cyan-400" },
          { icon: Droplets, label: "Volume total", value: "153.4 m³", color: "from-cyan-500 to-blue-400" },
          { icon: Activity, label: "Compteurs actifs", value: "24/7", color: "from-sky-500 to-blue-500" },
        ].map((s, i) => (
          <Card key={i} className="p-6 bg-gradient-card shadow-card border-border/60">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white mb-4`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="text-3xl font-bold mt-1">{s.value}</div>
          </Card>
        ))}
      </div>
    </section>

    {/* Features */}
    <section id="features" className="container py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Une plateforme complète pour votre eau</h2>
        <p className="text-muted-foreground text-lg">Tout ce qu'il vous faut pour comprendre, surveiller et optimiser votre consommation.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Card key={i} className="p-6 hover:shadow-water transition-all duration-300 hover:-translate-y-1 border-border/60">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
              <f.icon className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="container pb-24">
      <Card className="p-10 md:p-14 bg-gradient-primary text-white text-center shadow-elevated border-0">
        <Droplets className="h-12 w-12 mx-auto mb-4 animate-wave" />
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à reprendre le contrôle de votre eau ?</h2>
        <p className="text-white/90 mb-8 max-w-xl mx-auto">Créez votre compte et connectez votre premier compteur ESP32 en quelques minutes.</p>
        <Link to="/auth">
          <Button size="lg" className="bg-white text-water-deep hover:bg-white/90">
            Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </Card>
    </section>

    <footer className="border-t border-border/60 py-8">
      <div className="container text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Smart Water Meter · Plateforme IoT de surveillance intelligente
      </div>
    </footer>
  </div>
);

export default Index;
