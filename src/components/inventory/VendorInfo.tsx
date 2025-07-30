import React from "react";
import { MapPin, Phone, Mail, Building, Star, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface VendorInfoProps {
  vendor: {
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

const VendorInfo: React.FC<VendorInfoProps> = ({ vendor }) => {
  const vendorRating = parseFloat(vendor.rating);
  
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          Vendor Information
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-6">
        {/* Vendor Header */}
        <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
          <Avatar className="w-16 h-16 ring-2 ring-white shadow-md">
            <img
              src={vendor.profilePicture}
              alt={vendor.businessName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://media.istockphoto.com/id/892381986/vector/pet-shop-sign-with-cute-dog-and-cat.jpg?s=612x612&w=0&k=20&c=2De4xrNAqG4-wqvWF6_auPJoyPbwzPQHCb4j05c7e0M=";
              }}
            />
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-extrabold text-xl text-gradient bg-gradient-to-r from-indigo-600 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow">
                {vendor.businessName}
              </h3>
              {vendor.isVerified && (
                <Badge variant="secondary" className="bg-gradient-to-r from-green-200 to-green-400 text-green-900 text-xs font-semibold px-2 py-1 flex items-center gap-1 shadow">
                  <CheckCircle className="w-3 h-3 mr-1 animate-bounce" />
                  Verified
                </Badge>
              )}
            </div>

            <p className="text-sm text-gray-500 mb-3 font-semibold italic tracking-wide">
              {vendor.businessType}
            </p>

            {/* Vendor Rating */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 transition-all ${
                      star <= Math.floor(vendorRating)
                        ? "text-yellow-400 drop-shadow-lg scale-110"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded-lg shadow">
                {vendorRating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                ({vendor.totalReviews} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="space-y-5">
            <h4 className="font-bold text-lg flex items-center gap-2 text-gradient bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Contact Details
            </h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-xl shadow hover:scale-[1.02] transition-transform">
            <span className="p-2 bg-blue-100 rounded-full">
              <Phone className="w-5 h-5 text-blue-600" />
            </span>
            <a
              href={`tel:${vendor.phone}`}
              className="text-blue-700 hover:text-blue-900 font-semibold text-base transition-colors"
            >
              {vendor.phone}
            </a>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-100 rounded-xl shadow hover:scale-[1.02] transition-transform">
            <span className="p-2 bg-purple-100 rounded-full">
              <Mail className="w-5 h-5 text-purple-600" />
            </span>
            <a
              href={`mailto:${vendor.email}`}
              className="text-purple-700 hover:text-purple-900 font-semibold text-base break-all transition-colors"
            >
              {vendor.email}
            </a>
              </div>
              <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-teal-100 rounded-xl shadow hover:scale-[1.02] transition-transform">
            <span className="p-2 bg-green-100 rounded-full">
              <MapPin className="w-5 h-5 text-green-600" />
            </span>
            <div className="text-green-700 text-sm font-medium">
              <div>{vendor.address}</div>
              <div>
                {vendor.city}, {vendor.state} {vendor.postalCode}
              </div>
            </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="space-y-5">
            <h4 className="font-bold text-lg flex items-center gap-2 text-gradient bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent drop-shadow">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              Business Details
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-100 rounded-xl shadow flex items-center gap-3 hover:scale-[1.02] transition-transform">
            <Avatar className="w-8 h-8 ring-1 ring-indigo-200">
              <img
                src={vendor.profilePicture}
                alt={vendor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://media.istockphoto.com/id/892381986/vector/pet-shop-sign-with-cute-dog-and-cat.jpg?s=612x612&w=0&k=20&c=2De4xrNAqG4-wqvWF6_auPJoyPbwzPQHCb4j05c7e0M=";
                }}
              />
            </Avatar>
            <div>
              <div className="text-xs text-indigo-600 mb-1 font-medium">Contact Person</div>
              <div className="text-sm font-semibold text-indigo-800">{vendor.name}</div>
            </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-orange-50 to-yellow-100 rounded-xl shadow hover:scale-[1.02] transition-transform">
            <div className="text-xs text-orange-600 mb-1 font-medium">GST Number</div>
            <div className="text-sm font-semibold font-mono text-orange-800 tracking-wider">
              {vendor.gstNumber}
            </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-pink-50 to-rose-100 rounded-xl shadow hover:scale-[1.02] transition-transform">
            <div className="text-xs text-pink-600 mb-1 font-medium">PAN Number</div>
            <div className="text-sm font-semibold font-mono text-pink-800 tracking-wider">
              {vendor.panNumber}
            </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Status & Capabilities */}
        <div className="pt-4 border-t">
          <div className="flex flex-wrap gap-2">
            {vendor.isActive && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Active Vendor
              </Badge>
            )}
            
            {vendor.kycStatus === "verified" && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Shield className="w-3 h-3 mr-1" />
                KYC Verified
              </Badge>
            )}
            
            {vendor.canManageInventory && (
              <Badge variant="outline" className="text-xs">
                Inventory Management
              </Badge>
            )}
            
            {vendor.canManagePackages && (
              <Badge variant="outline" className="text-xs">
                Package Management
              </Badge>
            )}
          </div>
        </div>

        {/* Member Since */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            Member since {new Date(vendor.createdAt).toLocaleDateString('en-IN', {
              month: 'long',
              year: 'numeric'
            })}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorInfo;
