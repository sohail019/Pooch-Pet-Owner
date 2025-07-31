import React from "react";
import { Package, Calendar, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { 
  ProductOrder, 
  PackageOrder, 
  isProductOrder,
  getOrderStatusDisplay,
  getPaymentStatusDisplay 
} from "@/controllers/ordersController";

interface OrderCardProps {
  order: ProductOrder | PackageOrder;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  
  const statusDisplay = getOrderStatusDisplay(order.status);
  const paymentDisplay = getPaymentStatusDisplay(
    isProductOrder(order) ? order.userProductPayment.status : order.userPackagePayment.status
  );

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

  // Get item details based on order type
  const getItemDetails = () => {
    if (isProductOrder(order)) {
      return {
        name: order.userProductItem.name,
        image: order.userProductItem.images?.[0] || null,
        sku: order.userProductItem.sku,
        price: order.userProductItem.price,
        type: "Product" as const,
        navigateTo: `/inventory/${order.productId}`
      };
    } else {
      return {
        name: order.userPackageItem.name,
        image: null, // Packages might not have images
        description: order.userPackageItem.description,
        price: order.userPackageItem.price,
        type: "Package" as const,
        navigateTo: `/packages/${order.packageId}`
      };
    }
  };

  const itemDetails = getItemDetails();
  const payment = isProductOrder(order) ? order.userProductPayment : order.userPackagePayment;

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 hover:shadow-xl transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12">
                {itemDetails.image ? (
                  <img
                    src={itemDetails.image}
                    alt={itemDetails.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      target.nextElementSibling?.classList.remove("hidden");
                    }}
                  />
                ) : null}
                <div className={`w-full h-full bg-gradient-to-r from-blue-700 to-indigo-800 flex items-center justify-center text-white font-bold ${itemDetails.image ? "hidden" : ""}`}>
                  <Package className="w-6 h-6 text-blue-300" />
                </div>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold text-white">{itemDetails.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-gray-700 text-gray-300"
                  >
                    {itemDetails.type}
                  </Badge>
                  {isProductOrder(order) && (
                    <span className="text-xs text-gray-400">SKU: {itemDetails.sku}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <Badge className="bg-blue-900 text-blue-300">
                {statusDisplay.label}
              </Badge>
              <Badge className="bg-green-900 text-green-300">
                {paymentDisplay.label}
              </Badge>
            </div>
          </div>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-800 rounded-lg">
            {isProductOrder(order) ? (
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Quantity & Price</p>
                  <p className="text-sm text-gray-300">
                    {order.quantity} × ₹{parseFloat(order.unitPrice).toFixed(2)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Duration</p>
                  <p className="text-sm text-gray-300">{order.userPackageItem.duration} days</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="text-sm font-medium text-white">Order Date</p>
                <p className="text-sm text-gray-300">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-green-400" />
              <div>
                <p className="text-sm font-medium text-white">Payment</p>
                <p className="text-sm text-gray-300">
                  {payment.method} • ₹{parseFloat(payment.amount).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Package Description or Product Details */}
          {!isProductOrder(order) && order.userPackageItem.description && (
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Package className="w-4 h-4 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Package Details</p>
                  <p className="text-sm text-gray-300 line-clamp-2">{order.userPackageItem.description}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-white">Active Period</p>
                  <p className="text-sm text-gray-300">{formatDate(order.startDate)} - {formatDate(order.endDate)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery Information for Products */}
          {isProductOrder(order) && order.deliveryDate && (
            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-orange-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">Delivery</p>
                <p className="text-sm text-gray-300">{formatDate(order.deliveryDate)}</p>
              </div>
            </div>
          )}

          {/* Order ID */}
          <div className="text-center pt-2 border-t border-gray-700">
            <div className="text-xs text-gray-500">
              Order ID: <span className="font-mono text-gray-400">{order.id}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="text-lg font-bold text-green-400">
              Total: ₹{parseFloat(isProductOrder(order) ? order.totalPrice : order.userPackageItem.price).toFixed(2)}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => navigate(`/orders/${order.id}`)}
                variant="outline"
                size="sm"
                className="border border-blue-500 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
              >
                View Details
              </Button>
              <Button
                onClick={() => navigate(itemDetails.navigateTo)}
                variant="outline"
                size="sm"
                className="border border-green-500 text-green-400 hover:bg-green-600 hover:text-white transition-all shadow-sm"
              >
                View {itemDetails.type}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
