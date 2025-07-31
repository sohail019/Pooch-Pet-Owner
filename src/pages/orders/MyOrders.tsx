import React, { useEffect, useState } from "react";
import { ArrowLeft, Package, ShoppingBag, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserOrders, SeparatedOrders } from "@/controllers/ordersController";
import OrderCard from "@/components/orders/OrderCard";
import { handleApiError } from "@/types/errors";

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SeparatedOrders | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "products" | "packages">("all");

  // Fetch user's orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("📦 Fetching user orders...");
      const userOrders = await getUserOrders();
      console.log("✅ Orders fetched:", userOrders);
      
      setOrders(userOrders);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch orders:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Get filtered orders based on active tab
  const getFilteredOrders = () => {
    if (!orders) return [];
    
    switch (activeTab) {
      case "products":
        return orders.productOrders;
      case "packages":
        return orders.packageOrders;
      case "all":
      default:
        return [...orders.productOrders, ...orders.packageOrders].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const filteredOrders = getFilteredOrders();
  const totalOrders = orders ? orders.productOrders.length + orders.packageOrders.length : 0;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Header */}
        <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="text-gray-400">Loading your orders...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-6xl mx-auto p-4">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-700 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="w-48 h-4 bg-gray-700 rounded" />
                        <div className="w-32 h-3 bg-gray-700 rounded" />
                        <div className="w-24 h-3 bg-gray-700 rounded" />
                      </div>
                      <div className="w-20 h-6 bg-gray-700 rounded" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="w-full h-4 bg-gray-700 rounded" />
                      <div className="w-full h-4 bg-gray-700 rounded" />
                      <div className="w-full h-4 bg-gray-700 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Header */}
        <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">My Orders</h1>
                <p className="text-gray-400">Failed to load orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-4xl mx-auto p-4">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-700 to-pink-800 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-300" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Failed to Load Orders
              </h2>
              <p className="text-gray-300 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  className="border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button 
                  onClick={fetchOrders}
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-gray-400">
                {totalOrders === 0 ? "No orders found" : `${totalOrders} order${totalOrders !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Filter Tabs */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { key: "all", label: "All Orders", count: totalOrders },
              { key: "products", label: "Products", count: orders?.productOrders.length || 0 },
              { key: "packages", label: "Packages", count: orders?.packageOrders.length || 0 },
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-6 py-2 rounded-full font-medium transition-all
                  ${activeTab === tab.key
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700"}
                `}
              >
                {tab.label}
                <Badge
                  variant="secondary"
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs
                    ${activeTab === tab.key
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-700 text-gray-300"}
                  `}
                >
                  {tab.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Orders Summary */}
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:items-center mb-2">
          <h2 className="text-xl font-semibold text-white text-center md:text-left">
            {activeTab === "all" ? "All Orders" : 
             activeTab === "products" ? "Product Orders" :
             "Package Orders"} ({filteredOrders.length})
          </h2>
          <Button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 w-full md:w-auto"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </div>        {/* Main Content */}
        {filteredOrders.length === 0 ? (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {activeTab === "all" ? "No Orders Yet" : 
                 activeTab === "products" ? "No Product Orders" :
                 "No Package Orders"}
              </h3>
              <p className="text-gray-300 mb-6">
                {activeTab === "all" 
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : `You haven't ordered any ${activeTab} yet.`
                }
              </p>
              <Button 
                onClick={() => navigate("/")} 
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
