import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { handleApiError } from "@/types/errors";
import { AxiosError } from "axios";

/**
 * Inventory interfaces
 */
export interface InventoryItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  sku: string;
  barcode: string;
  price: string; // API returns as string
  costPrice: string;
  salePrice: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  unit: string;
  weight: string;
  dimensions: string;
  images: string[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  vendor?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    gstNumber: string;
    panNumber: string;
    profilePicture: string;
    isVerified: boolean;
    isActive: boolean;
    kycStatus: string;
    canManagePackages: boolean;
    canManageInventory: boolean;
    rating: string;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface InventoryPaymentPayload {
  inventoryId: string;
  quantity: number;
  amount: number;
  currency: string;
  method: "credit_card" | "debit_card" | "upi" | "net_banking" | "wallet";
  gatewayOrderId: string;
}

export interface InventoryPaymentResponse {
  paymentId: string;
  inventoryId: string;
  userId: string;
  quantity: number;
  amount: number;
  currency: string;
  method: string;
  status: "pending" | "completed" | "failed";
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  gatewaySignature: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  userInventoryItem?: {
    id: string;
    inventoryId: string;
    userId: string;
    quantity: number;
    purchaseDate: string;
    totalAmount: number;
    status: string;
    createdAt: string;
  };
}

export interface PaymentStatusPayload {
  paymentId: string;
  gatewayPaymentId: string;
  gatewaySignature: string;
  status: "completed" | "failed";
}

export interface UserInventoryItem {
  id: string;
  inventoryId: string;
  userId: string;
  quantity: number;
  purchaseDate: string;
  totalAmount: number;
  status: "active" | "used" | "expired";
  inventory: InventoryItem;
}

/**
 * Get all available inventory items
 * @returns Promise<InventoryItem[]>
 */
export const getAllInventory = async (): Promise<InventoryItem[]> => {
  try {
    console.log("📦 Fetching all inventory items...");
    const response = await axiosInstance.get("/inventory/products");
    console.log("✅ Inventory items fetched successfully:", response.data);
    
    // Handle the nested structure: data.products instead of just data
    const products = response.data?.data?.products || response.data?.data || [];
    console.log("📦 Extracted products:", products);
    
    return products;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch inventory items:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getAllInventory instead
 */
export const getInventories = async () => {
  try {
    const res = await axiosInstance.get("/inventory/products");
    // Handle the nested structure: data.products instead of just data
    return res.data?.data?.products || res.data?.data || [];
  } catch (err: unknown) {
    const errorMessage = handleApiError(err);
    toast.error(errorMessage);
    throw err;
  }
};

/**
 * Get inventory item by ID
 * @param inventoryId - Inventory item ID
 * @returns Promise<InventoryItem>
 */
export const getInventoryById = async (inventoryId: string): Promise<InventoryItem> => {
  try {
    console.log(`📦 Fetching inventory item with ID: ${inventoryId}`);
    const response = await axiosInstance.get(`/inventory/products/${inventoryId}`);
    console.log("✅ Inventory item fetched successfully:", response.data);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch inventory item:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Initiate payment for an inventory item
 * @param payload - Inventory payment payload
 * @returns Promise<InventoryPaymentResponse>
 */
export const initiateInventoryPayment = async (
  payload: InventoryPaymentPayload
): Promise<InventoryPaymentResponse> => {
  try {
    console.log("💳 Initiating inventory payment...", payload);
    const response = await axiosInstance.post("/payment/create", payload);
    console.log("✅ Inventory payment initiated successfully:", response.data);
    toast.success("Payment initiated successfully!");
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to initiate inventory payment:", error);
    
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
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Complete inventory payment
 * @param paymentId - Payment ID
 * @param payload - Payment completion payload
 * @returns Promise<InventoryPaymentResponse>
 */
export const completeInventoryPayment = async (
  paymentId: string,
  payload: PaymentStatusPayload
): Promise<InventoryPaymentResponse> => {
  try {
    console.log(`💳 Completing inventory payment: ${paymentId}`, payload);
    const response = await axiosInstance.patch(`/payment/${paymentId}/status`, payload);
    console.log("✅ Inventory payment completed successfully:", response.data);
    toast.success("Payment completed successfully!");
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to complete inventory payment:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get user's purchased inventory items
 * @returns Promise<UserInventoryItem[]>
 */
export const getUserInventoryItems = async (): Promise<UserInventoryItem[]> => {
  try {
    console.log("📦 Fetching user inventory items...");
    const response = await axiosInstance.get("/payment/user/inventory");
    console.log("✅ User inventory items fetched successfully:", response.data);
    return response.data.data || [];
  } catch (error: unknown) {
    console.error("❌ Failed to fetch user inventory items:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get featured inventory items (for homepage display)
 * @returns Promise<InventoryItem[]>
 */
export const getFeaturedInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    console.log("⭐ Fetching featured inventory items...");
    const allItems = await getAllInventory();
    const featuredItems = allItems.filter(item => item.isFeatured && item.isActive);
    console.log("✅ Featured inventory items filtered:", featuredItems.length);
    return featuredItems;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch featured inventory items:", error);
    return [];
  }
};

/**
 * Get inventory items by status
 * @param status - Inventory status
 * @returns Promise<InventoryItem[]>
 */
export const getInventoryByStatus = async (status: "active" | "inactive"): Promise<InventoryItem[]> => {
  try {
    console.log(`📦 Fetching ${status} inventory items...`);
    const allItems = await getAllInventory();
    const isActive = status === "active";
    const filteredItems = allItems.filter(item => item.isActive === isActive);
    console.log(`✅ ${status} inventory items filtered:`, filteredItems.length);
    return filteredItems;
  } catch (error: unknown) {
    console.error(`❌ Failed to fetch ${status} inventory items:`, error);
    return [];
  }
};

/**
 * Get inventory items by category
 * @param category - Inventory category
 * @returns Promise<InventoryItem[]>
 */
export const getInventoryByCategory = async (category: string): Promise<InventoryItem[]> => {
  try {
    console.log(`📦 Fetching ${category} inventory items...`);
    const allItems = await getAllInventory();
    const categoryItems = allItems.filter(item => 
      item.category.toLowerCase() === category.toLowerCase() && item.isActive
    );
    console.log(`✅ ${category} inventory items filtered:`, categoryItems.length);
    return categoryItems;
  } catch (error: unknown) {
    console.error(`❌ Failed to fetch ${category} inventory items:`, error);
    return [];
  }
};
