import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  DashboardSidebar,
  TabId,
} from "@/components/dashboard/DashboardSidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ProjectCard } from "@/components/dashboard/ProjectCard";
import { TransactionRow } from "@/components/dashboard/TransactionRow";
import { ProfileSection } from "@/components/dashboard/ProfileSection";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Heart,
  ShoppingCart,
  TrendingUp,
  Plus,
  Bell,
  Mail,
  Shield,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import {
  currentUser,
  sellingProjects,
  cartItems,
  transactions,
  dashboardStats,
  Project,
} from "@/data/dummyData";
import api, { getCurrentUser } from "@/services/api";
import Cart from "./Cart";
import { Link, useNavigate } from "react-router-dom";

export default function Dashboard() {
  // const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [wishlistProjects, setWishlistProjects] = useState<any[]>([]);
  const [boughtProjects, setBoughtProjects] = useState<any[]>([]);
  const [ordersforUser, setOrdersforUser] = useState<any[]>([]);
  const [sellingProjects, setSellingProjects] = useState<any[]>([]);
  const [addedToWishList, setAddedtoWishList] = useState(false);
  const [userRevenue, setUserRevenue] = useState('');
  const [userSales, setUserSales] = useState<any[]>([]);
  const [bestProject, setBestProject] = useState<any>();
  const [bestProjectrevenue, setBestProjectrevenue] = useState('');
  const [userRevenueLastMonth, setUserRevenueLastMonth] = useState('');
  const [userSalesLastMonth, setUserSalesLastMonth] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
const location = useLocation();
  // const [activeTab, setActiveTab] = useState<"overview" | "purchased" | "other">("overview");
  const navigate = useNavigate();
  const initialTab =
  location.hash === "#purchased" ? "bought" : "overview";

const [activeTab, setActiveTab] = useState<"overview" | "bought" | "wishlist" | "cart" | "transactions" | "selling" | "revenue" | "settings">(initialTab);

  const handleRemoveFromCart = (projectId: Project) => {
    toast.success("Removed from cart");
  };

  const handleAddToCart = (project: number) => {
    return <ProfileSection user={user} />;
  };

  const handleEditProject = (projectId: number) => {
    navigate(`/project/${projectId}/edit`);
  };

  const handleDeleteProject = (projectId: number) => {
    setProjectToDelete(projectId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    
    try {
      await api.projects.delete(projectToDelete);
      toast.success("Project deleted successfully");
      const sellingProjects = await api.users.getSelling(user.id);
      setSellingProjects(sellingProjects);
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      toast.error("Failed to delete project");
      console.log(error);
      setDeleteDialogOpen(false);
    }
  };

  const user = getCurrentUser();
  const userId = user.id;
  const currentMonth = new Date().getMonth() + 1;

  const handleRemoveFromWishlist = async (id: string | number) => {
    try {
      if (!id) {
        toast.error("Project ID is missing");
        return;
      }
      if (!userId) {
        toast.error("Please log in to manage your wishlist");
        return;
      }

      if (addedToWishList) {
        await api.users.removeFromWishList(userId, id);
        setAddedtoWishList(false);
        toast.success("Removed from wishlist!");
      } else {
        await api.users.addtoWishList(userId, id);
        setAddedtoWishList(true);
        toast.success("Added to wishlist!");
      }
    } catch (err: any) {
      console.error("Wishlist operation failed:", err);

      let errorMessage = addedToWishList
        ? "Failed to remove from wishlist. Please try again."
        : "Failed to add to wishlist. Please try again.";
      try {
        if (err instanceof Error) {
          const errorData = JSON.parse(err.message);
          errorMessage = errorData.message || errorData.title || errorMessage;
        }
      } catch (parseError) {
        if (err instanceof Error) {
          errorMessage = err.message;
        }
      }

      toast.error(errorMessage);
    }
  };

  const handleRevenueTrend = (revenue: string, revenueLastMonth: string) => {
    const revenueNumber = parseFloat(revenue);
    const revenueLastMonthNumber = parseFloat(revenueLastMonth);

    if (revenueLastMonthNumber === 0) {
      return 100;
    }
    const difference = revenueNumber - revenueLastMonthNumber;
    const percentage = (difference / revenueLastMonthNumber) * 100;
    return percentage;
  }

  const handleSalesTrend = (sales: any[], salesLastMonth: any[]) => {
    if (salesLastMonth.length === 0) {
      return 100
    }
    const salesNumber = sales.length;
    const salesLastMonthNumber = salesLastMonth.length;
    const difference = salesNumber - salesLastMonthNumber;
    const percentage = (difference / salesLastMonthNumber) * 100;

    return percentage;
  }

  useEffect(() => {
    // if (location.hash === "#purchased") {
    //   setActiveTab("bought");
    // }
    const fetchProjectsList = async () => {
      setLoading(true);
      try {
        if (!user.id) {
          console.warn("No project id provided in route params");
          return;
        }
        const wishlistProjects = await api.users.getWishlist(user.id);
        setWishlistProjects(wishlistProjects);

        const boughtProjects = await api.users.getBoughtProjects(user.id);
        setBoughtProjects(boughtProjects);

        const sellingProjects = await api.users.getSelling(user.id);
        setSellingProjects(sellingProjects);

        const ordersForUser = await api.orders.getOrdersforUser(user.id);
        setOrdersforUser(ordersForUser);

        const userRevenue = await api.users.getRevenueByMonth(user.id, currentMonth);
        setUserRevenue(userRevenue);
        const userRevenueLastMonth = await api.users.getRevenueByMonth(user.id, currentMonth - 1);
        console.log("userRevenueLastMonth", userRevenueLastMonth);
        setUserRevenueLastMonth(userRevenueLastMonth);

        const userSales = await api.users.getSalesByMonth(user.id, currentMonth);
        setUserSales(userSales);
        const userSalesLastMonth = await api.users.getSalesByMonth(user.id, currentMonth - 1);
        setUserSalesLastMonth(userSalesLastMonth);
        console.log("userrrr", userSales);

        if (!(userSales.length === 0)) {
          let bestSale = userSales[0];
          userSales.forEach(sale => {
            if (sale.amount > bestSale.amount) {
              bestSale = sale;
            }
          });
          setBestProject(bestSale.project);
          
          const bestProjectrevenue = await api.projects.revenueByMonth(bestSale.project.id, currentMonth);
          setBestProjectrevenue(bestProjectrevenue);
        }
        
      } catch (err) {
        console.error("fetching failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectsList();
  }, [user.id,location]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        const hasSelling = Array.isArray(sellingProjects) && sellingProjects.length > 0;
        
        const revenueChange = handleRevenueTrend(userRevenue, userRevenueLastMonth);
        const salesChange = handleSalesTrend(userSales, userSalesLastMonth);
        
        return (
          <div className="space-y-8 animate-fade-in">
            {hasSelling ? (
              <>
                {/* Stats Grid - Seller View */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <StatsCard
                    title="Total Revenue"
                    value={`$${userRevenue.toLocaleString()}`}
                    subtitle="From all products"
                    icon={DollarSign}
                    variant="primary"
                    trend={{ value: revenueChange, isPositive: revenueChange >= 0 }}
                  />
                  <StatsCard
                    title="Total Sales"
                    value={userSales.length}
                    subtitle="Products sold"
                    icon={ShoppingBag}
                    trend={{ value: salesChange, isPositive: salesChange >= 0 }}
                  />
                  <StatsCard
                    title="Active Products"
                    value={sellingProjects.length}
                    subtitle={`of ${sellingProjects.length} total`}
                    icon={Package}
                  />
                  <StatsCard
                    title="Wishlist Items"
                    value={wishlistProjects.length}
                    icon={Heart}
                  />
                </div>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Transactions</CardTitle>
                      <CardDescription>
                        Your latest purchases and sales
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("transactions")}
                    >
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {userSales.slice(0, 5).map((sale) => (
                      <TransactionRow
                        key={sale.id}
                        transaction={sale}
                      />
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Stats Row */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Cart Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Items in cart
                          </span>
                          <span className="font-semibold">{cartItems.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Cart total</span>
                          <span className="font-semibold text-primary">
                            ${dashboardStats.cartTotal}
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => setActiveTab("cart")}
                        >
                          View Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-success" />
                        Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {bestProject ? (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Best seller</span>
                              <span className="font-semibold">
                                {bestProject.name}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">This month</span>
                              <Badge className="bg-success/10 text-success">
                                +${bestProjectrevenue}
                              </Badge>
                            </div>
                            <Button
                              variant="outline"
                              className="w-full"
                              onClick={() => setActiveTab("revenue")}
                            >
                              View Analytics
                            </Button>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No sales data yet</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <>
                {/* Stats Grid - Buyer View */}
                <div className="grid gap-6 md:grid-cols-2">
                  <StatsCard
                    title="Wishlist Items"
                    value={wishlistProjects.length}
                    subtitle="Saved for later"
                    icon={Heart}
                  />
                  <StatsCard
                    title="Cart Items"
                    value={cartItems.length}
                    subtitle="Ready to checkout"
                    icon={ShoppingCart}
                  />
                </div>

                {/* Buyer Quick Actions */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Wishlist Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Saved projects
                          </span>
                          <span className="font-semibold">{wishlistProjects.length}</span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => setActiveTab("wishlist")}
                        >
                          View Wishlist
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-primary" />
                        Cart Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            Items in cart
                          </span>
                          <span className="font-semibold">{cartItems.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Cart total</span>
                          <span className="font-semibold text-primary">
                            ${dashboardStats.cartTotal}
                          </span>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => setActiveTab("cart")}
                        >
                          View Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>
        );

      case "profile":
        return <ProfileSection user={user} />;

      case "wishlist":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Wishlist</h2>
                <p className="text-muted-foreground">
                  {wishlistProjects.length} items saved for later
                </p>
              </div>
            </div>
            {wishlistProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {wishlistProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    type="wishlist"
                    onRemove={() => handleRemoveFromWishlist(project.id)}
                    onAddToCart={() => handleAddToCart(project.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                      No items in your wishlist yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Start adding projects you love to your wishlist
                    </p>
                    <Link to="/projects">
                      <Button>
                        Browse Projects
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "cart":
        return <Cart />;

      case "transactions":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Transaction History
              </h2>
              <p className="text-muted-foreground">
                All your purchases and sales
              </p>
            </div>
            <Card>
              <CardContent className="pt-6">
                {userSales.length > 0 ? (
                  userSales.map((sale) => (
                    <TransactionRow
                      key={sale.id}
                      transaction={sale}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      case "bought":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Purchased Projects
              </h2>
              <p className="text-muted-foreground">
                {boughtProjects.length} projects in your library
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {boughtProjects.map((project) => (
                <ProjectCard key={project.id} project={project} type="bought" />
              ))}
            </div>
          </div>
        );

      case "selling":
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  My Products
                </h2>
                <p className="text-muted-foreground">
                  {sellingProjects.length} products listed
                </p>
              </div>
              <Link to="/sell">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Product
                </Button>
              </Link>
            </div>
            {sellingProjects.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {sellingProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    type="selling"
                    onEdit={() => handleEditProject(project.id)}
                    onDelete={() => handleDeleteProject(project.id)}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                      No products listed yet
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      Start selling your projects and reach thousands of developers
                    </p>
                    <Link to="/sell">
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "revenue":
        return (
          <RevenueChart 
            userRevenue={userRevenue}
            userRevenueLastMonth={userRevenueLastMonth}
            userSales={userSales}
            userSalesLastMonth={userSalesLastMonth}
            sellingProjects={sellingProjects}
          />
        );

      case "settings":
        return (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              <p className="text-muted-foreground">
                Manage your preferences and notifications
              </p>
            </div>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails about your account activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sale Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when someone buys your product
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Newsletter</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive our weekly newsletter
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Settings
                </CardTitle>
                <CardDescription>Manage your email preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-email">Primary Email</Label>
                  <Input
                    id="primary-email"
                    value={currentUser.email}
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-email">Backup Email</Label>
                  <Input id="backup-email" placeholder="Enter backup email" />
                </div>
                <Button variant="outline">Update Email Settings</Button>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>
                  Manage your privacy and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Email on Profile</Label>
                    <p className="text-sm text-muted-foreground">
                      Display your email address publicly
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Activity Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Show when you're online
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex bg-background ml-40">
        <DashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 h-screen overflow-y-auto py-8 pr-8">
          <div className="max-w-6xl mx-20">
            {loading ? (
              <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-12 w-12 animate-spin text-gray-400/50" />
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProject}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
