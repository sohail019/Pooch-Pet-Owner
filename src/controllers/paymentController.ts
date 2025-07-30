import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { handleApiError } from "@/types/errors";

/**
 * Payment interfaces
 */
export interface PaymentRecord {
  id: string;
  userId: string;
  itemType: "package" | "inventory";
  itemId: string;
  itemName: string;
  amount: number;
  quantity?: number;
  status: "pending" | "completed" | "failed" | "refunded";
  paymentMethod: "card" | "paypal" | "stripe";
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentSummary {
  totalSpent: number;
  totalTransactions: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
}

export interface PaymentFilters {
  status?: "pending" | "completed" | "failed" | "refunded";
  itemType?: "package" | "inventory";
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

/**
 * Get user's payment history
 * @param filters - Optional filters for payment records
 * @returns Promise<PaymentRecord[]>
 */
export const getUserPaymentHistory = async (filters?: PaymentFilters): Promise<PaymentRecord[]> => {
  try {
    console.log("💳 Fetching user payment history...", filters);
    
    // Build query parameters
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.itemType) params.append('itemType', filters.itemType);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());
    
    const queryString = params.toString();
    const url = `/payment/user/history${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosInstance.get(url);
    console.log("✅ Payment history fetched successfully:", response.data);
    return response.data.data || [];
  } catch (error: unknown) {
    console.error("❌ Failed to fetch payment history:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get user's payment summary
 * @returns Promise<PaymentSummary>
 */
export const getUserPaymentSummary = async (): Promise<PaymentSummary> => {
  try {
    console.log("📊 Fetching user payment summary...");
    const response = await axiosInstance.get("/payment/user/summary");
    console.log("✅ Payment summary fetched successfully:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch payment summary:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get payment record by ID
 * @param paymentId - Payment record ID
 * @returns Promise<PaymentRecord>
 */
export const getPaymentById = async (paymentId: string): Promise<PaymentRecord> => {
  try {
    console.log(`💳 Fetching payment record with ID: ${paymentId}`);
    const response = await axiosInstance.get(`/payment/${paymentId}`);
    console.log("✅ Payment record fetched successfully:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch payment record:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Request payment refund
 * @param paymentId - Payment record ID
 * @param reason - Refund reason
 * @returns Promise<PaymentRecord>
 */
export const requestPaymentRefund = async (
  paymentId: string, 
  reason: string
): Promise<PaymentRecord> => {
  try {
    console.log(`🔄 Requesting refund for payment: ${paymentId}`, { reason });
    const response = await axiosInstance.post(`/payment/${paymentId}/refund`, { reason });
    console.log("✅ Refund requested successfully:", response.data);
    toast.success("Refund request submitted successfully!");
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to request refund:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get recent payments (last 10)
 * @returns Promise<PaymentRecord[]>
 */
export const getRecentPayments = async (): Promise<PaymentRecord[]> => {
  try {
    console.log("🕒 Fetching recent payments...");
    const payments = await getUserPaymentHistory({ limit: 10 });
    console.log("✅ Recent payments fetched:", payments.length);
    return payments;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch recent payments:", error);
    return [];
  }
};

/**
 * Get payments by status
 * @param status - Payment status
 * @returns Promise<PaymentRecord[]>
 */
export const getPaymentsByStatus = async (
  status: "pending" | "completed" | "failed" | "refunded"
): Promise<PaymentRecord[]> => {
  try {
    console.log(`💳 Fetching ${status} payments...`);
    const payments = await getUserPaymentHistory({ status });
    console.log(`✅ ${status} payments fetched:`, payments.length);
    return payments;
  } catch (error: unknown) {
    console.error(`❌ Failed to fetch ${status} payments:`, error);
    return [];
  }
};
