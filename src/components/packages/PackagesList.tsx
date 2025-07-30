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
              className="min-w-[260px] max-w-sm flex-shrink-0 cursor-pointer border border-gray-300 rounded-xl shadow hover:shadow-md transition-all duration-200 bg-gradient-to-br from-gray-50 to-gray-100"
              onClick={() => handlePackageClick(pkg.id)}
            >
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">{pkg.name}</h3>
                  <div className="text-base font-semibold text-blue-600">
                    ₹{parseFloat(pkg.price).toFixed(2)}
                  </div>
                </div>
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <Badge className="bg-yellow-100 text-yellow-700 border-none font-medium px-2 py-0.5 mb-2">
                    <Star className="w-3 h-3 mr-1" />
                    Popular
                  </Badge>
                )}
                {/* Description */}
                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{pkg.description}</p>
                {/* Duration */}
                {pkg.duration && (
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-blue-700">
                      {pkg.duration} days
                    </span>
                  </div>
                )}
                {/* Features */}
                {pkg.features && pkg.features.length > 0 && (
                  <ul className="mb-3 space-y-1">
                    {pkg.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-xs text-gray-400 before:content-['•'] before:mr-1">
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                {/* Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <span className="text-xs text-gray-400">View Details</span>
                  <span className="flex items-center gap-1 text-blue-500 font-medium text-xs">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
};

export default PackagesList;
