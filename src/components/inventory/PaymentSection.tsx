import React, { useState, useEffect } from "react";
import { CreditCard, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  initiateInventoryPayment, 
  InventoryPaymentPayload,
  InventoryItem 
} from "@/controllers/inventoryController";
import { completePayment } from "@/controllers/paymentController";

interface PaymentSectionProps {
  product: InventoryItem;
  quantity: number;
  totalAmount: number;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  onCancel: () => void;
}

const PaymentSection: React.FC<PaymentSectionProps> = ({
  product,
  quantity,
  totalAmount,
  onPaymentSuccess,
  onPaymentError,
  onCancel,
}) => {
  const [paymentStep, setPaymentStep] = useState<"initiate" | "initiated" | "completing" | "success" | "error">("initiate");
  const [paymentId, setPaymentId] = useState<string>("");
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();

  // Handle payment initiation
  const handleInitiatePayment = async () => {
    try {
      setPaymentStep("initiate");
      
      const paymentPayload: InventoryPaymentPayload = {
        productId: product.id,
        quantity: quantity,
        amount: totalAmount,
        currency: "INR",
        method: "credit_card",
        deliveryAddress: "123 Main Street, Mumbai, Maharashtra 400001, India"
      };

      console.log("💳 Initiating payment with payload:", paymentPayload);
      const paymentResponse = await initiateInventoryPayment(paymentPayload);
      console.log("✅ Payment initiated:", paymentResponse);
      
      if (!paymentResponse.id) {
        throw new Error("Failed to get payment ID from response");
      }

      setPaymentId(paymentResponse.id);
      setPaymentStep("initiated");
      toast.success("Payment initiated successfully! Click 'Complete Payment' to finish.");

    } catch (err) {
      console.error("❌ Payment initiation failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Payment initiation failed. Please try again.";
      setPaymentStep("error");
      onPaymentError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Handle payment completion using new API
  const handleCompletePayment = async () => {
    if (!paymentId) {
      toast.error("No payment ID available. Please initiate payment first.");
      return;
    }

    try {
      setIsCompleting(true);
      setPaymentStep("completing");
      
      console.log("💳 Completing payment with ID:", paymentId);
      const completedPayment = await completePayment(paymentId, "completed");
      console.log("✅ Payment completed:", completedPayment);
      
      setPaymentStep("success");
      toast.success("Payment completed successfully!");
      
      // Navigate to My Orders after short delay
      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);

    } catch (err) {
      console.error("❌ Payment completion failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Payment completion failed. Please try again.";
      setPaymentStep("error");
      onPaymentError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCompleting(false);
    }
  };

  // Auto-initiate payment on component mount
  useEffect(() => {
    handleInitiatePayment();
  }, []);

  const getStepContent = () => {
    switch (paymentStep) {
      case "initiate":
        return {
          title: "Initiating Payment",
          description: "Setting up your payment...",
          icon: <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />,
          color: "blue"
        };
      
      case "initiated":
        return {
          title: "Payment Ready",
          description: "Payment has been initiated. Click 'Complete Payment' to finish your purchase.",
          icon: <CreditCard className="w-6 h-6 text-green-600" />,
          color: "green"
        };
      
      case "completing":
        return {
          title: "Completing Payment",
          description: "Finalizing your payment...",
          icon: <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />,
          color: "green"
        };
      
      case "success":
        return {
          title: "Payment Successful!",
          description: "Redirecting to My Orders page...",
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          color: "green"
        };
      
      case "error":
        return {
          title: "Payment Failed",
          description: "There was an issue processing your payment",
          icon: <AlertCircle className="w-6 h-6 text-red-600" />,
          color: "red"
        };
      
      default:
        return {
          title: "Processing",
          description: "Please wait...",
          icon: <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />,
          color: "gray"
        };
    }
  };

  const stepContent = getStepContent();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onCancel}>
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="text-center relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          {paymentStep !== "success" && (
            <Button
              onClick={onCancel}
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 w-8 h-8 p-0 rounded-full text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          <div className="flex flex-col items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              {stepContent.icon}
            </div>
            <CardTitle className="text-xl font-bold">{stepContent.title}</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Order Summary
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600 font-medium">Product:</span>
                <span className="font-semibold text-gray-900">{product.name}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600 font-medium">Quantity:</span>
                <span className="font-semibold text-gray-900">{quantity} {product.unit}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                <span className="text-gray-600 font-medium">Unit Price:</span>
                <span className="font-semibold text-gray-900">₹{parseFloat(product.salePrice).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg border border-green-200">
                <span className="font-bold text-green-800">Total Amount:</span>
                <span className="font-bold text-lg text-green-800">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-3">
              {stepContent.description}
            </p>
            
            {paymentId && (
              <div className="text-xs text-gray-500">
                Payment ID: <span className="font-mono">{paymentId}</span>
              </div>
            )}
          </div>

          {/* Complete Payment Button */}
          {paymentStep === "initiated" && (
            <div className="flex flex-col gap-3">
              <Button 
                onClick={handleCompletePayment}
                disabled={!paymentId || isCompleting}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isCompleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Completing Payment...
                  </>
                ) : (
                  "Complete Payment"
                )}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Click to complete your payment and confirm your order
              </p>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2">
            {["initiate", "initiated", "completing", "success"].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    paymentStep === step
                      ? `bg-${stepContent.color}-600`
                      : index < ["initiate", "initiated", "completing", "success"].indexOf(paymentStep)
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                {index < 3 && (
                  <div
                    className={`w-8 h-0.5 transition-colors ${
                      index < ["initiate", "initiated", "completing", "success"].indexOf(paymentStep)
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Payment Method Info */}
          <div className="text-center pt-4 border-t">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <CreditCard className="w-4 h-4" />
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>

          {/* Success Actions */}
          {paymentStep === "success" && (
            <div className="flex gap-2">
              <Button 
                onClick={() => navigate("/my-orders")}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                View My Orders
              </Button>
              <Button 
                onClick={onPaymentSuccess}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Continue Shopping
              </Button>
            </div>
          )}

          {/* Error Actions */}
          {paymentStep === "error" && (
            <div className="flex gap-2">
              <Button 
                onClick={onCancel}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleInitiatePayment}
                className="flex-1"
                size="sm"
              >
                Retry Payment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSection;
