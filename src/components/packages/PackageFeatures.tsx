import React from "react";
import { CheckCircle, Clock, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PackageFeaturesProps {
  features: string[];
  duration: number;
}

const PackageFeatures: React.FC<PackageFeaturesProps> = ({ features, duration }) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
            <Star className="w-5 h-5 text-green-600" />
          </div>
          Package Features
        </CardTitle>
        <p className="text-gray-600 text-sm mt-2">Everything included in this package</p>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-6">
        {/* Features Section */}
        <div className="space-y-4">
          <h4 className="font-bold text-lg flex items-center gap-2 text-gradient bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent drop-shadow">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Included Features
          </h4>
          
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl shadow hover:scale-[1.02] transition-transform">
                <div className="p-1 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-green-800 font-medium text-sm leading-relaxed">{feature}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Duration Section */}
        <div className="pt-4 border-t border-dashed border-gray-200">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-blue-600 font-medium mb-1">Package Validity</div>
                <div className="text-blue-800 font-bold">
                  Valid for <span className="text-lg">{duration} days</span> from purchase date
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 font-semibold px-3 py-1">
                ⏰ {duration}d
              </Badge>
            </div>
          </div>
        </div>

        {/* Premium Features Highlight */}
        <div className="pt-4 border-t border-dashed border-gray-200">
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-gradient-to-r from-purple-200 to-pink-300 text-purple-900 font-bold px-3 py-1 flex items-center gap-1 shadow-lg border border-purple-300">
              <Star className="w-4 h-4 mr-1 fill-current animate-pulse" />
              Premium Package
            </Badge>
            <Badge className="bg-gradient-to-r from-green-200 to-emerald-300 text-green-900 font-bold px-3 py-1 flex items-center gap-1 shadow-lg border border-green-300">
              <CheckCircle className="w-4 h-4 mr-1" />
              All Features Included
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageFeatures;
