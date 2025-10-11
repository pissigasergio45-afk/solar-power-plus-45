import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }).max(100),
  phone: z.string().min(8, { message: "Numéro de téléphone invalide" }).max(20),
  email: z.string().email({ message: "Email invalide" }).max(255),
  projectType: z.string().min(1, { message: "Veuillez sélectionner un type de projet" }),
  message: z.string().min(10, { message: "Le message doit contenir au moins 10 caractères" }).max(1000),
});

type FormData = z.infer<typeof formSchema>;

const ContactSection = () => {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      projectType: "",
      message: "",
    },
  });

  const onSubmit = (data: FormData) => {
    const emailSubject = encodeURIComponent(`Demande de Devis - ${data.projectType}`);
    const emailBody = encodeURIComponent(`
Nouvelle Demande de Devis ZPEnergy

Nom: ${data.name}
Téléphone: ${data.phone}
Email: ${data.email}
Type de projet: ${data.projectType}

Message:
${data.message}

---
Envoyé depuis le site web ZPEnergy
    `);

    // Ouvrir le client email avec les informations pré-remplies
    window.location.href = `mailto:pissigasergio45@gmail.com?subject=${emailSubject}&body=${emailBody}`;
    
    toast({
      title: "Demande envoyée !",
      description: "Votre client email va s'ouvrir. Envoyez l'email pour finaliser votre demande.",
    });
    
    form.reset();
  };

  return (
    <section id="contact" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Contactez-Nous
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Prêt à passer à l'énergie solaire ? Contactez nos experts pour un devis gratuit et personnalisé.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Phone className="h-6 w-6 text-primary" />
                  <span>Téléphone</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Conseils & Services</span>
                  <span className="font-semibold">+226 07391659</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Devis Gratuit</span>
                  <span className="font-semibold">+226 74842709</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span className="font-semibold">+226 07391659</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Mail className="h-6 w-6 text-primary" />
                  <span>Email</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  <a href="mailto:pissigasergio45@gmail.com" className="hover:text-primary transition-smooth">
                    pissigasergio45@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <MapPin className="h-6 w-6 text-primary" />
                  <span>Localisation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  OUAGADOUGOU<br />
                  Burkina Faso
                </p>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm font-medium text-muted-foreground">Nos Partenaires :</p>
                  <p className="text-sm text-muted-foreground mt-1">SOBELEC • EZO-energy</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-primary" />
                  <span>Horaires</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lundi - Vendredi</span>
                  <span className="font-semibold">8h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Samedi</span>
                  <span className="font-semibold">8h - 16h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dimanche</span>
                  <span className="font-semibold">Fermé</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card id="devis-gratuit" className="border-0 bg-card/50 backdrop-blur-sm scroll-mt-20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                <span>Demande de Devis Gratuit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom complet</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+226 XX XX XX XX" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="votre@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de projet</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un type de projet" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Installation résidentielle">Installation résidentielle</SelectItem>
                            <SelectItem value="Installation commerciale">Installation commerciale</SelectItem>
                            <SelectItem value="Installation industrielle">Installation industrielle</SelectItem>
                            <SelectItem value="Maintenance et réparation">Maintenance et réparation</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Décrivez votre projet ou vos besoins en énergie solaire..."
                            rows={4}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" variant="energy" size="lg" className="w-full">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Envoyer la demande
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Nous vous répondrons sous 24h avec un devis personnalisé gratuit.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;