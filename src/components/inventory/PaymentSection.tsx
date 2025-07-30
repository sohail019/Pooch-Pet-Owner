import React, { useState, useEffect } from "react";
import { CreditCard, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "react-toastify";
import { 
  initiateInventoryPayment, 
  completeInventoryPayment, 
  InventoryPaymentPayload,
  InventoryItem 
} from "@/controllers/inventoryController";

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
  const [paymentStep, setPaymentStep] = useState<"initiating" | "processing" | "completing" | "success" | "error">("initiating");
  const [paymentId, setPaymentId] = useState<string>("");
  const [countdown, setCountdown] = useState(3);

  // Handle payment process
  useEffect(() => {
    const processPayment = async () => {
      try {
        // Step 1: Initiate payment
        setPaymentStep("initiating");
        
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
        
        // Validate that we received a valid payment ID
        if (!paymentResponse.id) {
          throw new Error("Failed to get payment ID from response");
        }

        setPaymentId(paymentResponse.id);
        setPaymentStep("processing");

        // Step 2: Simulate payment processing
        // toast.info("Processing payment...", { autoClose: 2000 });
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 3: Complete payment
        setPaymentStep("completing");
        
        const completionPayload = {
          paymentId: paymentResponse.id, // Include paymentId in payload
          status: "completed" as const,
          gatewayPaymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gatewaySignature: `sig_${Math.random().toString(36).substr(2, 20)}`,
          transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          gatewayResponse: {
            gateway: "razorpay",
            orderId: `order_${Date.now()}`,
            paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            signature: `sig_${Math.random().toString(36).substr(2, 20)}`
          }
        };

        console.log("💳 Completing payment with payload:", completionPayload);
        const completedPayment = await completeInventoryPayment(
          paymentResponse.id, 
          completionPayload
        );
        
        console.log("✅ Payment completed:", completedPayment);
        // toast.success("Payment completed successfully!");
        setPaymentStep("success");

        // Start countdown for redirect
        const countdownInterval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              onPaymentSuccess();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } catch (err) {
        console.error("❌ Payment failed:", err);
        const errorMessage = err instanceof Error ? err.message : "Payment failed. Please try again.";
        setPaymentStep("error");
        onPaymentError(errorMessage);
      }
    };

    processPayment();
  }, [product.id, quantity, totalAmount, onPaymentSuccess, onPaymentError]);

  const getStepContent = () => {
    switch (paymentStep) {
      case "initiating":
        return {
          title: "Initiating Payment",
          description: "Setting up your payment...",
          icon: <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />,
          color: "blue"
        };
      
      case "processing":
        return {
          title: "Processing Payment",
          description: "Please wait while we process your payment...",
          icon: <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />,
          color: "orange"
        };
      
      case "completing":
        return {
          title: "Completing Purchase",
          description: "Finalizing your order...",
          icon: <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />,
          color: "green"
        };
      
      case "success":
        return {
          title: "Payment Successful!",
          description: `Redirecting to home page in ${countdown} seconds...`,
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

          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2">
            {["initiating", "processing", "completing", "success"].map((step, index) => (
              <React.Fragment key={step}>
                <div
                  className={`w-3 h-3 rounded-full transition-colors ${
                    paymentStep === step
                      ? `bg-${stepContent.color}-600`
                      : index < ["initiating", "processing", "completing", "success"].indexOf(paymentStep)
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                {index < 3 && (
                  <div
                    className={`w-8 h-0.5 transition-colors ${
                      index < ["initiating", "processing", "completing", "success"].indexOf(paymentStep)
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
                onClick={onPaymentSuccess}
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
                onClick={() => window.location.reload()}
                className="flex-1"
                size="sm"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSection;
