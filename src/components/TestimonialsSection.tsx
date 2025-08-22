import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Mamadou Traoré",
      role: "Propriétaire à Ouagadougou",
      content: "Excellent service de ZPEnergy ! Installation rapide et professionnelle. Nos factures d'électricité ont diminué de 80%. Je recommande vivement !",
      rating: 5,
      avatar: "MT"
    },
    {
      id: 2,
      name: "Fatou Sawadogo",
      role: "Entreprise à Bobo-Dioulasso",
      content: "Partenariat avec SOBELEC et EZO-energy très rassurant. Équipe compétente, suivi excellent. Notre entreprise économise beaucoup grâce au solaire.",
      rating: 5,
      avatar: "FS"
    },
    {
      id: 3,
      name: "Ibrahim Ouédraogo",
      role: "Villa familiale à Koudougou",
      content: "Installation de panneaux solaires parfaite. Service client réactif, livraison gratuite respectée. Très content de notre autonomie énergétique.",
      rating: 5,
      avatar: "IO"
    }
  ];

  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-solar bg-clip-text text-transparent">
              Témoignages Clients
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de nos solutions solaires au Burkina Faso
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-elegant transition-smooth transform hover:-translate-y-1 border-0 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-4">
                {/* Quote Icon */}
                <div className="flex justify-between items-start">
                  <Quote className="h-8 w-8 text-primary/20" />
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current text-yellow-500" />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Author */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;