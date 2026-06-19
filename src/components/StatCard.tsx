import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  hint?: string;
  accent?: "primary" | "success" | "warning" | "destructive" | "accent";
}

const accentMap = {
  primary: "from-blue-500 to-cyan-400",
  success: "from-emerald-500 to-teal-400",
  warning: "from-amber-500 to-orange-400",
  destructive: "from-rose-500 to-red-400",
  accent: "from-cyan-500 to-sky-400",
};

export const StatCard = ({ icon: Icon, label, value, unit, hint, accent = "primary" }: Props) => (
  <Card className="p-5 bg-gradient-card shadow-card hover:shadow-water transition-all duration-300 border-border/60 animate-fade-in">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="text-2xl md:text-3xl font-bold tabular-nums truncate">{value}</span>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
        {hint && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
      </div>
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white", accentMap[accent])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Card>
);
