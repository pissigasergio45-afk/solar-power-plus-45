import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Grid, Filter } from "lucide-react";
import solarPanel from "@/assets/solar-panel.jpg";
import solarBattery from "@/assets/solar-battery.jpg";
import solarInverter from "@/assets/solar-inverter.jpg";
import solarCables from "@/assets/solar-cables.jpg";

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: "Panneau Solaire 400W",
      description: "Panneau photovoltaïque haute performance avec technologie monocristalline",
      price: "299€",
      originalPrice: "349€",
      image: solarPanel,
      category: "Panneaux Solaires",
      rating: 5,
      features: [
        "Puissance 400W",
        "Garantie 25 ans",
        "Résistant aux intempéries"
      ],
      isPopular: true
    },
    {
      id: 2,
      name: "Batterie Lithium 10kWh",
      description: "Système de stockage d'énergie haute capacité pour autonomie maximale",
      price: "4,999€",
      originalPrice: "5,499€",
      image: solarBattery,
      category: "Batteries",
      rating: 5,
      features: [
        "Capacité 10kWh",
        "Cycle de vie 6000+",
        "Surveillance intelligente"
      ]
    },
    {
      id: 3,
      name: "Onduleur 5kW",
      description: "Onduleur string haute efficacité avec monitoring intégré",
      price: "899€",
      image: solarInverter,
      category: "Onduleurs",
      rating: 4,
      features: [
        "Puissance 5kW",
        "Rendement 97.5%",
        "Monitoring WiFi"
      ]
    },
    {
      id: 4,
      name: "Câbles DC/AC Kit",
      description: "Kit complet de câblage pour installation solaire professionnelle",
      price: "199€",
      image: solarCables,
      category: "Câbles",
      rating: 4,
      features: [
        "Câbles certifiés",
        "Protection UV",
        "Kit complet"
      ]
    }
  ];

  const categories = ["Tous", "Panneaux Solaires", "Batteries", "Onduleurs", "Câbles"];

  return (
    <section id="produits" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Nos Produits
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez notre gamme complète de produits solaires de haute qualité, 
            sélectionnés pour leur performance et leur durabilité.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Tous" ? "energy" : "outline"}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
            <Button variant="outline" size="sm">
              <Grid className="h-4 w-4 mr-2" />
              Vue
            </Button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center">
          <Button variant="outline" size="lg">
            Voir plus de produits
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;