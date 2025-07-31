import React, { useEffect, useState } from "react";
import { ArrowLeft, Package, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getUserInventoryItems, UserInventoryItem } from "@/controllers/inventoryController";
import { handleApiError } from "@/types/errors";

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<UserInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user's orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("📦 Fetching user orders...");
      const userOrders = await getUserInventoryItems();
      console.log("✅ Orders fetched:", userOrders);
      
      // Sort by purchase date (newest first)
      const sortedOrders = userOrders.sort((a, b) => 
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
      );
      
      setOrders(sortedOrders);
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

  // Get status color and icon
  const getStatusDisplay = (status: UserInventoryItem["status"]) => {
    switch (status) {
      case "active":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-3 h-3" />,
          label: "Active"
        };
      case "used":
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <Package className="w-3 h-3" />,
          label: "Used"
        };
      case "expired":
        return {
          color: "bg-red-100 text-red-800",
          icon: <XCircle className="w-3 h-3" />,
          label: "Expired"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <AlertCircle className="w-3 h-3" />,
          label: "Unknown"
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

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
                <p className="text-gray-400">Your purchased products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Content */}
        <div className="max-w-6xl mx-auto p-4">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="w-48 h-4 bg-gray-200 rounded" />
                        <div className="w-32 h-3 bg-gray-200 rounded" />
                        <div className="w-24 h-3 bg-gray-200 rounded" />
                      </div>
                      <div className="w-20 h-6 bg-gray-200 rounded" />
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
                <p className="text-gray-400">Your purchased products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Content */}
        <div className="max-w-4xl mx-auto p-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Failed to Load Orders
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/")} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button onClick={fetchOrders}>
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
                {orders.length === 0 ? "No orders found" : `${orders.length} order${orders.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {orders.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here!
              </p>
              <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusDisplay = getStatusDisplay(order.status);
              
              return (
                <Card key={order.id} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={order.inventory.images?.[0] || "https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image"}
                          alt={order.inventory.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (target.src !== "https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image") {
                              target.src = "https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image";
                            }
                          }}
                        />
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {order.inventory.name}
                          </h3>
                          <Badge className={`${statusDisplay.color} flex items-center gap-1`}>
                            {statusDisplay.icon}
                            {statusDisplay.label}
                          </Badge>
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            <span>Quantity: {order.quantity} {order.inventory.unit}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Purchased: {formatDate(order.purchaseDate)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Order ID:</span>
                            <span className="font-mono text-xs">{order.id}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="text-lg font-bold text-green-600">
                            ₹{order.totalAmount.toFixed(2)}
                          </div>
                          <Button
                            onClick={() => navigate(`/inventory/${order.inventory.id}`)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 border-blue-300 hover:bg-blue-50"
                          >
                            View Product
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
