import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ShoppingBag, Calendar, CreditCard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { getUserPackages } from "@/controllers/packagesController";
import { handleApiError } from "@/types/errors";

// Interface for the actual API response structure
interface PurchasedPackage {
  id: string;
  userId: string;
  packageId: string;
  paymentId: string;
  status: "active" | "expired" | "pending";
  startDate: string;
  endDate: string;
  featuresUsed: string[];
  createdAt: string;
  updatedAt: string;
  package: {
    id: string;
    name: string;
    description: string;
    price: string;
  };
  payment: {
    id: string;
    amount: string;
    status: string;
    method: string;
  };
}

const MyPackages: React.FC = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<PurchasedPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user packages
  const fetchUserPackages = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("📦 Fetching user packages...");
      
      const userPackages = await getUserPackages();
      console.log("✅ User packages fetched:", userPackages);
      
      // Cast to the expected type since API response structure differs
      setPackages(userPackages as unknown as PurchasedPackage[]);
    } catch (err) {
      console.error("❌ Failed to fetch user packages:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPackages();
  }, []);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get payment method icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit_card':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <CreditCard className="w-4 h-4" />;
    }
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br ">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 bg-gray-700 rounded-full animate-pulse" />
            <div className="w-48 h-8 bg-gray-700 rounded animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-48 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg bg-white">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Failed to Load Packages
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button onClick={fetchUserPackages}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Package className="w-6 h-6" />
                My Packages
              </h1>
              <p className="text-gray-300 text-sm">
                All your purchased packages in one place
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {packages.length === 0 ? (
          // Empty state
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Packages Yet</h3>
            <p className="text-gray-300 mb-6 max-w-md mx-auto">
              You haven't purchased any packages yet. Browse our collection and find the perfect package for your pet!
            </p>
            <Button 
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Browse Packages
            </Button>
          </div>
        ) : (
          // Package list
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">
                Your Packages ({packages.length})
              </h2>
            </div>

            <div className="grid gap-6">
              {packages.map((userPackage) => (
                <Card key={userPackage.id} className="border-0 shadow-lg bg-white/95 backdrop-blur-sm">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-bold text-gray-900 mb-2">
                          {userPackage.package.name}
                        </CardTitle>
                        <p className="text-gray-600 text-sm mb-3">
                          {userPackage.package.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <Badge className={`px-3 py-1 text-xs font-medium border ${getStatusBadgeColor(userPackage.status)}`}>
                            {userPackage.status.toUpperCase()}
                          </Badge>
                          <div className="text-2xl font-bold text-blue-600">
                            ₹{parseFloat(userPackage.package.price).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Duration Info */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">Duration</span>
                        </div>
                        <div className="text-xs text-green-700">
                          <div>Start: {formatDate(userPackage.startDate)}</div>
                          <div>End: {formatDate(userPackage.endDate)}</div>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {getPaymentMethodIcon(userPackage.payment.method)}
                          <span className="text-sm font-medium text-blue-800">Payment</span>
                        </div>
                        <div className="text-xs text-blue-700">
                          <div>Amount: ₹{parseFloat(userPackage.payment.amount).toFixed(2)}</div>
                          <div>Status: {userPackage.payment.status}</div>
                        </div>
                      </div>

                      {/* Features Used */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-800">Features</span>
                        </div>
                        <div className="text-xs text-purple-700">
                          {userPackage.featuresUsed.length > 0 ? (
                            <div>Used: {userPackage.featuresUsed.length} features</div>
                          ) : (
                            <div>No features used yet</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                      <Button
                        onClick={() => navigate(`/packages/${userPackage.packageId}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <div className="text-xs text-gray-500">
                        Purchased on {formatDate(userPackage.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPackages;
