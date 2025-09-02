import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Home, Zap, Phone, MessageCircle, Mail } from "lucide-react";

const SolarSizingSection = () => {
  const sizingServices = [
    {
      id: 1,
      title: "Étude de Consommation",
      description: "Analyse détaillée de vos besoins énergétiques",
      icon: Zap,
      features: [
        "Audit énergétique complet",
        "Calcul de la consommation",
        "Optimisation des besoins"
      ]
    },
    {
      id: 2,
      title: "Dimensionnement Système",
      description: "Calcul précis de votre installation solaire",
      icon: Calculator,
      features: [
        "Nombre de panneaux",
        "Puissance onduleur",
        "Capacité batterie"
      ]
    },
    {
      id: 3,
      title: "Plan d'Installation",
      description: "Conception sur mesure pour votre maison",
      icon: Home,
      features: [
        "Positionnement optimal",
        "Schéma d'installation",
        "Devis détaillé"
      ]
    }
  ];

  return (
    <section id="dimensionnement" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Dimensionnement Solaire
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Besoin d'un dimensionnement solaire pour votre maison ? 
            Nos experts calculent la solution parfaite adaptée à vos besoins énergétiques.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {sizingServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="group hover:shadow-elegant transition-smooth transform hover:-translate-y-2">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-solar rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                      {service.title}
                    </CardTitle>
                    <CardDescription>
                      {service.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <div className="bg-background rounded-lg p-8 space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-3xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Contactez-nous pour votre dimensionnement
              </span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Notre équipe d'experts vous accompagne dans le dimensionnement optimal 
              de votre installation solaire. Service gratuit et sans engagement.
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center p-6 hover:shadow-elegant transition-smooth">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gradient-solar rounded-full flex items-center justify-center">
                  <Phone className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Appelez-nous</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Conseils et dimensionnement
                  </p>
                  <Button variant="energy" size="sm" asChild>
                    <a href="tel:+22607391659">+226 07 39 16 59</a>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-elegant transition-smooth">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gradient-solar rounded-full flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">WhatsApp</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Chat direct avec nos experts
                  </p>
                  <Button variant="energy" size="sm" asChild>
                    <a href="https://wa.me/22607391659">WhatsApp</a>
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="text-center p-6 hover:shadow-elegant transition-smooth">
              <div className="space-y-4">
                <div className="mx-auto w-12 h-12 bg-gradient-solar rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-accent-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Envoyez vos plans et informations
                  </p>
                  <Button variant="energy" size="sm" asChild>
                    <a href="mailto:pissigasergio45@gmail.com">Envoyer un email</a>
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Info Badge */}
          <div className="text-center">
            <Badge variant="outline" className="text-sm px-4 py-2">
              <Calculator className="h-4 w-4 mr-2" />
              Dimensionnement gratuit • Devis sous 24h • Experts certifiés
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolarSizingSection;