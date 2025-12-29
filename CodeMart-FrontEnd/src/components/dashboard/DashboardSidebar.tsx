import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Heart,
  ShoppingCart,
  Receipt,
  Package,
  Store,
  DollarSign,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import api, { getCurrentUser } from "@/services/api";
import { useNavigate } from "react-router-dom";

type TabId =
  | "overview"
  | "profile"
  | "wishlist"
  | "cart"
  | "transactions"
  | "bought"
  | "selling"
  | "revenue"
  | "settings";

interface DashboardSidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const menuItems: { id: TabId; label: string; icon: typeof LayoutDashboard }[] =
  [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "profile", label: "Profile", icon: User },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "cart", label: "Cart", icon: ShoppingCart },
    { id: "transactions", label: "Transactions", icon: Receipt },
    { id: "bought", label: "Purchased", icon: Package },
    { id: "selling", label: "My Products", icon: Store },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "settings", label: "Settings", icon: Settings },
  ];

export function DashboardSidebar({
  activeTab,
  onTabChange,
}: DashboardSidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    api.auth.logout();
    navigate("/signin");
  };

  const currentUser = getCurrentUser();
  return (
    <aside className="h-screen sticky top-0 rounded-2xl bg-card shadow-sm p-4 flex flex-col overflow-hidden px-5">
      {/* User Info */}
      <div className="flex items-center gap-3 p-4 mb-6 bg-secondary/50 rounded-xl">
        <Avatar className="h-10 w-10">
          <AvatarImage src={currentUser.profilePicture} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {currentUser.firstName[0]}
            {currentUser.lastName[0]}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="font-semibold text-foreground truncate">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {currentUser.email}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === item.id
                ? "bg-gradient-to-r from-[#4500A5] to-[#6A00A5] text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t border-border mt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

export type { TabId };
