import axiosInstance from "@/utils/axiosInstance";
import { toast } from "react-toastify";

// 1. Create Pet
export const createPet = async (payload: {
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string; 
  weight: number;
  color: string;
  profilePicture?: string;
}) => {
  console.log("[createPet] Payload:", payload);
  try {
    const res = await axiosInstance.post("/pets", payload);
    console.log("[createPet] API response:", res.data);
    return res.data.data; // assuming { success, message, data: pet }
  } catch (err: any) {
    console.error("[createPet] Error:", err);
    toast.error(
      err?.response?.data?.message || "Failed to create pet. Please try again."
    );
    throw err;
  }
};

// 2. Add Medical Record
export const addMedicalRecord = async (
  petId: string,
  payload: {
    type: string;
    title: string;
    description: string;
    date: string;
    veterinarian: string;
    clinic: string;
    diagnosis: string;
    treatment: string;
    medications: string[];
    attachments?: string[];
    notes?: string;
  }
) => {
  try {
    const res = await axiosInstance.post(`/pets/${petId}/medical-records`, payload);
    return res.data.data; // updated pet object
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Failed to add medical record."
    );
    throw err;
  }
};

// 3. Add Vaccination Record
export const addVaccinationRecord = async (
  petId: string,
  payload: {
    name: string;
    description: string;
    scheduledDate: string;
    veterinarian: string;
    clinic: string;
    notes?: string;
  }
) => {
  try {
    const res = await axiosInstance.post(`/pets/${petId}/vaccinations`, payload);
    return res.data.data; // updated pet object
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Failed to add vaccination record."
    );
    throw err;
  }
};

// 4. Fetch All Pets
export const fetchPets = async () => {
  try {
    const res = await axiosInstance.get("/pets");
    return res.data.data; // { pets: [...], pagination: {...} }
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Failed to fetch pets."
    );
    throw err;
  }
};

// 5. Fetch Pet By ID
export async function fetchPetById(id: string) {
  const response = await axiosInstance.get(`/pets/${id}`);
  return response.data;
}
 
