import axiosInstance from "@/utils/axiosInstance";

// Types for Vet API responses
export interface Vet {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  licenseNumber: string;
  profilePicture: string;
  bio: string;
  consultationTypes?: ("telemedicine" | "in_clinic")[];
  isVerified: boolean;
  isActive: boolean;
  kycStatus: string;
  rating: number | string; // API returns string, but we expect number
  totalReviews: number;
  createdAt: string;
  updatedAt?: string;
}

export interface VetAvailability {
  id: string;
  vetId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  consultationType: "telemedicine" | "in_clinic";
  isAvailable: boolean;
  maxBookings: number;
  consultationDuration: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookAppointmentPayload {
  petId: string;
  appointmentDate: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  consultationType: "telemedicine" | "in_clinic";
  reason: string; // minimum 10 characters
  notes?: string;
}

export interface AppointmentBooking {
  id: string;
  vetId: string;
  userId: string;
  petId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  consultationType: "telemedicine" | "in_clinic";
  reason: string;
  notes?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  vet: {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialization: string[];
  };
  pet: {
    id: string;
    name: string;
    species: string;
    breed: string;
    dateOfBirth: string;
    gender: string;
    weight: number;
    color: string;
  };
}

export interface VetApiResponse {
  success: boolean;
  data: {
    vets: Vet[];
    total: number;
    limit: number;
    offset: number;
    totalPages: number;
  };
  message?: string;
}

export interface VetAvailabilityApiResponse {
  success: boolean;
  data: VetAvailability[];
  message?: string;
}

export interface BookAppointmentApiResponse {
  success: boolean;
  message: string;
  data: AppointmentBooking;
}

// Get all vets
export const getAllVets = async (): Promise<Vet[]> => {
  try {
    console.log("🏥 Fetching all vets...");
    const response = await axiosInstance.get<VetApiResponse>("/vets");
    
    console.log("✅ Vets API response:", response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch vets");
    }
    
    // Access the vets array from the nested data structure
    const vetsData = response.data.data.vets;
    return Array.isArray(vetsData) ? vetsData : [];
  } catch (error) {
    console.error("❌ Error fetching vets:", error);
    throw error;
  }
};

// Get vet availability
export const getVetAvailability = async (vetId: string): Promise<VetAvailability[]> => {
  try {
    console.log(`🏥 Fetching availability for vet: ${vetId}`);
    const response = await axiosInstance.get<VetAvailabilityApiResponse>(
      `/vets/${vetId}/availability`
    );
    
    console.log("✅ Vet availability API response:", response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch vet availability");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("❌ Error fetching vet availability:", error);
    throw error;
  }
};

// Book appointment
export const bookAppointment = async (
  vetId: string, 
  payload: BookAppointmentPayload
): Promise<AppointmentBooking> => {
  try {
    console.log(`🏥 Booking appointment with vet: ${vetId}`, payload);
    const response = await axiosInstance.post<BookAppointmentApiResponse>(
      `/vets/${vetId}/book`,
      payload
    );
    
    console.log("✅ Appointment booking API response:", response.data);
    
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to book appointment");
    }
    
    return response.data.data;
  } catch (error) {
    console.error("❌ Error booking appointment:", error);
    throw error;
  }
};
