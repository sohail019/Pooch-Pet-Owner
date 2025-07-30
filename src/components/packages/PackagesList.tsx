import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, ArrowRight } from "lucide-react";

interface Package {
  id: string;
  name: string;
  description: string;
  price: string; // Changed to string to match API response
  duration?: number;
  features?: string[];
  status?: "active" | "inactive";
  isPopular?: boolean;
}

interface PackagesListProps {
  packages: Package[];
}

const PackagesList: React.FC<PackagesListProps> = ({ packages }) => {
  const navigate = useNavigate();

  const handlePackageClick = (packageId: string) => {
    navigate(`/packages/${packageId}`);
  };

  if (!packages.length) {
    return (
      <div className="mb-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Packages Available</h3>
          <p className="text-gray-500">Check back later for exciting package deals!</p>
        </div>
      </div>
    );
  }

  const isHorizontal = packages.length > 2;
  
  return (
    <div className="mb-8">
      <div
        className={
          isHorizontal
            ? "flex gap-6 overflow-x-auto pb-4"
            : "flex flex-col gap-6"
        }
      >
        {packages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className="min-w-[280px] max-w-sm flex-shrink-0 cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-0 shadow-md bg-gradient-to-br from-white to-gray-50"
            onClick={() => handlePackageClick(pkg.id)}
          >
            <CardContent className="p-6">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 mb-2">{pkg.name}</h3>
                  {pkg.isPopular && (
                    <Badge className="bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 border-orange-200 font-medium px-3 py-1">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Popular
                    </Badge>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{parseFloat(pkg.price).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {pkg.description}
                </p>
              </div>

              {/* Duration */}
              {pkg.duration && (
                <div className="flex items-center gap-2 mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    Duration: {pkg.duration} days
                  </span>
                </div>
              )}

              {/* Action Button */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-500 font-medium">View Details</span>
                <div className="flex items-center gap-1 text-blue-600 font-semibold">
                  <span className="text-sm">Learn More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PackagesList;
