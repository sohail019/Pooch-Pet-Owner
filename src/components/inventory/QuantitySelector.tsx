import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  disabled?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  maxQuantity,
  onQuantityChange,
  disabled = false
}) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= maxQuantity) {
      onQuantityChange(value);
    }
  };

  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-white mb-2">Quantity</h3>
            <p className="text-sm text-gray-400 font-medium">
              {maxQuantity > 0 ? (
                <span className="flex items-center gap-1 ">
                  📦 <span>{maxQuantity} units available</span>
                </span>
              ) : (
                <span className="text-red-600 font-semibold">❌ Out of stock</span>
              )}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDecrease}
              disabled={quantity <= 1 || disabled}
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-900 text-white shadow hover:scale-105 transition-transform"
              aria-label="Decrease quantity"
            >
              <Minus className="w-5 h-5" />
            </Button>
            <div className="relative mx-2">
              <input
                type="number"
                value={quantity}
                onChange={handleInputChange}
                disabled={disabled || maxQuantity === 0}
                min={1}
                max={maxQuantity}
                className="w-14 h-9 text-center text-lg font-bold bg-gray-800 text-white border-2 border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                aria-label="Quantity"
              />
            </div>
            <Button
              onClick={handleIncrease}
              disabled={quantity >= maxQuantity || disabled}
              variant="ghost"
              size="icon"
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-700 to-blue-900 text-white shadow hover:scale-105 transition-transform"
              aria-label="Increase quantity"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Quantity Warning */}
        {maxQuantity > 0 && maxQuantity <= 10 && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs text-orange-700">
              ⚠️ Only {maxQuantity} units left in stock. Order soon!
            </p>
          </div>
        )}
        
        {maxQuantity === 0 && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-700">
              🚫 This item is currently out of stock
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuantitySelector;
