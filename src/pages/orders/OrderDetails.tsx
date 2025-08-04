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
        {/* Header */}
        <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/70 backdrop-blur-md shadow-md">
          <div className="max-w-4xl mx-auto px-6 py-5 flex items-center gap-4">
        <Button
          onClick={() => navigate("/my-orders")}
          variant="ghost"
          size="icon"
          className="rounded-full p-2 text-white hover:bg-gray-800 transition"
          aria-label="Back to Orders"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">
            Order Details
          </h1>
          <p className="text-gray-400">Loading order information...</p>
        </div>
          </div>
        </div>

        {/* Skeleton Loader */}
        <div className="max-w-4xl mx-auto p-4">
          <div className="space-y-8">
        {/* Order Status Skeleton */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-6 animate-pulse">
          <div className="bg-blue-200 rounded-full w-10 h-10" />
          <div className="flex-1">
            <div className="h-5 w-32 bg-gray-300 rounded mb-2" />
            <div className="h-3 w-20 bg-gray-300 rounded" />
          </div>
            </div>
            <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-2 w-1/2">
            <div className="h-3 w-24 bg-gray-300 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-2 items-end w-1/2">
            <div className="h-3 w-20 bg-gray-300 rounded" />
            <div className="h-6 w-24 bg-blue-200 rounded" />
          </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details Skeleton */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <CardContent className="p-8 flex items-center gap-8 animate-pulse">
            <div className="w-24 h-24 bg-gray-200 rounded-xl" />
            <div className="flex-1 space-y-3">
          <div className="h-5 w-40 bg-gray-300 rounded" />
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-12 bg-blue-200 rounded" />
          </div>
          <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Skeleton */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <CardContent className="p-8 animate-pulse">
            <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-green-200 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-blue-200 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-20 bg-green-200 rounded" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-3 w-16 bg-gray-300 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
            </div>
          </CardContent>
        </Card>
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
      <header className="sticky top-0 z-20 bg-gradient-to-r from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-md shadow-md border-b border-gray-800">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-4">
        <Button
          onClick={() => navigate("/my-orders")}
          variant="ghost"
          size="icon"
          className="rounded-full p-2 text-white hover:bg-gray-800 transition"
          aria-label="Back to Orders"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1">
            Order Details
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
          #{order.id.slice(-8)}
            </span>
            <Badge className="ml-1 text-xs px-2 py-0.5 font-medium" variant="secondary">
          {getOrderStatusDisplay(order.status).label}
            </Badge>
          </div>
        </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
        <span className="text-xs text-gray-400">Placed on</span>
        <span className="text-sm font-medium text-gray-200">
          {formatDate(order.createdAt)}
        </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Order Status */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
          <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
          <CardTitle className="text-lg font-semibold text-white mb-0">
            Order Status
          </CardTitle>
          <span className={`inline-flex items-center gap-2 mt-1`}>
            <Badge className={`${statusDisplay.color} text-xs px-2 py-0.5 font-medium`}>
              {statusDisplay.label}
            </Badge>
            <span className="text-xs text-gray-400 font-mono">
              Placed {formatDate(order.createdAt)}
            </span>
          </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Order ID</span>
          <span className="font-mono text-sm text-gray-800 bg-gray-200 rounded px-2 py-0.5 w-fit">
            #{order.id.slice(-8)}
          </span>
              </div>
              <div className="flex flex-col items-end">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Total Amount</span>
          <span className="text-2xl font-bold text-blue-600">
            ₹{parseFloat(isProductOrder(order) ? order.totalPrice : order.userPackageItem.price).toFixed(2)}
          </span>
          <span className="text-xs text-gray-400">incl. taxes</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Item Details */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
              <span className="bg-blue-100 rounded-full p-2">
          {isProductOrder(order) ? (
            <Package className="w-5 h-5 text-blue-600" />
          ) : (
            <FileText className="w-5 h-5 text-purple-600" />
          )}
              </span>
              {isProductOrder(order) ? "Product Details" : "Package Details"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isProductOrder(order) ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 border-blue-200 shadow-md bg-gray-100">
            <img
              src={order.userProductItem.images?.[0] || "https://via.placeholder.com/96x96/e5e7eb/6b7280?text=No+Image"}
              alt={order.userProductItem.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white mb-1">{order.userProductItem.name}</h3>
            <div className="flex flex-wrap gap-3 mb-2">
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-mono">
                SKU: {order.userProductItem.sku}
              </span>
              <span className="bg-blue-800/80 text-blue-100 text-xs px-2 py-0.5 rounded font-mono">
                Qty: {order.quantity}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Unit Price:</span>
              <span className="text-blue-400 font-bold text-lg">
                ₹{parseFloat(order.unitPrice).toFixed(2)}
              </span>
            </div>
          </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-white mb-1">{order.userPackageItem.name}</h3>
            <p className="text-gray-400 mb-3">{order.userPackageItem.description}</p>
            <div className="flex flex-wrap gap-3 mb-2">
              <span className="bg-purple-800/80 text-purple-100 text-xs px-2 py-0.5 rounded font-mono">
                Duration: {order.userPackageItem.duration} days
              </span>
              <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded font-mono">
                Price: ₹{parseFloat(order.userPackageItem.price).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Active:</span>
              <span className="text-green-400 font-mono text-sm">
                {formatDate(order.startDate)} - {formatDate(order.endDate)}
              </span>
            </div>
          </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-white">
              <span className="bg-green-100 rounded-full p-2">
          <CreditCard className="w-5 h-5 text-green-600" />
              </span>
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex flex-col gap-2">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Status</span>
          <Badge className={`${paymentDisplay.color} text-xs px-3 py-1 font-semibold rounded-full`}>
            {paymentDisplay.label}
          </Badge>
              </div>
              <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Payment ID</span>
          <span className="font-mono text-sm text-gray-200 bg-gray-800 rounded px-2 py-0.5 w-fit">
            {payment.id}
          </span>
              </div>
              <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Method</span>
          <span className="text-sm font-medium text-blue-300 bg-blue-900/60 rounded px-2 py-0.5 w-fit">
            {payment.method}
          </span>
              </div>
              <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Amount</span>
          <span className="text-lg font-bold text-green-400">
            ₹{parseFloat(payment.amount).toFixed(2)}
          </span>
              </div>
              <div className="flex flex-col gap-1">
          <span className="text-gray-400 text-xs uppercase tracking-wide">Date</span>
          <span className="text-sm text-gray-300 font-mono">
            {formatDate(payment.createdAt)}
          </span>
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
        <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900">
          <CardContent className="p-8 flex flex-col items-center">
            <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
              <Button 
          onClick={() => navigate("/my-orders")} 
          variant="outline"
          className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition"
              >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-semibold">Back to Orders</span>
              </Button>
              <Button
          onClick={() => navigate(
            isProductOrder(order) ? `/inventory/${order.productId}` : `/packages/${order.packageId}`
          )}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold shadow-lg px-6 py-2 rounded-lg transition"
              >
          <span>View {isProductOrder(order) ? "Product" : "Package"}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetails;
