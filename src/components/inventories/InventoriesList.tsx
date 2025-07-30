import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

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

interface InventoriesListProps {
  inventories: InventoryItem[];
}

const InventoriesList: React.FC<InventoriesListProps> = ({ inventories }) => {
  const navigate = useNavigate();
  
  if (!inventories.length) return null;

  const handleInventoryClick = (inventoryId: string) => {
    navigate(`/inventory/${inventoryId}`);
  };
  
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Products</h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {inventories.map((item) => (
          <Card 
            key={item.id} 
            className="min-w-[180px] max-w-xs flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleInventoryClick(item.id)}
          >
            <CardContent className="p-4 flex flex-col items-center">
              <img
                src={item.images?.[0] || "https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded mb-2 border"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== "https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image") {
                    target.src = "https://via.placeholder.com/64x64/e5e7eb/6b7280?text=No+Image";
                  }
                }}
              />
              <div className="font-semibold text-base mb-1 text-center line-clamp-2">
                {item.name}
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {item.brand}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                Stock: {item.quantity} {item.unit}
              </div>
              <div className="text-sm font-medium text-green-600">
                ₹{parseFloat(item.salePrice).toFixed(2)}
              </div>
              {parseFloat(item.price) > parseFloat(item.salePrice) && (
                <div className="text-xs text-gray-500 line-through">
                  ₹{parseFloat(item.price).toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default InventoriesList;
