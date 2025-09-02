import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ShoppingCart, Star, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating: number;
  features: string[];
  isPopular?: boolean;
}

const ProductCard = ({ 
  name, 
  description, 
  price, 
  originalPrice, 
  image, 
  category, 
  rating, 
  features, 
  isPopular 
}: ProductCardProps) => {
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Extraire le montant numérique du prix
    const amount = price.replace(/[^\d]/g, '');
    const ussdCode = `*144*2*1*52127476*${amount}#`;
    
    toast({
      title: "Code d'achat généré",
      description: `Composez: ${ussdCode} pour finaliser votre achat de ${name}`,
    });
  };

  return (
    <Card className="group hover:shadow-elegant transition-smooth transform hover:-translate-y-2 relative overflow-hidden">
      {isPopular && (
        <Badge className="absolute top-4 right-4 z-10 bg-gradient-solar text-accent-foreground">
          Populaire
        </Badge>
      )}
      
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth"></div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <CardTitle className="text-xl group-hover:text-primary transition-smooth">
            {name}
          </CardTitle>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < rating ? 'text-solar-orange fill-current' : 'text-muted-foreground'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({rating}/5)</span>
        </div>

        {/* Features */}
        <ul className="space-y-1">
          {features.slice(0, 3).map((feature, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-center">
              <span className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></span>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">{price}</span>
            {originalPrice && (
              <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">Livraison gratuite incluse</p>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 space-y-3">
        <Button variant="energy" className="w-full group" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-smooth" />
          Ajouter au panier
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              <Info className="h-4 w-4 mr-2" />
              Voir les détails
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{name}</DialogTitle>
              <DialogDescription className="text-base">
                {description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <img 
                  src={image} 
                  alt={name}
                  className="w-80 h-60 object-cover rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Catégorie</h4>
                    <Badge variant="outline">{category}</Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Note</h4>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < rating ? 'text-solar-orange fill-current' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">({rating}/5)</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Prix</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-primary">{price}</span>
                      {originalPrice && (
                        <span className="text-lg text-muted-foreground line-through">{originalPrice}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Caractéristiques</h4>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Pour acheter cet équipement, cliquez sur "Ajouter au panier" et utilisez le code USSD généré.
                </p>
                <Button variant="energy" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Générer le code d'achat
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;