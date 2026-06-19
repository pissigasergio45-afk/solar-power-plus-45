import { Link, useNavigate, useLocation } from "react-router-dom";
import { Droplets, Moon, Sun, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

export const Navbar = () => {
  const { theme, toggle } = useTheme();
  const { user, role, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-water">
            <Droplets className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-base">Smart Water</span>
            <span className="text-[10px] text-muted-foreground tracking-widest">METER · IoT</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <>
              <Button variant={pathname === "/dashboard" ? "secondary" : "ghost"} size="sm" onClick={() => navigate("/dashboard")}>
                <LayoutDashboard className="h-4 w-4 mr-2" />Tableau de bord
              </Button>
              {role === "admin" && (
                <Button variant={pathname === "/admin" ? "secondary" : "ghost"} size="sm" onClick={() => navigate("/admin")}>
                  <Shield className="h-4 w-4 mr-2" />Admin
                </Button>
              )}
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Basculer le thème">
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {user ? (
            <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4 mr-2" />Déconnexion
            </Button>
          ) : (
            <Button size="sm" onClick={() => navigate("/auth")} className="bg-gradient-primary text-white shadow-water">
              Connexion
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
