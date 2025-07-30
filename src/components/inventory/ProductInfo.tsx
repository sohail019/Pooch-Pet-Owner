import React from "react";
import { Package, Award, BarChart3, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InventoryItem } from "@/controllers/inventoryController";

interface ProductInfoProps {
  product: InventoryItem;
  quantity: number;
  totalPrice: number;
  originalPrice: number;
  savings: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({ 
  product, 
  quantity, 
  totalPrice, 
  originalPrice, 
  savings 
}) => {
  const hasDiscount = savings > 0;
  const discountPercentage = hasDiscount 
    ? Math.round((savings / originalPrice) * 100) 
    : 0;

  return (
    <div className="space-y-6">
      {/* Price Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">
                ₹{parseFloat(product.salePrice).toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{parseFloat(product.price).toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold">
                    {discountPercentage}% OFF
                  </Badge>
                </>
              )}
            </div>
            
            <div className="text-sm text-gray-600 font-medium">
              Per {product.unit} • {product.weight} {product.unit}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <Package className="w-5 h-5 text-gray-500" />
              <span className="text-sm">
                {product.quantity > 0 ? (
                  <span className="text-green-600 font-semibold">
                    ✅ In Stock: {product.quantity} units available
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">❌ Out of Stock</span>
                )}
              </span>
            </div>

            {/* Total for selected quantity */}
            {quantity > 1 && (
              <div className="pt-3 border-t border-white/50">
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                  <span className="text-sm text-gray-700 font-medium">
                    Total for {quantity} units:
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-gray-900">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                    {savings > 0 && (
                      <div className="text-sm text-green-600 font-semibold">
                        💰 Save ₹{savings.toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <Card className="border-1 border-gray-200 shadow-md">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Tag className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-white">Popular Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Details */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-white">Product Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          <p className="text-gray-200 text-sm leading-relaxed  p-4 rounded-lg">
            {product.description}
          </p>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="text-xs text-gray-500 mb-1 font-medium">Category</div>
              <div className="text-sm font-semibold text-gray-800">{product.category}</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
              <div className="text-xs text-gray-500 mb-1 font-medium">Subcategory</div>
              <div className="text-sm font-semibold text-gray-800">{product.subcategory}</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="text-xs text-blue-600 mb-1 font-medium">Brand</div>
              <div className="text-sm font-semibold text-blue-800">{product.brand}</div>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="text-xs text-purple-600 mb-1 font-medium">SKU</div>
              <div className="text-sm font-semibold font-mono text-purple-800">{product.sku}</div>
            </div>
          </div>

          {/* Physical Properties */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-200">Specifications</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Weight:</span>
                <span className="ml-2 font-medium">{product.weight}</span>
              </div>
              <div>
                <span className="text-gray-500">Dimensions:</span>
                <span className="ml-2 font-medium">{product.dimensions}</span>
              </div>
              <div>
                <span className="text-gray-500">Unit:</span>
                <span className="ml-2 font-medium">{product.unit}</span>
              </div>
              <div>
                <span className="text-gray-500">Barcode:</span>
                <span className="ml-2 font-medium font-mono">{product.barcode}</span>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="pt-3 border-t">
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-200">Customer Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-sm ${
                      star <= Math.floor(parseFloat(product.rating))
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {parseFloat(product.rating).toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductInfo;
