import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Package {
  id: string;
  name: string;
  description: string;
  price: string; // Changed to string to match API response
  duration?: number;
  features?: string[];
  status?: "active" | "inactive";
  createdBy?: string;
  createdByType?: "admin" | "vet";
  clinicId?: string | null;
  isPopular?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface PackagesState {
  packages: Package[];
}

const initialState: PackagesState = {
  packages: [],
};

const packagesSlice = createSlice({
  name: "packages",
  initialState,
  reducers: {
    setPackages(state, action: PayloadAction<Package[]>) {
      state.packages = action.payload;
    },
    clearPackages(state) {
      state.packages = [];
    },
  },
});

export type { Package };
export const { setPackages, clearPackages } = packagesSlice.actions;
export default packagesSlice.reducer;
