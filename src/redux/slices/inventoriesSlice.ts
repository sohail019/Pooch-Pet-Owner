import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InventoryItem {
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

interface InventoriesState {
  inventories: InventoryItem[];
}

const initialState: InventoriesState = {
  inventories: [],
};

const inventoriesSlice = createSlice({
  name: "inventories",
  initialState,
  reducers: {
    setInventories(state, action: PayloadAction<InventoryItem[]>) {
      state.inventories = action.payload;
    },
    clearInventories(state) {
      state.inventories = [];
    },
  },
});

export type { InventoryItem };
export const { setInventories, clearInventories } = inventoriesSlice.actions;
export default inventoriesSlice.reducer;
