import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { handleApiError } from "@/types/errors";

/**
 * Order interfaces
 */
export interface ProductOrder {
  id: string;
  userId: string;
  productId: string;
  paymentId: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  status: "purchased" | "shipped" | "delivered" | "cancelled";
  deliveryAddress: string | null;
  deliveryDate: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  userProductItem: {
    id: string;
    name: string;
    sku: string;
    price: string;
    images: string[];
  };
  userProductPayment: {
    id: string;
    amount: string;
    status: "pending" | "completed" | "failed";
    method: string;
    createdAt: string;
  };
}

export interface PackageOrder {
  id: string;
  userId: string;
  packageId: string;
  paymentId: string;
  status: "active" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  featuresUsed: string[];
  createdAt: string;
  updatedAt: string;
  userPackageItem: {
    id: string;
    name: string;
    description: string;
    price: string;
    duration: number;
  };
  userPackagePayment: {
    id: string;
    amount: string;
    status: "pending" | "completed" | "failed";
    method: string;
    createdAt: string;
  };
}

export interface UserOrdersResponse {
  orders: (ProductOrder | PackageOrder)[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SeparatedOrders {
  productOrders: ProductOrder[];
  packageOrders: PackageOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Get user orders
 * @param userId - User ID (if not provided, gets current user's orders)
 * @param page - Page number for pagination
 * @param limit - Number of orders per page
 * @returns Promise<SeparatedOrders>
 */
export const getUserOrders = async (
  userId?: string,
  page: number = 1,
  limit: number = 10
): Promise<SeparatedOrders> => {
  try {
    console.log("📦 Fetching user orders...", { userId, page, limit });
    
    // Build endpoint - if userId is provided, use it, otherwise get current user's orders
    const endpoint = '/user/orders';
    const params = new URLSearchParams();
    if (page > 1) params.append('page', page.toString());
    if (limit !== 10) params.append('limit', limit.toString());
    
    const queryString = params.toString();
    const url = `${endpoint}${queryString ? `?${queryString}` : ''}`;
    
    const response = await axiosInstance.get(url);
    console.log("✅ Orders fetched successfully:", response.data);
    
    const data = response.data.data as UserOrdersResponse;
    
    // Separate product orders and package orders
    const productOrders: ProductOrder[] = [];
    const packageOrders: PackageOrder[] = [];
    
    data.orders.forEach((order: ProductOrder | PackageOrder) => {
      if ('productId' in order && 'userProductItem' in order) {
        // This is a product order
        productOrders.push(order as ProductOrder);
      } else if ('packageId' in order && 'userPackageItem' in order) {
        // This is a package order
        packageOrders.push(order as PackageOrder);
      }
    });
    
    console.log("📦 Orders separated:", {
      productOrders: productOrders.length,
      packageOrders: packageOrders.length,
      total: data.total
    });
    
    return {
      productOrders,
      packageOrders,
      total: data.total,
      page: data.page,
      limit: data.limit,
      totalPages: data.totalPages
    };
    
  } catch (error: unknown) {
    console.error("❌ Failed to fetch orders:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get specific order details
 * @param orderId - Order ID
 * @returns Promise<ProductOrder | PackageOrder>
 */
export const getOrderById = async (orderId: string): Promise<ProductOrder | PackageOrder> => {
  try {
    console.log(`📦 Fetching order details for ID: ${orderId}`);
    
    const response = await axiosInstance.get(`/user/orders/${orderId}`);
    console.log("✅ Order details fetched:", response.data);
    
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch order details:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Helper function to check if order is a product order
 */
export const isProductOrder = (order: ProductOrder | PackageOrder): order is ProductOrder => {
  return 'productId' in order && 'userProductItem' in order;
};

/**
 * Helper function to check if order is a package order
 */
export const isPackageOrder = (order: ProductOrder | PackageOrder): order is PackageOrder => {
  return 'packageId' in order && 'package' in order;
};

/**
 * Get order status display
 */
export const getOrderStatusDisplay = (status: string) => {
  switch (status) {
    case "purchased":
      return {
        color: "bg-blue-100 text-blue-800",
        label: "Purchased"
      };
    case "shipped":
      return {
        color: "bg-yellow-100 text-yellow-800",
        label: "Shipped"
      };
    case "delivered":
      return {
        color: "bg-green-100 text-green-800",
        label: "Delivered"
      };
    case "active":
      return {
        color: "bg-green-100 text-green-800",
        label: "Active"
      };
    case "expired":
      return {
        color: "bg-red-100 text-red-800",
        label: "Expired"
      };
    case "cancelled":
      return {
        color: "bg-gray-100 text-gray-800",
        label: "Cancelled"
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        label: "Unknown"
      };
  }
};

/**
 * Get payment status display
 */
export const getPaymentStatusDisplay = (status: string) => {
  switch (status) {
    case "completed":
      return {
        color: "bg-green-100 text-green-800",
        label: "Paid"
      };
    case "pending":
      return {
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending"
      };
    case "failed":
      return {
        color: "bg-red-100 text-red-800",
        label: "Failed"
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800",
        label: "Unknown"
      };
  }
};
