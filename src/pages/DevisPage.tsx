import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const DevisPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    projectType: "",
    location: "",
    budget: "",
    powerNeeds: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation basique
    if (!formData.name || !formData.phone || !formData.email || !formData.projectType) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    // Créer le contenu de l'email
    const emailContent = `
Nouvelle demande de devis de ${formData.name}

Informations du client:
- Nom: ${formData.name}
- Téléphone: ${formData.phone}
- Email: ${formData.email}
- Type de projet: ${formData.projectType}
- Localisation: ${formData.location}
- Budget estimé: ${formData.budget}
- Besoins en puissance: ${formData.powerNeeds}
- Message: ${formData.message}

Date de la demande: ${new Date().toLocaleDateString('fr-FR')}
    `;

    // Créer un lien mailto
    const mailtoLink = `mailto:pissigasergio45@gmail.com?subject=Demande de Devis - ${formData.name}&body=${encodeURIComponent(emailContent)}`;
    
    // Ouvrir le client email
    window.location.href = mailtoLink;

    toast({
      title: "Demande envoyée !",
      description: "Votre client email s'est ouvert. Envoyez l'email pour finaliser votre demande.",
    });

    // Réinitialiser le formulaire
    setFormData({
      name: "",
      phone: "",
      email: "",
      projectType: "",
      location: "",
      budget: "",
      powerNeeds: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Demande de Devis Gratuit
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Obtenez votre devis personnalisé en quelques minutes. Nos experts vous répondront sous 24h avec une proposition adaptée à vos besoins.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <MessageSquare className="h-8 w-8 text-primary" />
                  <span>Formulaire de Demande</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Informations personnelles */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary">Informations personnelles</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Nom complet *</label>
                        <Input 
                          placeholder="Votre nom complet"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Téléphone *</label>
                        <Input 
                          placeholder="+226 XX XX XX XX"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Email *</label>
                        <Input 
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Localisation</label>
                        <Input 
                          placeholder="Ville, Quartier"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Détails du projet */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-primary">Détails du projet</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Type de projet *</label>
                        <Select value={formData.projectType} onValueChange={(value) => handleInputChange("projectType", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez le type de projet" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Installation résidentielle</SelectItem>
                            <SelectItem value="commercial">Installation commerciale</SelectItem>
                            <SelectItem value="industrial">Installation industrielle</SelectItem>
                            <SelectItem value="maintenance">Maintenance et réparation</SelectItem>
                            <SelectItem value="extension">Extension d'installation existante</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Budget estimé (FCFA)</label>
                        <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez votre budget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="500k-1m">500 000 - 1 000 000 FCFA</SelectItem>
                            <SelectItem value="1m-2m">1 000 000 - 2 000 000 FCFA</SelectItem>
                            <SelectItem value="2m-5m">2 000 000 - 5 000 000 FCFA</SelectItem>
                            <SelectItem value="5m-10m">5 000 000 - 10 000 000 FCFA</SelectItem>
                            <SelectItem value="10m+">Plus de 10 000 000 FCFA</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Besoins en puissance</label>
                      <Input 
                        placeholder="Ex: 3kW, 5kW, 10kW ou décrivez vos appareils"
                        value={formData.powerNeeds}
                        onChange={(e) => handleInputChange("powerNeeds", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description détaillée du projet</label>
                      <Textarea 
                        placeholder="Décrivez votre projet, vos besoins spécifiques, les équipements souhaités, etc."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Avantages */}
                  <div className="bg-primary/5 rounded-lg p-6 space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Pourquoi nous choisir ?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Devis gratuit sous 24h</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Partenaire Alibaba</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-sm">Garantie qualité</span>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="energy" size="lg" className="w-full">
                    <Send className="h-5 w-5 mr-2" />
                    Envoyer ma demande de devis
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Champs obligatoires. Vos données sont protégées et ne seront utilisées que pour traiter votre demande.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DevisPage;