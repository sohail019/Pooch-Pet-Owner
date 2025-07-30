import React, { useState } from "react";
import { CreditCard, User, Plus, AlertCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Package } from "@/redux/slices/packagesSlice";
import { Pet } from "@/redux/slices/petsSlice";
import { 
  initiatePackagePayment, 
  completePackagePayment, 
  PackagePaymentPayload 
} from "@/controllers/packagesController";
import { toast } from "react-toastify";

interface PackagePaymentSectionProps {
  package: Package;
  pets: Pet[];
  selectedPetId: string;
  onPetSelect: (petId: string) => void;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  loading: {
    pets: boolean;
    payment: boolean;
  };
  error: {
    pets: string;
    payment: string;
  };
  onNavigateToAddPet: () => void;
}

const PackagePaymentSection: React.FC<PackagePaymentSectionProps> = ({
  package: pkg,
  pets,
  selectedPetId,
  onPetSelect,
  onPaymentSuccess,
  onPaymentError,
  loading,
  error,
  onNavigateToAddPet,
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);

  // Handle payment process
  const handlePayment = async () => {
    if (!selectedPetId) {
      toast.error("Please select a pet for this package");
      return;
    }

    try {
      setPaymentLoading(true);

      // Validate price before conversion
      const priceValue = parseFloat(pkg.price);
      if (isNaN(priceValue) || priceValue <= 0) {
        toast.error("Invalid package price");
        return;
      }

      // Prepare payment payload - use correct field names and values
      const paymentPayload: PackagePaymentPayload = {
        packageId: pkg.id,
        petId: selectedPetId,
        amount: priceValue,
        currency: "INR",
        method: "credit_card", // Use the correct field name and value
        deliveryAddress: "123 Main Street, Mumbai, Maharashtra 400001, India"
      };

      console.log("💳 Initiating payment with payload:", paymentPayload);
      console.log("💳 Package details:", { id: pkg.id, name: pkg.name, price: pkg.price });
      console.log("💳 Selected pet ID:", selectedPetId);

      // Step 1: Initiate payment
      const paymentResponse = await initiatePackagePayment(paymentPayload);
      console.log("✅ Payment initiated:", paymentResponse);

      // Validate that we received a valid payment ID
      if (!paymentResponse.id) {
        throw new Error("Failed to get payment ID from response");
      }

      // toast.success("Payment initiated successfully!");

      // Mock payment gateway integration
      // In real app, this would redirect to payment gateway
      // toast.info("Processing payment...", { autoClose: 2000 });

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 2: Complete payment (mock success)
      const completionPayload = {
        paymentId: paymentResponse.id, // Include paymentId in payload
        status: "completed" as const,
        gatewayPaymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gatewaySignature: `sig_${Math.random().toString(36).substr(2, 20)}`,
        transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        gatewayResponse: {
          gateway: "razorpay",
          orderId: `order_${Date.now()}`,
          paymentId: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          signature: `sig_${Math.random().toString(36).substr(2, 20)}`
        }
      };

      console.log("💳 Completing payment with payload:", completionPayload);
      const completedPayment = await completePackagePayment(
        paymentResponse.id, 
        completionPayload
      );
      
      console.log("✅ Payment completed:", completedPayment);
      // toast.success("Payment completed successfully!");
      onPaymentSuccess();

    } catch (err) {
      console.error("❌ Payment failed:", err);
      const errorMessage = err instanceof Error ? err.message : "Payment failed. Please try again.";
      onPaymentError(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  // Get selected pet details
  const selectedPet = pets.find(pet => pet.id === selectedPetId);

  return (
    <div className="space-y-4">
      {/* Pet Selection */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
              <User className="w-5 h-5 text-green-600" />
            </div>
            Select Pet for Package
          </CardTitle>
          <p className="text-gray-600 text-sm">Choose which pet this package is for</p>
        </CardHeader>
        
        <CardContent>
          {loading.pets ? (
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-1" />
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ) : error.pets ? (
            <div className="p-4 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error.pets}
              </div>
            </div>
          ) : pets.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-gray-400 text-4xl mb-3">🐾</div>
              <h3 className="font-semibold text-gray-700 mb-2">No Pets Found</h3>
              <p className="text-gray-500 text-sm mb-4">
                You need to add a pet before purchasing this package.
              </p>
              <Button 
                onClick={onNavigateToAddPet}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Your First Pet
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pet Selection */}
              {pets.length === 1 ? (
                // Single pet - show as card
                <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 ring-2 ring-blue-200">
                      <div className="w-full h-full bg-gradient-to-r from-blue-200 to-indigo-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                        {pets[0].name.charAt(0).toUpperCase()}
                      </div>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-bold text-lg text-gray-900">{pets[0].name}</div>
                      <div className="text-sm text-blue-700 capitalize font-medium">
                        🐾 {pets[0].species} • {pets[0].breed}
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 border-green-200 font-semibold px-3 py-1">
                      ✅ Selected
                    </Badge>
                  </div>
                </div>
              ) : (
                // Multiple pets - show dropdown
                <div className="space-y-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                      className="w-full flex items-center justify-between p-3 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-gray-700">
                        {selectedPet ? `${selectedPet.name} (${selectedPet.species})` : "Choose a pet for this package"}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${petDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {petDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                        {pets.map((pet) => (
                          <button
                            key={pet.id}
                            type="button"
                            onClick={() => {
                              onPetSelect(pet.id);
                              setPetDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b last:border-b-0"
                          >
                            <Avatar className="w-8 h-8">
                              <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold text-sm">
                                {pet.name.charAt(0).toUpperCase()}
                              </div>
                            </Avatar>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-gray-900">{pet.name}</div>
                              <div className="text-sm text-gray-600 capitalize">
                                {pet.species} • {pet.breed}
                              </div>
                            </div>
                            {selectedPetId === pet.id && (
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Selected
                              </Badge>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected pet preview */}
                  {selectedPet && (
                    <div className="p-3 border rounded-lg bg-green-50 border-green-200">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full bg-green-200 rounded-full flex items-center justify-center text-green-600 font-semibold text-sm">
                            {selectedPet.name.charAt(0).toUpperCase()}
                          </div>
                        </Avatar>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{selectedPet.name}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {selectedPet.species} • {selectedPet.breed}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
            Payment Details
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-green-700 font-semibold">Package Price:</span>
                <span className="text-2xl font-bold text-green-800">
                  ₹{parseFloat(pkg.price).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 flex items-center gap-1">
                  ⏱️ Duration: {pkg.duration} days
                </span>
                <span className="text-green-600 flex items-center gap-1">
                  ✨ No hidden charges
                </span>
              </div>
            </div>

            {/* Error display */}
            {error.payment && (
              <div className="p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error.payment}
                </div>
              </div>
            )}

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              disabled={!selectedPetId || paymentLoading || loading.payment || pets.length === 0}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {paymentLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Pay ₹{parseFloat(pkg.price).toFixed(2)}
                </div>
              )}
            </Button>

            {/* Payment Method Info */}
            <div className="text-center text-xs text-gray-500">
              <p>Secure payment powered by Razorpay</p>
              <p>Supports all major cards, UPI & Net Banking</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackagePaymentSection;
