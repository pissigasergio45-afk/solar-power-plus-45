import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";

import { useState } from "react";
import solarPanel from "@/assets/solar-panel.jpg";
import solarBattery from "@/assets/solar-battery.jpg";
import solarInverter from "@/assets/solar-inverter.jpg";
import solarCables from "@/assets/solar-cables.jpg";

const ProductsSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const products = [
    {
      id: 1,
      name: "Panneau Solaire 400W",
      description: "Panneau photovoltaïque haute performance avec technologie monocristalline",
      price: "$499 (299 500 FCFA)",
      originalPrice: "$582 (349 200 FCFA)",
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
      price: "$8,332 (4 999 200 FCFA)",
      originalPrice: "$9,165 (5 499 000 FCFA)",
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
      price: "$1,498 (899 000 FCFA)",
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
      price: "$332 (199 200 FCFA)",
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
  
  const filteredProducts = selectedCategory === "Tous" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === selectedCategory ? "energy" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
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