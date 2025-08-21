import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-solar rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-xl">E</span>
              </div>
            <div>
              <h3 className="text-2xl font-bold">ZPEnergy</h3>
              <p className="text-sm opacity-80">Solutions Solaires</p>
            </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Spécialiste en solutions d'énergie solaire au Burkina Faso. 
              Partenaire SOBELEC pour vous accompagner vers l'autonomie énergétique avec des produits de qualité et un service premium.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                <Instagram className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Produits</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Panneaux Solaires</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Batteries</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Onduleurs</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Câbles & Accessoires</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Kits Complets</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Installation</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Maintenance</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Monitoring</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Garanties</a></li>
              <li><a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">Support Technique</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 opacity-80" />
                <span className="text-sm">+226 07391659 (Conseils)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 opacity-80" />
                <span className="text-sm">+226 74842709 (WhatsApp)</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 opacity-80" />
                <span className="text-sm">pissigasergio45@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 opacity-80 mt-0.5" />
                <span className="text-sm">
                  Partenaire SOBELEC<br />
                  Burkina Faso
                </span>
              </div>
            </div>
            <Button variant="solar" size="sm" className="w-full">
              Devis gratuit
            </Button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-80">
              © 2024 ZPEnergy. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">
                Mentions légales
              </a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">
                Confidentialité
              </a>
              <a href="#" className="text-sm opacity-80 hover:opacity-100 transition-smooth">
                CGV
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;