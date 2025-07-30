import { useState } from "react";
import { toast } from "react-toastify";
import { PaymentState } from "@/components/common/PaymentDialog";

interface PaymentHookProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface PaymentResponse {
  id: string;
  packageId?: string;
  productId?: string;
  userId?: string;
  petId?: string;
  amount?: number;
  currency?: string;
  method?: string;
  status?: string;
}

interface PaymentPayload {
  packageId?: string;
  productId?: string;
  petId?: string;
  quantity?: number;
  amount: number;
  currency: string;
  method: string;
  deliveryAddress?: string;
}

interface PaymentCompletion {
  paymentId: string;
  status: "completed" | "failed";
  gatewayPaymentId?: string;
  gatewaySignature?: string;
  transactionId?: string;
  gatewayResponse?: {
    gateway: string;
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
}

export const usePayment = ({ onSuccess, onError }: PaymentHookProps) => {
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [paymentId, setPaymentId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const processPayment = async (
    initiatePayment: (payload: any) => Promise<any>,
    completePayment: (paymentId: string, payload: PaymentCompletion) => Promise<any>,
    paymentPayload: any
  ) => {
    try {
      // Step 1: Initiate payment
      setPaymentState("processing");
      setErrorMessage("");
      
      console.log("💳 Initiating payment with payload:", paymentPayload);
      const paymentResponse = await initiatePayment(paymentPayload);
      console.log("✅ Payment initiated:", paymentResponse);
      
      // Validate that we received a valid payment ID
      if (!paymentResponse.id) {
        throw new Error("Failed to get payment ID from response");
      }

      setPaymentId(paymentResponse.id);
      toast.success("Payment initiated successfully!");

      // Step 2: Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 3: Complete payment
      const completionPayload: PaymentCompletion = {
        paymentId: paymentResponse.id,
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
      const completedPayment = await completePayment(paymentResponse.id, completionPayload);
      
      console.log("✅ Payment completed:", completedPayment);
      toast.success("Payment completed successfully!");
      setPaymentState("success");

      // Auto-redirect after showing success for a moment
      setTimeout(() => {
        onSuccess();
      }, 3000);

    } catch (err) {
      console.error("❌ Payment failed:", err);
      const errorMsg = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setErrorMessage(errorMsg);
      setPaymentState("error");
      onError(errorMsg);
    }
  };

  const resetPayment = () => {
    setPaymentState("idle");
    setPaymentId("");
    setErrorMessage("");
  };

  return {
    paymentState,
    paymentId,
    errorMessage,
    processPayment,
    resetPayment
  };
};

export default usePayment;
