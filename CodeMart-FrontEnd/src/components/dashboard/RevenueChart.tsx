import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api, { getCurrentUser } from "@/services/api";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Loader2 } from "lucide-react";

const monthlyRevenue = [
  { month: 'Sep', revenue: 2400, sales: 12 },
  { month: 'Oct', revenue: 3200, sales: 18 },
  { month: 'Nov', revenue: 2800, sales: 15 },
  { month: 'Dec', revenue: 4100, sales: 24 },
  { month: 'Jan', revenue: 3600, sales: 20 },
  { month: 'Feb', revenue: 4800, sales: 28 },
  { month: 'Mar', revenue: 5200, sales: 32 },
];

interface RevenueChartProps {
  userRevenue: string;
  userRevenueLastMonth: string;
  userSales: any[];
  userSalesLastMonth: any[];
  sellingProjects: any[];
}

export function RevenueChart({ 
  userRevenue, 
  userRevenueLastMonth, 
  userSales, 
  userSalesLastMonth,
  sellingProjects 
}: RevenueChartProps) {
  
  const user = getCurrentUser();
  const [productRevenues, setProductRevenues] = useState<Array<{name: string; revenue: number}>>([]);
  const [monthlyRevenues, setMonthlyRevenues] = useState<Array<{month: string; revenue: number, sales: number}>>([]);
  const [selectedMonths, setSelectedMonths] = useState<number>(7);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProjectRevenues = async () => {
    const revenues = await Promise.all(
      sellingProjects.map(async (project) => {
        const response = await api.projects.revenue(project.id);
        return {
          name: project.name,
          revenue: response || 0
        };
      })
    );
    setProductRevenues(revenues)
  }

  const currentMonth = new Date().getMonth() + 1;

  const mapMonths = (month: number): string => {
    switch (month) {
      case 1:
        return 'Jan';
      case 2:
        return 'Feb';
      case 3:
        return 'Mar';
      case 4:
        return 'Apr';
      case 5:
        return 'May';
      case 6:
        return 'Jun';
      case 7:
        return 'Jul';
      case 8:
        return 'Aug';
      case 9:
        return 'Sep';
      case 10:
        return 'Oct';
      case 11:
        return 'Nov';
      case 12:
        return 'Dec';
      default:
        return 'Unknown';
    }
  }

  const fetchMonthlyRevenues = async (months: number) => {
    const revenues = [];
    for (let i = currentMonth; i > currentMonth - months; i--) {
      const revenueMonth = await api.users.getRevenueByMonth(user.id, i);
      const salesMonth = await api.users.getSalesByMonth(user.id, i);
      revenues.push({ 
        month: mapMonths(i) || 'Unknown', 
        revenue: revenueMonth || 0, 
        sales: salesMonth.length || 0 
      });
    }
    setMonthlyRevenues(revenues);
    console.log("Monthly revenues", revenues);
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (sellingProjects.length > 0) {
          await fetchProjectRevenues();
        }
        await fetchMonthlyRevenues(selectedMonths);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sellingProjects, selectedMonths])

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const currentRevenue = parseFloat(userRevenue) || 0;
  const lastMonthRevenue = parseFloat(userRevenueLastMonth) || 0;
  const revenueChange = calculatePercentageChange(currentRevenue, lastMonthRevenue);

  const currentSalesCount = userSales.length;
  const lastMonthSalesCount = userSalesLastMonth.length;
  const salesChange = calculatePercentageChange(currentSalesCount, lastMonthSalesCount);

  const avgSaleValue = currentSalesCount > 0 ? currentRevenue / currentSalesCount : 0;
  const lastMonthAvgSaleValue = lastMonthSalesCount > 0 ? lastMonthRevenue / lastMonthSalesCount : 0;
  const avgSaleChange = calculatePercentageChange(avgSaleValue, lastMonthAvgSaleValue);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Revenue Over Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Your earnings over the past {selectedMonths} months</CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setSelectedMonths(3)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedMonths === 3
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              3M
            </button>
            <button
              onClick={() => setSelectedMonths(6)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedMonths === 6
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              6M
            </button>
            <button
              onClick={() => setSelectedMonths(12)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                selectedMonths === 12
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              12M
            </button>
            <div className="flex items-center gap-1 ml-2">
              <input
                type="number"
                min="1"
                max="12"
                value={selectedMonths}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (value >= 1 && value <= 12) {
                    setSelectedMonths(value);
                  }
                }}
                className="w-16 px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <span className="text-sm text-muted-foreground">months</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400/50" />
              </div>
            ) : sellingProjects.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No selling projects yet. Start selling to see your revenue analytics!</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenues}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(215, 16%, 47%)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(215, 16%, 47%)" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(214, 32%, 91%)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(221, 83%, 53%)" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Product */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Product</CardTitle>
          <CardDescription>Total earnings from each of your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400/50" />
              </div>
            ) : sellingProjects.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No products to display</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productRevenues} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" horizontal={false} />
                  <XAxis 
                    type="number" 
                    stroke="hsl(215, 16%, 47%)" 
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="hsl(215, 16%, 47%)" 
                    fontSize={12}
                    width={150}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(0, 0%, 100%)',
                      border: '1px solid hsl(214, 32%, 91%)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`$${value}`, 'Revenue']}
                  />
                  <Bar 
                    dataKey="revenue" 
                    fill="hsl(142, 76%, 36%)" 
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">${currentRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">This Month</p>
              <p className={`text-xs mt-2 ${revenueChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {revenueChange >= 0 ? '↑' : '↓'} {Math.abs(revenueChange).toFixed(1)}% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{currentSalesCount}</p>
              <p className="text-sm text-muted-foreground mt-1">Sales This Month</p>
              <p className={`text-xs mt-2 ${salesChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {salesChange >= 0 ? '↑' : '↓'} {Math.abs(salesChange).toFixed(1)}% from last month
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">${avgSaleValue.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground mt-1">Avg. Sale Value</p>
              <p className={`text-xs mt-2 ${avgSaleChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {avgSaleChange >= 0 ? '↑' : '↓'} {Math.abs(avgSaleChange).toFixed(1)}% from last month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
