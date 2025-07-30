import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export const handleApiError = (error: unknown): string => {
  if (error instanceof AxiosError) {
    // Try to extract detailed error message from response
    const errorData = error.response?.data;
    
    if (errorData?.message) {
      return errorData.message;
    }
    
    if (errorData?.error) {
      return errorData.error;
    }
    
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      return errorData.errors.join(", ");
    }
    
    // Fallback to status text or generic message
    return error.response?.statusText || error.message || "An error occurred";
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred";
};

export const isAxiosError = (error: unknown): error is AxiosError => {
  return error instanceof AxiosError;
};
