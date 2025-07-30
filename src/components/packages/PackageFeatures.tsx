import React from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PackageFeaturesProps {
  features: string[];
  duration: number;
}

const PackageFeatures: React.FC<PackageFeaturesProps> = ({ features, duration }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">What's Included</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
          
          {/* Duration as a feature */}
          <div className="flex items-start gap-3 pt-2 border-t">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">
              Valid for <strong>{duration} days</strong> from purchase date
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageFeatures;
