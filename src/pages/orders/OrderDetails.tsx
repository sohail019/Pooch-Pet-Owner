import React, { useEffect, useState, useCallback } from "react";
import { ArrowLeft, Package, Calendar, CreditCard, Truck, MapPin, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getOrderById, 
  ProductOrder, 
  PackageOrder, 
  isProductOrder,
  getOrderStatusDisplay,
  getPaymentStatusDisplay 
} from "@/controllers/ordersController";
import { handleApiError } from "@/types/errors";

const OrderDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<ProductOrder | PackageOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch order details
  const fetchOrderDetails = useCallback(async () => {
    if (!id) {
      setError("Order ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log(`📦 Fetching order details for ID: ${id}`);
      const orderDetails = await getOrderById(id);
      console.log("✅ Order details fetched:", orderDetails);
      
      setOrder(orderDetails);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch order details:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/my-orders")}
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Order Details</h1>
                <p className="text-gray-400">Loading...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="w-32 h-6 bg-gray-200 rounded" />
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-gray-200 rounded" />
                      <div className="w-3/4 h-4 bg-gray-200 rounded" />
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
  if (error || !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/my-orders")}
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Order Details</h1>
                <p className="text-gray-400">Error loading order</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <Package className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Order Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "The order you're looking for doesn't exist or has been removed."}
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/my-orders")} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Orders
                </Button>
                <Button onClick={fetchOrderDetails}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusDisplay = getOrderStatusDisplay(order.status);
  const payment = isProductOrder(order) ? order.userProductPayment : order.userPackagePayment;
  const paymentDisplay = getPaymentStatusDisplay(payment.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/my-orders")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-gray-400">Order #{order.id.slice(-8)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Order Status */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={`${statusDisplay.color} text-sm`}>
                  {statusDisplay.label}
                </Badge>
                <p className="text-gray-600 mt-1">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ₹{parseFloat(isProductOrder(order) ? order.totalPrice : order.userPackageItem.price).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isProductOrder(order) ? <Package className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              {isProductOrder(order) ? "Product Details" : "Package Details"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isProductOrder(order) ? (
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={order.userProductItem.images?.[0] || "https://via.placeholder.com/80x80/e5e7eb/6b7280?text=No+Image"}
                    alt={order.userProductItem.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{order.userProductItem.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>SKU: {order.userProductItem.sku}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>Unit Price: ₹{parseFloat(order.unitPrice).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{order.userPackageItem.name}</h3>
                <p className="text-gray-600 mb-3">{order.userPackageItem.description}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Duration: {order.userPackageItem.duration} days</p>
                  <p>Price: ₹{parseFloat(order.userPackageItem.price).toFixed(2)}</p>
                  <p>Active Period: {formatDate(order.startDate)} - {formatDate(order.endDate)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={paymentDisplay.color}>
                    {paymentDisplay.label}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Payment ID: <span className="font-mono">{payment.id}</span></p>
                  <p>Method: {payment.method}</p>
                  <p>Amount: ₹{parseFloat(payment.amount).toFixed(2)}</p>
                  <p>Date: {formatDate(payment.createdAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information - Only for Product Orders */}
        {isProductOrder(order) && (order.deliveryAddress || order.deliveryDate) && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.deliveryAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery Address</p>
                      <p className="text-gray-600">{order.deliveryAddress}</p>
                    </div>
                  </div>
                )}
                {order.deliveryDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-700">Delivery Date</p>
                      <p className="text-gray-600">{formatDate(order.deliveryDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes - Only for Product Orders */}
        {isProductOrder(order) && order.notes && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Order Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{order.notes}</p>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate("/my-orders")} 
                variant="outline"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Orders
              </Button>
              <Button
                onClick={() => navigate(
                  isProductOrder(order) ? `/inventory/${order.productId}` : `/packages/${order.packageId}`
                )}
                className="bg-blue-600 hover:bg-blue-700"
              >
                View {isProductOrder(order) ? "Product" : "Package"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
