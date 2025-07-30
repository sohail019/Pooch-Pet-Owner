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
    <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 text-white rounded-t-2xl relative">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl font-extrabold mb-2 tracking-tight drop-shadow-lg">
              {pkg.name}
            </CardTitle>
            <div className="flex items-center gap-3 mb-2">
                {pkg.isPopular && (
                <Badge className="flex items-center gap-2 px-3 py-1 font-semibold shadow border border-yellow-400 bg-gradient-to-r from-yellow-300/80 via-yellow-400/80 to-yellow-500/70 text-yellow-900 animate-pop">
                  <Star className="w-4 h-4 text-yellow-600 drop-shadow-md" />
                  <span className="font-bold tracking-wide">Popular Choice</span>
                </Badge>
                )}
                <Badge
                className={`flex items-center gap-1 px-3 py-1 font-semibold shadow border transition-all
                  ${
                  pkg.status === "active"
                    ? "bg-gradient-to-r from-green-400/80 via-green-500/70 to-green-600/60 text-green-900 border-green-400"
                    : "bg-gradient-to-r from-gray-300/60 via-gray-400/50 to-gray-500/40 text-gray-800 border-gray-400"
                  }
                `}
                >
                {pkg.status === "active" ? (
                  <>
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                  <span>Active</span>
                  </>
                ) : (
                  <>
                  <span className="inline-block w-2 h-2 bg-gray-400 rounded-full mr-1"></span>
                  <span>Inactive</span>
                  </>
                )}
                </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 w-auto ml-6">
            {/* Price */}
            <div className="relative">
              <div className="text-lg font-extrabold bg-white/30 px-4 py-2 rounded-lg shadow-lg border border-white/40 text-white drop-shadow-lg">
                ₹{parseFloat(pkg.price).toFixed(2)}
              </div>
              <span className="absolute right-2 bottom-[-18px] text-xs text-white/80 font-medium">
                Incl. taxes
              </span>
            </div>
            {/* Duration */}
            <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-lg text-sm font-semibold text-white shadow border border-white/30 mt-4">
              <Clock className="w-4 h-4 mr-1 text-blue-200" />
              {pkg.duration} days
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
      <div className="space-y-8">
        {/* Description */}
        <div className="p-5 bg-gradient-to-r from-gray-50 via-white to-gray-100 rounded-xl border border-gray-200 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          Package Description
        </h4>
        <p className="text-gray-700 leading-relaxed text-base">
          {pkg.description}
        </p>
        </div>

        {/* Duration */}
        <div className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-xl border border-blue-100 shadow-sm">
        <div className="p-3 bg-blue-100 rounded-lg shadow">
          <Clock className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <div className="text-sm text-blue-700 font-semibold">Duration</div>
          <div className="text-xl font-bold text-blue-900">{pkg.duration} days</div>
        </div>
        </div>

        {/* Package Features (if available) */}
        {pkg.features && pkg.features.length > 0 && (
        <div className="p-5 bg-gradient-to-r from-purple-50 via-pink-50 to-red-50 rounded-xl border border-purple-100 shadow-sm">
          <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2 text-lg">
          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
          Package Features
          </h4>
          <ul className="space-y-2">
          {pkg.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-base">
            <span className="text-purple-600 font-bold">✓</span>
            <span className="text-purple-800 font-medium">{feature}</span>
            </li>
          ))}
          </ul>
        </div>
        )}

        {/* Package Info */}
        <div className="border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Created By */}
            <div className="p-5 bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 rounded-xl border border-green-200 shadow-lg flex flex-col items-start">
              <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-xs text-green-700 font-semibold tracking-wide">Created By</span>
              </div>
              <div className="text-lg font-bold text-green-900">{pkg.createdByType}</div>
            </div>
            {/* Clinic Package Type */}
            {pkg.clinicId && (
              <div className="p-5 bg-gradient-to-br from-indigo-100 via-blue-50 to-cyan-100 rounded-xl border border-indigo-200 shadow-lg flex flex-col items-start">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block w-2 h-2 bg-indigo-500 rounded-full"></span>
            <span className="text-xs text-indigo-700 font-semibold tracking-wide">Package Type</span>
          </div>
          <div className="text-lg font-bold text-indigo-900 flex items-center gap-2">
            <span role="img" aria-label="Clinic" className="text-xl">🏥</span>
            <span>Clinic Package</span>
          </div>
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
