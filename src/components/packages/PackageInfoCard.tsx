import React from "react";
import { Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "@/redux/slices/packagesSlice";

interface PackageInfoCardProps {
  package: Package;
}

const PackageInfoCard: React.FC<PackageInfoCardProps> = ({ package: pkg }) => {
  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-bold mb-3">
              {pkg.name}
            </CardTitle>
            <div className="flex items-center gap-3 mb-2">
              {pkg.isPopular && (
                <Badge className="bg-white/20 text-white border-white/30 font-medium px-3 py-1">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  Popular Choice
                </Badge>
              )}
              <Badge 
                className={pkg.status === "active" 
                  ? "bg-green-100 text-green-800 border-green-200 font-medium" 
                  : "bg-gray-100 text-gray-600 border-gray-200 font-medium"}
              >
                {pkg.status === "active" ? "✅ Active" : "⏸️ Inactive"}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold bg-white/20 px-4 py-2 rounded-lg">
              ₹{parseFloat(pkg.price).toFixed(2)}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Description */}
          <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Package Description
            </h4>
            <p className="text-gray-700 leading-relaxed text-sm">
              {pkg.description}
            </p>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-blue-600 font-medium">Duration</div>
              <div className="text-lg font-bold text-blue-800">{pkg.duration} days</div>
            </div>
          </div>

          {/* Package Features (if available) */}
          {pkg.features && pkg.features.length > 0 && (
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
              <h4 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                Package Features
              </h4>
              <div className="space-y-2">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-purple-600">✓</span>
                    <span className="text-purple-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="text-xs text-green-600 mb-1 font-medium">Created By</div>
                <div className="text-sm font-semibold text-green-800">{pkg.createdByType}</div>
              </div>
              {pkg.clinicId && (
                <div className="p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                  <div className="text-xs text-indigo-600 mb-1 font-medium">Package Type</div>
                  <div className="text-sm font-semibold text-indigo-800">🏥 Clinic Package</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageInfoCard;
