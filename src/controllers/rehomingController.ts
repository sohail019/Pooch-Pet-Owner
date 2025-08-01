import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";
import { handleApiError } from "@/types/errors";

/**
 * Rehoming and Adoption interfaces
 */
export interface RehomingPet {
  id: string;
  ownerId: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: number;
  description: string;
  imageUrls: string[];
  adoptionType: "free" | "paid";
  price?: number;
  isVerified: boolean;
  isAdopted: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface AdoptionRequest {
  id: string;
  petId: string;
  adopterId: string;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
  pet?: RehomingPet;
  adopter?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface RehomingFilters {
  species?: "dog" | "cat";
  adoptionType?: "free" | "paid";
  minAge?: number;
  maxAge?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateRehomingPayload {
  name: string;
  species: "dog" | "cat";
  breed: string;
  age: number;
  description: string;
  imageUrls: string[];
  adoptionType: "free" | "paid";
  price?: number;
}

export interface UpdateRehomingPayload {
  name?: string;
  species?: "dog" | "cat";
  breed?: string;
  age?: number;
  description?: string;
  imageUrls?: string[];
  adoptionType?: "free" | "paid";
  price?: number;
}

export interface CreateAdoptionRequestPayload {
  message?: string;
}

export interface UpdateAdoptionRequestStatusPayload {
  status: "accepted" | "rejected";
}

/**
 * Get available pets for rehoming (Public)
 * @param filters - Optional filters for the search
 * @returns Promise<{ pets: RehomingPet[], total: number, page: number, limit: number, totalPages: number }>
 */
export const getRehomingPets = async (filters: RehomingFilters = {}): Promise<{
  pets: RehomingPet[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> => {
  try {
    console.log("🏠 Fetching rehoming pets with filters:", filters);
    
    // Create request data with proper types
    const requestData: Record<string, string | number> = {};
    
    if (filters.species) requestData.species = filters.species;
    if (filters.adoptionType) requestData.adoptionType = filters.adoptionType;
    if (filters.minAge !== undefined) requestData.minAge = filters.minAge;
    if (filters.maxAge !== undefined) requestData.maxAge = filters.maxAge;
    if (filters.minPrice !== undefined) requestData.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) requestData.maxPrice = filters.maxPrice;
    if (filters.search) requestData.search = filters.search;
    
    // Always include page and limit as numbers
    requestData.page = filters.page || 1;
    requestData.limit = filters.limit || 12;
    
    const response = await axiosInstance.get('/rehoming', { params: requestData });
    console.log("✅ Rehoming pets fetched successfully:", response.data);
    
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch rehoming pets:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get specific pet details for rehoming (Public)
 * @param petId - Pet ID
 * @returns Promise<RehomingPet>
 */
export const getRehomingPetById = async (petId: string): Promise<RehomingPet> => {
  try {
    console.log(`🏠 Fetching rehoming pet details for ID: ${petId}`);
    
    const response = await axiosInstance.get(`/rehoming/${petId}`);
    console.log("✅ Rehoming pet details fetched:", response.data);
    
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch rehoming pet details:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Create a new rehoming listing (Pet Owner)
 * @param payload - Pet details for rehoming
 * @returns Promise<RehomingPet>
 */
export const createRehomingListing = async (payload: CreateRehomingPayload): Promise<RehomingPet> => {
  try {
    console.log("🏠 Creating rehoming listing:", payload);
    
    const response = await axiosInstance.post('/rehoming', payload);
    console.log("✅ Rehoming listing created successfully:", response.data);
    
    toast.success("Pet listed for adoption successfully!");
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to create rehoming listing:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Update rehoming pet details (Pet Owner)
 * @param petId - Pet ID
 * @param payload - Updated pet details
 * @returns Promise<RehomingPet>
 */
export const updateRehomingPet = async (petId: string, payload: UpdateRehomingPayload): Promise<RehomingPet> => {
  try {
    console.log(`🏠 Updating rehoming pet ${petId}:`, payload);
    
    const response = await axiosInstance.put(`/rehoming/${petId}`, payload);
    console.log("✅ Rehoming pet updated successfully:", response.data);
    
    toast.success("Pet details updated successfully!");
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to update rehoming pet:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Delete rehoming pet listing (Pet Owner)
 * @param petId - Pet ID
 * @returns Promise<void>
 */
export const deleteRehomingPet = async (petId: string): Promise<void> => {
  try {
    console.log(`🏠 Deleting rehoming pet: ${petId}`);
    
    await axiosInstance.delete(`/rehoming/${petId}`);
    console.log("✅ Rehoming pet deleted successfully");
    
    toast.success("Pet removed from adoption listing");
  } catch (error: unknown) {
    console.error("❌ Failed to delete rehoming pet:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Create adoption request for a pet (Pet Owner)
 * @param petId - Pet ID
 * @param payload - Adoption request details
 * @returns Promise<AdoptionRequest>
 */
export const createAdoptionRequest = async (petId: string, payload: CreateAdoptionRequestPayload): Promise<AdoptionRequest> => {
  try {
    console.log(`🏠 Creating adoption request for pet ${petId}:`, payload);
    
    const response = await axiosInstance.post(`/rehoming/${petId}/request`, payload);
    console.log("✅ Adoption request created successfully:", response.data);
    
    toast.success("Adoption request created successfully!");
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to create adoption request:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Get my adoption requests (Pet Owner)
 * @returns Promise<AdoptionRequest[]>
 */
export const getMyAdoptionRequests = async (): Promise<AdoptionRequest[]> => {
  try {
    console.log("🏠 Fetching my adoption requests...");
    
    const response = await axiosInstance.get('/rehoming/adoption-requests');
    console.log("✅ My adoption requests fetched successfully:", response.data);
    
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch my adoption requests:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get my rehoming pets (Pet Owner)
 * @returns Promise<RehomingPet[]>
 */
export const getMyRehomingPets = async (): Promise<RehomingPet[]> => {
  try {
    console.log("🏠 Fetching my rehoming pets...");
    
    const response = await axiosInstance.get('/rehoming/mine');
    console.log("✅ My rehoming pets fetched successfully:", response.data);
    
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch my rehoming pets:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Get adoption requests for a specific pet (Pet Owner)
 * @param petId - Pet ID
 * @returns Promise<AdoptionRequest[]>
 */
export const getAdoptionRequestsForPet = async (petId: string): Promise<AdoptionRequest[]> => {
  try {
    console.log(`🏠 Fetching adoption requests for pet: ${petId}`);
    
    const response = await axiosInstance.get(`/rehoming/${petId}/requests`);
    console.log("✅ Adoption requests for pet fetched successfully:", response.data);
    
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to fetch adoption requests for pet:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

/**
 * Update adoption request status (Pet Owner)
 * @param requestId - Adoption request ID
 * @param payload - Status update
 * @returns Promise<AdoptionRequest>
 */
export const updateAdoptionRequestStatus = async (
  requestId: string, 
  payload: UpdateAdoptionRequestStatusPayload
): Promise<AdoptionRequest> => {
  try {
    console.log(`🏠 Updating adoption request ${requestId} status:`, payload);
    
    const response = await axiosInstance.put(`/rehoming/adoption-request/${requestId}/status`, payload);
    console.log("✅ Adoption request status updated successfully:", response.data);
    
    toast.success(`Adoption request ${payload.status} successfully!`);
    return response.data.data;
  } catch (error: unknown) {
    console.error("❌ Failed to update adoption request status:", error);
    const errorMessage = handleApiError(error);
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
};

/**
 * Helper function to get adoption status display
 * @param status - Adoption request status
 * @returns Display configuration for badges
 */
export const getAdoptionStatusDisplay = (status: AdoptionRequest["status"]) => {
  switch (status) {
    case "pending":
      return {
        label: "Pending",
        color: "bg-yellow-900 text-yellow-300"
      };
    case "accepted":
      return {
        label: "Accepted",
        color: "bg-green-900 text-green-300"
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "bg-red-900 text-red-300"
      };
    default:
      return {
        label: "Unknown",
        color: "bg-gray-700 text-gray-300"
      };
  }
};
