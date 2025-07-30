import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProductImagesProps {
  images: string[];
  productName: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images, productName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState<{ [key: number]: boolean }>({});

  const validImages = images.filter((_, index) => !imageError[index]);
  const currentImage = validImages[currentImageIndex] || "https://via.placeholder.com/400x400/e5e7eb/6b7280?text=No+Image";

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : validImages.length - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => 
      prev < validImages.length - 1 ? prev + 1 : 0
    );
  };

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
    
    // If current image fails, move to next valid image
    if (index === currentImageIndex) {
      const nextValidIndex = images.findIndex((_, i) => i > index && !imageError[i]);
      if (nextValidIndex !== -1) {
        setCurrentImageIndex(nextValidIndex);
      } else {
        setCurrentImageIndex(0);
      }
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white">
      <CardContent className="p-0">
        {/* Main Image */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100">
          <img
            src={currentImage}
            alt={`${productName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={() => handleImageError(currentImageIndex)}
          />
          
          {/* Navigation Arrows - Only show if more than one valid image */}
          {validImages.length > 1 && (
            <>
              <Button
                onClick={handlePrevious}
                variant="ghost"
                size="sm"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm border-0 rounded-full shadow-lg transition-all duration-200 text-white hover:text-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={handleNext}
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm border-0 rounded-full shadow-lg transition-all duration-200 text-white hover:text-white"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
              {currentImageIndex + 1} / {validImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation - Only show if more than one valid image */}
        {/* {validImages.length > 1 && (
          <div className="p-4 bg-gray-50/50">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {validImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-18 h-18 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    currentImageIndex === index 
                      ? "border-blue-500 shadow-md scale-105" 
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                </button>
              ))}
            </div>
          </div>
        )} */}
      </CardContent>
    </Card>
  );
};

export default ProductImages;
