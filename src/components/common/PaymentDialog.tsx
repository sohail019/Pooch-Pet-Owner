import React, { useState, useEffect } from "react";
import { CreditCard, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type PaymentState = "idle" | "processing" | "initiated" | "success" | "error";

interface PaymentItem {
  id: string;
  name: string;
  price: string | number;
  unit?: string;
  quantity?: number;
}

interface PaymentDialogProps {
  isOpen: boolean;
  paymentState: PaymentState;
  item: PaymentItem;
  totalAmount: number;
  paymentId?: string;
  countdown?: number;
  onClose: () => void;
  onPaymentSuccess: () => void;
  onCompletePayment?: () => void; // Optional completion handler
  errorMessage?: string;
  // Optional additional info for display
  petName?: string;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  paymentState,
  item,
  totalAmount,
  paymentId,
  countdown = 3,
  onClose,
  onPaymentSuccess,
  onCompletePayment,
  errorMessage,
  petName,
}) => {
  const [localCountdown, setLocalCountdown] = useState(countdown);

  // Handle countdown for success state
  useEffect(() => {
    if (paymentState === "success") {
      setLocalCountdown(countdown);
      const countdownInterval = setInterval(() => {
        setLocalCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            onPaymentSuccess();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [paymentState, countdown, onPaymentSuccess]);

  // Get content based on payment state
  const getStepContent = () => {
    switch (paymentState) {
      case "idle":
        return {
          title: "Ready to Pay",
          description: "Click to initiate payment",
          icon: <CreditCard className="w-6 h-6 text-blue-600" />,
          color: "blue"
        };
      
      case "processing":
        return {
          title: "Processing Payment",
          description: "We are processing your payment, please wait...",
          icon: <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />,
          color: "orange"
        };
      
      case "initiated":
        return {
          title: "Payment Initiated",
          description: "Click 'Complete Payment' to finish the transaction",
          icon: <CreditCard className="w-6 h-6 text-blue-600" />,
          color: "blue"
        };
      
      case "success":
        return {
          title: "Payment Successful!",
          description: `Redirecting in ${localCountdown} seconds...`,
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          color: "green"
        };
      
      case "error":
        return {
          title: "Payment Failed",
          description: errorMessage || "There was an issue processing your payment",
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

  if (!isOpen) return null;

  const stepContent = getStepContent();
  const canClose = paymentState !== "processing";

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" 
      onClick={canClose ? onClose : undefined}
    >
      <Card 
        className="w-full max-w-md mx-4 border-0 shadow-2xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader className="text-center relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          {canClose && (
            <Button
              onClick={onClose}
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
                <span className="text-gray-600 font-medium">Item:</span>
                <span className="font-semibold text-gray-900">{item.name}</span>
              </div>
              
              {item.quantity && (
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Quantity:</span>
                  <span className="font-semibold text-gray-900">{item.quantity} {item.unit || 'units'}</span>
                </div>
              )}
              
              {item.quantity && (
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Unit Price:</span>
                  <span className="font-semibold text-gray-900">₹{parseFloat(item.price.toString()).toFixed(2)}</span>
                </div>
              )}

              {petName && (
                <div className="flex justify-between items-center p-2 bg-white rounded-lg">
                  <span className="text-gray-600 font-medium">Pet:</span>
                  <span className="font-semibold text-gray-900">{petName}</span>
                </div>
              )}
              
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

          {/* Progress Indicator */}
          {paymentState === "processing" && (
            <div className="flex items-center justify-center">
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Payment Method Info */}
          <div className="text-center pt-4 border-t">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <CreditCard className="w-4 h-4" />
              <span>Secure payment powered by Razorpay</span>
            </div>
          </div>

          {/* Initiated State Actions */}
          {paymentState === "initiated" && onCompletePayment && (
            <div className="flex gap-2">
              <Button 
                onClick={onClose}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                Cancel
              </Button>
              <Button 
                onClick={onCompletePayment}
                className="flex-1 bg-green-600 hover:bg-green-700"
                size="sm"
              >
                Complete Payment
              </Button>
            </div>
          )}

          {/* Success Actions */}
          {paymentState === "success" && (
            <div className="flex gap-2">
              <Button 
                onClick={onPaymentSuccess}
                className="flex-1"
                size="sm"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Error Actions */}
          {paymentState === "error" && (
            <div className="flex gap-2">
              <Button 
                onClick={onClose}
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

export default PaymentDialog;
