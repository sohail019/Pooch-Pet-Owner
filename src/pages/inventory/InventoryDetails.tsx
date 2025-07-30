import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-toastify";
import { getInventoryById, InventoryItem } from "@/controllers/inventoryController";
import ProductImages from "@/components/inventory/ProductImages";
import ProductInfo from "@/components/inventory/ProductInfo";
import QuantitySelector from "@/components/inventory/QuantitySelector";
import VendorInfo from "@/components/inventory/VendorInfo";
import PaymentSection from "@/components/inventory/PaymentSection";

const InventoryDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<InventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  // Fetch product details
  const fetchProduct = useCallback(async () => {
    if (!id) {
      setError("Product ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log(`🔍 Fetching product details for ID: ${id}`);
      
      const productData = await getInventoryById(id);
      console.log("✅ Product data fetched:", productData);
      
      setProduct(productData);
    } catch (err) {
      console.error("❌ Failed to fetch product:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to load product details";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Handle quantity change
  const handleQuantityChange = useCallback((newQuantity: number) => {
    if (product && newQuantity > 0 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  }, [product]);

  // Handle payment success
  const handlePaymentSuccess = useCallback(() => {
    toast.success("Payment completed successfully!");
    navigate("/", { replace: true });
  }, [navigate]);

  // Handle payment error
  const handlePaymentError = useCallback((error: string) => {
    setPaymentError(error);
    setPaymentLoading(false);
  }, []);

  // Calculate total price
  const totalPrice = product ? parseFloat(product.salePrice) * quantity : 0;
  const originalPrice = product ? parseFloat(product.price) * quantity : 0;
  const savings = originalPrice - totalPrice;

if (loading) {
    return (
        <div className="min-h-screen  p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header skeleton */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10  rounded-full animate-pulse" />
                    <div className="w-32 h-6  rounded animate-pulse" />
                </div>

                {/* Content skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="w-full h-80  rounded-lg animate-pulse" />
                    <div className="space-y-4">
                        <div className="w-3/4 h-8  rounded animate-pulse" />
                        <div className="w-1/2 h-6  rounded animate-pulse" />
                        <div className="w-full h-20  rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}

  if (error || !product) {
    return (
      <div className="min-h-screen  p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {product.name}
              </h1>
              <p className="text-sm text-gray-400">
                {product.brand} • {product.category}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Product Images */}
          <ProductImages 
            images={product.images} 
            productName={product.name} 
          />

          {/* Product Info & Quick Actions */}
          <div className="space-y-4">
            <ProductInfo 
              product={product}
              quantity={quantity}
              totalPrice={totalPrice}
              originalPrice={originalPrice}
              savings={savings}
            />

            {/* Quantity Selector */}
            <QuantitySelector
              quantity={quantity}
              maxQuantity={product.quantity}
              onQuantityChange={handleQuantityChange}
              disabled={paymentLoading}
            />

            {/* Quick Buy Section */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-200">Total Amount:</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-400">
                      ₹{totalPrice.toFixed(2)}
                    </div>
                    {savings > 0 && (
                      <div className="text-sm text-green-600">
                        You save ₹{savings.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  className="w-full h-12 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-[1.03] transition-transform duration-150"
                  size="lg"
                  disabled={!product.isActive || product.quantity === 0 || paymentLoading}
                  onClick={() => setPaymentLoading(true)}
                >
                  <span className="relative flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 animate-bounce" />
                    {paymentLoading && (
                      <svg className="ml-2 w-4 h-4 animate-spin text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                    )}
                  </span>
                  <span>
                    {!product.isActive 
                      ? "Product Unavailable" 
                      : product.quantity === 0 
                      ? "Out of Stock" 
                      : paymentLoading 
                      ? "Processing..." 
                      : "Buy Now"
                    }
                  </span>
                </Button>

                {!product.isActive && (
                  <p className="text-xs text-red-600 mt-2 text-center">
                    This product is currently unavailable
                  </p>
                )}

                {product.quantity === 0 && product.isActive && (
                  <p className="text-xs text-red-600 mt-2 text-center">
                    This product is currently out of stock
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Vendor Information */}
        {product.vendor && (
          <VendorInfo vendor={product.vendor} />
        )}

        {/* Payment Section */}
        {paymentLoading && (
          <PaymentSection
            product={product}
            quantity={quantity}
            totalAmount={totalPrice}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            onCancel={() => setPaymentLoading(false)}
          />
        )}

        {/* Payment Error */}
        {paymentError && (
          <Card className="mt-4 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Payment Failed</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{paymentError}</p>
              <Button
                onClick={() => setPaymentError("")}
                variant="outline"
                size="sm"
                className="mt-3"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InventoryDetails;
