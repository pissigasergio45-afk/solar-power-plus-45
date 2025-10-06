import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Fan, Flame, Snowflake, Home } from "lucide-react";

const EquipmentQuoteSection = () => {
  const equipments = [
    {
      id: 1,
      name: "Ventilateur",
      icon: Fan,
      description: "Ventilateurs électriques haute performance",
      category: "Ventilation",
      features: ["Consommation optimisée", "Silencieux", "Différentes tailles"]
    },
    {
      id: 2,
      name: "Four Électrique",
      icon: Flame,
      description: "Fours électriques professionnels et domestiques",
      category: "Cuisson",
      features: ["Économe en énergie", "Température précise", "Design moderne"]
    },
    {
      id: 3,
      name: "Climatiseur",
      icon: Snowflake,
      description: "Systèmes de climatisation efficaces",
      category: "Climatisation",
      features: ["Inverter", "Eco-friendly", "Installation comprise"]
    },
    {
      id: 4,
      name: "Réfrigérateur",
      icon: Home,
      description: "Réfrigérateurs et congélateurs",
      category: "Électroménager",
      features: ["Classe A+++", "Grande capacité", "Garantie étendue"]
    }
  ];

  return (
    <section id="devis-equipements" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Devis Équipements Électriques
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Obtenez un devis personnalisé pour vos équipements électriques. 
            Nos partenaires sur Alibaba vous garantissent des prix compétitifs et une qualité optimale.
          </p>
        </div>

        {/* Equipment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {equipments.map((equipment) => {
            const IconComponent = equipment.icon;
            return (
              <Card key={equipment.id} className="group hover:shadow-elegant transition-smooth transform hover:-translate-y-2">
                <CardHeader className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-solar rounded-full flex items-center justify-center">
                    <IconComponent className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {equipment.category}
                    </Badge>
                    <CardTitle className="text-xl group-hover:text-primary transition-smooth">
                      {equipment.name}
                    </CardTitle>
                    <CardDescription>
                      {equipment.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <ul className="space-y-2">
                    {equipment.features.map((feature, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-center">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <Button variant="energy" className="w-full" asChild>
                    <a href="#devis-gratuit">
                      <Calculator className="h-4 w-4 mr-2" />
                      Demander un devis
                    </a>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-secondary/30 rounded-lg p-8 text-center space-y-6">
          <h3 className="text-2xl font-bold">Pourquoi choisir nos équipements ?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Alibaba Partenaire</h4>
              <p className="text-sm text-muted-foreground">
                Accès direct aux meilleurs fournisseurs mondiaux
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Prix Compétitifs</h4>
              <p className="text-sm text-muted-foreground">
                Négociation directe pour les meilleurs tarifs
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-primary">Qualité Garantie</h4>
              <p className="text-sm text-muted-foreground">
                Équipements certifiés et garantie incluse
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg font-medium">
              Appelez le <span className="text-primary font-bold">+226 74 84 27 09</span> pour votre devis personnalisé
            </p>
            <Button variant="outline" size="lg" asChild>
              <a href="#devis-gratuit">
                Obtenir mon devis maintenant
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquipmentQuoteSection;