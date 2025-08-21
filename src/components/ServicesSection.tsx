import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Wrench, BarChart3, Phone, CheckCircle } from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Livraison Gratuite",
      description: "Livraison gratuite sur tout le territoire français pour toutes vos commandes.",
      features: [
        "Livraison sous 48-72h",
        "Emballage sécurisé",
        "Suivi en temps réel",
        "Assurance transport incluse"
      ],
      gradient: "bg-gradient-primary"
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Installation Professionnelle",
      description: "Nos techniciens certifiés installent vos panneaux solaires selon les normes les plus strictes.",
      features: [
        "Techniciens certifiés",
        "Respect des normes",
        "Garantie installation 10 ans",
        "Mise en service incluse"
      ],
      gradient: "bg-gradient-tech"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Suivi Spécialisé",
      description: "Monitoring et maintenance de votre installation par nos spécialistes en énergie solaire.",
      features: [
        "Monitoring 24/7",
        "Rapports mensuels",
        "Maintenance préventive",
        "Support technique dédié"
      ],
      gradient: "bg-gradient-solar"
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-tech bg-clip-text text-transparent">
              Nos Services
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Un accompagnement complet de l'achat à la maintenance, 
            pour vous garantir une expérience sans souci.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-smooth transform hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader className="text-center space-y-4">
                <div className={`w-16 h-16 ${service.gradient} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-bounce`}>
                  <span className="text-primary-foreground">
                    {service.icon}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-smooth">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    {service.description}
                  </CardDescription>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button variant="outline" className="w-full mt-6 group-hover:border-primary transition-smooth">
                  En savoir plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-hero rounded-3xl p-8 md:p-12 text-center text-primary-foreground">
          <div className="max-w-3xl mx-auto space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Prêt à passer à l'énergie solaire ?
            </h3>
            <p className="text-xl opacity-90">
              Obtenez un devis personnalisé et gratuit pour votre projet d'installation solaire.
              Nos experts vous accompagnent de A à Z.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                <Phone className="h-5 w-5 mr-2" />
                Devis gratuit
              </Button>
              <Button variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;