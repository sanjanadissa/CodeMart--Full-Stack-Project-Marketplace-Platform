import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number | string;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'success';
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  variant = 'default' 
}: StatsCardProps) {
  return (
    <div className={cn(
      "rounded-xl p-6 shadow-xl transition-all duration-200 hover:shadow-2xl animate-fade-in",
      variant === 'default' && "bg-card",
      variant === 'primary' && "bg-gradient-to-r from-[#4500A5] to-[#5800A5] text-primary-foreground",
      variant === 'success' && "gradient-success text-success-foreground"
    )}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            "text-sm font-medium",
            variant === 'default' ? "text-muted-foreground" : "opacity-90"
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn(
              "text-sm",
              variant === 'default' ? "text-muted-foreground" : "opacity-80"
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <p className={cn(
              "text-sm font-medium flex items-center gap-1",
              trend.isPositive ? "text-success" : "text-destructive"
            )}>
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              <span className={`font-normal ${variant === 'primary' ? "text-white" : "text-black"}`}>vs last month</span>
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-lg",
          variant === 'default' && "bg-primary/10",
          variant !== 'default' && "bg-background/20"
        )}>
          <Icon className={cn(
            "h-6 w-6",
            variant === 'default' ? "text-primary" : "text-current"
          )} />
        </div>
      </div>
    </div>
  );
}
