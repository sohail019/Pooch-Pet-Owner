import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { handleApiError } from "@/types/errors";
import { AxiosError } from "axios";

// TypeScript interfaces for packages
export interface Package {
  id: string;
  name: string;
  description: string;
  price: string; // Changed from number to string to match API response
  duration: number;
  features: string[];
  status: "active" | "inactive";
  createdBy: string;
  createdByType: "admin" | "vet";
  clinicId: string | null;
  isPopular: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPackage {
  id: string;
  packageId: string;
  userId: string;
  petId: string;
  status: "active" | "expired" | "pending";
  startDate: string;
  endDate: string;
  createdAt: string;
  package: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    features: string[];
    isPopular: boolean;
  };
  pet: {
    id: string;
    name: string;
    species: string;
    age: number;
  };
}

export interface PackagePaymentPayload {
  packageId: string;
  petId: string;
  amount: number;
  currency: string;
  method: "credit_card" | "debit_card" | "upi" | "net_banking" | "wallet";
  deliveryAddress?: string;
  transactionId?: string;
  gatewayResponse?: {
    gateway: string;
    paymentIntentId?: string;
    chargeId?: string;
    orderId?: string;
    paymentId?: string;
  };
}

export interface PaymentStatusPayload {
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
    errorCode?: string;
    errorMessage?: string;
  };
  failureReason?: string;
}

export interface PackagePaymentResponse {
  id: string;
  packageId: string;
  userId: string;
  petId: string;
  amount: number;
  currency: string;
  method: string;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  gatewayResponse?: {
    gateway: string;
    orderId?: string;
    paymentId?: string;
    signature?: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  userPackage?: {
    id: string;
    packageId: string;
    userId: string;
    petId: string;
    status: string;
    startDate: string;
    endDate: string;
    createdAt: string;
  };
}

/**
 * Get all available packages
 * @returns Promise<Package[]>
 */
export const getAllPackages = async (): Promise<Package[]> => {
  try {
    console.log("📦 Fetching all packages...");
    const response = await axiosInstance.get("/packages");
    console.log("✅ Packages fetched successfully:", response.data);
    
    // Handle the nested structure: data.packages instead of just data
    const packages = response.data?.data?.packages || response.data?.data || [];
    console.log("📦 Extracted packages:", packages);
    
    return packages;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch packages:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getAllPackages instead
 */
export const getPackages = async () => {
  try {
    const res = await axiosInstance.get("/packages");
    // Handle the nested structure: data.packages instead of just data
    return res.data?.data?.packages || res.data?.data || [];
  } catch (err: unknown) {
    const errorMessage = handleApiError(err);
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Get package by ID
 * @param packageId - Package ID
 * @returns Promise<Package>
 */
export const getPackageById = async (packageId: string): Promise<Package> => {
  try {
    console.log(`📦 Fetching package with ID: ${packageId}`);
    const response = await axiosInstance.get(`/packages/${packageId}`);
    console.log("✅ Package fetched successfully:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch package:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Initiate payment for a package
 * @param payload - Package payment payload
 * @returns Promise<PackagePaymentResponse>
 */
export const initiatePackagePayment = async (
  payload: PackagePaymentPayload
): Promise<PackagePaymentResponse> => {
  try {
    console.log("💳 Initiating package payment...", payload);
    const response = await axiosInstance.post("/payment/create", payload);
    console.log("✅ Package payment initiated successfully:", response.data);
    // Remove duplicate toast - let the component handle success messaging
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to initiate package payment:", error);
    
    // Enhanced error logging for debugging
    if (error instanceof AxiosError) {
      console.error("❌ Axios Error Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
    }
    
    const errorMessage = handleApiError(error);
    // Only throw error, let component handle error toast
    throw new Error(errorMessage);
  }
};

/**
 * Complete package payment via webhook
 * @param paymentId - Payment ID
 * @param payload - Payment completion payload
 * @returns Promise<PackagePaymentResponse>
 */
export const completePackagePayment = async (
  paymentId: string,
  payload: PaymentStatusPayload
): Promise<PackagePaymentResponse> => {
  try {
    // Validate paymentId
    if (!paymentId) {
      throw new Error("Payment ID is required to complete payment");
    }

    // Ensure paymentId is in the payload
    const completePayload = {
      ...payload,
      paymentId
    };

    console.log(`💳 Completing package payment via webhook: ${paymentId}`, completePayload);
    const response = await axiosInstance.post("/payment/webhook", completePayload);
    console.log("✅ Package payment completed successfully:", response.data);
    // Remove duplicate toast - let the component handle success messaging
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to complete package payment:", error);
    const errorMessage = handleApiError(error);
    // Only throw error, let component handle error toast
    throw new Error(errorMessage);
  }
};

/**
 * Get user's purchased packages
 * @returns Promise<UserPackage[]>
 */
export const getUserPackages = async (): Promise<UserPackage[]> => {
  try {
    console.log("📦 Fetching user packages...");
    const response = await axiosInstance.get("/payment/user/packages");
    console.log("✅ User packages fetched successfully:", response.data);
    return response.data.data || [];
  } catch (error: unknown) {
    console.error("❌ Failed to fetch user packages:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get featured packages (for homepage display)
 * @returns Promise<Package[]>
 */
export const getFeaturedPackages = async (): Promise<Package[]> => {
  try {
    console.log("⭐ Fetching featured packages...");
    const allPackages = await getAllPackages();
    const featuredPackages = allPackages.filter(pkg => pkg.isPopular && pkg.status === "active");
    console.log("✅ Featured packages filtered:", featuredPackages.length);
    return featuredPackages;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch featured packages:", error);
    return [];
  }
};

/**
 * Get packages by status
 * @param status - Package status
 * @returns Promise<Package[]>
 */
export const getPackagesByStatus = async (status: "active" | "inactive"): Promise<Package[]> => {
  try {
    console.log(`📦 Fetching ${status} packages...`);
    const allPackages = await getAllPackages();
    const filteredPackages = allPackages.filter(pkg => pkg.status === status);
    console.log(`✅ ${status} packages filtered:`, filteredPackages.length);
    return filteredPackages;
  } catch (error: unknown) {
    console.error(`❌ Failed to fetch ${status} packages:`, error);
    return [];
  }
};
