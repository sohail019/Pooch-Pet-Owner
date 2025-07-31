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
            className="min-w-[220px] max-w-xs flex-shrink-0 cursor-pointer hover:shadow-lg transition-shadow border border-gray-200  rounded-xl"
            onClick={() => handleInventoryClick(item.id)}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
            >
            <CardContent className="p-4 flex flex-col items-center relative">
              {/* Featured badge */}
              {item.isFeatured && (
              <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-bold px-2 py-0.5 rounded shadow text-white z-10">
                Featured
              </span>
              )}
              {/* Product image */}
              <div className="w-20 h-20 mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
              <img
                src={item.images?.[0] || "https://via.placeholder.com/80x80/e5e7eb/6b7280?text=No+Image"}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== "https://via.placeholder.com/80x80/e5e7eb/6b7280?text=No+Image") {
                  target.src = "https://via.placeholder.com/80x80/e5e7eb/6b7280?text=No+Image";
                }
                }}
              />
              </div>
              {/* Product name */}
              <div className="font-semibold text-base mb-1 text-center line-clamp-2 text-white">
              {item.name}
              </div>
              {/* Brand and category */}
              <div className="text-xs text-gray-200 mb-1 flex gap-2 items-center">
              <span>{item.brand}</span>
              <span className="mx-1">•</span>
              <span>{item.category}</span>
              </div>
              {/* Rating */}
              <div className="flex items-center gap-1 mb-2">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-xs text-gray-500 font-medium">{parseFloat(item.rating).toFixed(1)}</span>
              <span className="text-xs text-gray-400">({item.reviewCount})</span>
              </div>
              {/* Price */}
              <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-green-600">
                ₹{parseFloat(item.salePrice).toFixed(2)}
              </span>
              {parseFloat(item.price) > parseFloat(item.salePrice) && (
                <span className="text-xs text-gray-400 line-through">
                ₹{parseFloat(item.price).toFixed(2)}
                </span>
              )}
              </div>
              {/* Stock */}
              <div className={`text-xs font-medium mb-1 ${item.quantity > item.minStockLevel ? "text-gray-600" : "text-red-500"}`}>
              Stock: {item.quantity} {item.unit}
              </div>
              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-2">
              {item.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">
                {tag}
                </span>
              ))}
              </div>
            </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default InventoriesList;
