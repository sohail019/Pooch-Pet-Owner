import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, User, Plus, AlertCircle, ChevronDown, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/redux/store";
import { getPackageById, initiatePackagePayment } from "@/controllers/packagesController";
import { completePayment } from "@/controllers/paymentController";
import { fetchPets } from "@/controllers/pet/petController";
import { Package } from "@/redux/slices/packagesSlice";
import { Pet } from "@/redux/slices/petsSlice";
import { handleApiError } from "@/types/errors";
import PackageInfoCard from "@/components/packages/PackageInfoCard";
import PackageFeatures from "@/components/packages/PackageFeatures";
import PaymentDialog from "@/components/common/PaymentDialog";

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Redux state
  const reduxPets = useSelector((state: RootState) => state.pets.pets);
  
  // Local state
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [loading, setLoading] = useState({
    package: true,
    pets: true,
    payment: false,
  });
  const [error, setError] = useState({
    package: "",
    pets: "",
    payment: "",
  });

  // Fetch package details
  const fetchPackageDetails = useCallback(async () => {
    if (!id) {
      toast.error("Package ID is required");
      navigate("/");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, package: true }));
      setError(prev => ({ ...prev, package: "" }));
      
      console.log("📦 Fetching package details for ID:", id);
      const data = await getPackageById(id);
      setPackageData(data);
      console.log("✅ Package details fetched:", data);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch package details:", err);
      const errorMessage = handleApiError(err);
      setError(prev => ({ ...prev, package: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, package: false }));
    }
  }, [id, navigate]);

  // Fetch pets for selection
  const fetchPetsData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, pets: true }));
      setError(prev => ({ ...prev, pets: "" }));
      
      // Try to use Redux pets first
      if (reduxPets && reduxPets.length > 0) {
        setPets(reduxPets);
        if (reduxPets.length === 1) {
          setSelectedPetId(reduxPets[0].id);
        }
        setLoading(prev => ({ ...prev, pets: false }));
        return;
      }

      // Fetch from API if Redux is empty
      console.log("🐕 Fetching pets for package selection...");
      const petsData = await fetchPets();
      const petsArray = Array.isArray(petsData) ? petsData : petsData?.pets || [];
      setPets(petsArray);
      
      // Auto-select if only one pet
      if (petsArray.length === 1) {
        setSelectedPetId(petsArray[0].id);
      }
      
      console.log("✅ Pets fetched for selection:", petsArray.length);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch pets:", err);
      const errorMessage = handleApiError(err);
      setError(prev => ({ ...prev, pets: errorMessage }));
      // Don't show error toast for pets - it's not critical
    } finally {
      setLoading(prev => ({ ...prev, pets: false }));
    }
  }, [reduxPets]);

  // Handle payment success
  const handlePaymentSuccess = () => {
    // toast.success("Payment completed successfully! 🎉");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 3000);
  };

  // Handle payment error
  const handlePaymentError = (errorMessage: string) => {
    setError(prev => ({ ...prev, payment: errorMessage }));
    toast.error(errorMessage);
  };

  // Payment state
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "initiated" | "success" | "error">("idle");
  const [paymentId, setPaymentId] = useState<string>("");
  const [paymentError, setPaymentError] = useState<string>("");
  const [isCompletingPayment, setIsCompletingPayment] = useState(false);

  // Handle manual payment completion
  const handleCompletePayment = async () => {
    if (!paymentId) {
      toast.error("No payment ID found");
      return;
    }

    try {
      setIsCompletingPayment(true);
      console.log("💳 Completing payment manually:", paymentId);
      
      const completedPayment = await completePayment(paymentId, "completed");
      console.log("✅ Payment completed:", completedPayment);
      
      toast.success("Payment completed successfully!");
      setPaymentState("success");

      // Auto-redirect after showing success
      setTimeout(() => {
        handlePaymentSuccess();
      }, 2000);

    } catch (err) {
      console.error("❌ Failed to complete payment:", err);
      const errorMsg = err instanceof Error ? err.message : "Failed to complete payment. Please try again.";
      setPaymentError(errorMsg);
      setPaymentState("error");
      toast.error(errorMsg);
    } finally {
      setIsCompletingPayment(false);
    }
  };

  // Handle Buy Now button click
  const handleBuyNow = async () => {
    if (!selectedPetId) {
      toast.error("Please select a pet for this package");
      return;
    }
    
    if (!packageData) return;

    // Validate price before conversion
    const priceValue = parseFloat(packageData.price);
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Invalid package price");
      return;
    }

    try {
      setPaymentDialogOpen(true);
      setPaymentState("processing");
      setPaymentError("");

      // Prepare payment payload
      const paymentPayload = {
        packageId: packageData.id,
        petId: selectedPetId,
        amount: priceValue,
        currency: "INR",
        method: "credit_card" as const,
        deliveryAddress: "123 Main Street, Mumbai, Maharashtra 400001, India"
      };

      console.log("💳 Initiating payment with payload:", paymentPayload);
      const paymentResponse = await initiatePackagePayment(paymentPayload);
      console.log("✅ Payment initiated:", paymentResponse);
      
      // Validate that we received a valid payment ID
      if (!paymentResponse.id) {
        throw new Error("Failed to get payment ID from response");
      }

      setPaymentId(paymentResponse.id);
      toast.success("Payment initiated successfully!");
      setPaymentState("initiated"); // Payment initiated, waiting for manual completion

      // Don't auto-complete, let user manually complete
      // User can now manually complete the payment using the Complete Payment button

    } catch (err) {
      console.error("❌ Payment failed:", err);
      const errorMsg = err instanceof Error ? err.message : "Payment failed. Please try again.";
      setPaymentError(errorMsg);
      setPaymentState("error");
      handlePaymentError(errorMsg);
    }
  };

  // Handle dialog close
  const handleDialogClose = () => {
    if (paymentState !== "processing") {
      setPaymentDialogOpen(false);
      if (paymentState !== "initiated") { // Keep payment state if payment was initiated
        setPaymentState("idle");
        setPaymentId("");
        setPaymentError("");
      }
    }
  };

  // Initialize data
  useEffect(() => {
    fetchPackageDetails();
    fetchPetsData();
  }, [fetchPackageDetails, fetchPetsData]);

  // Loading skeleton
  if (loading.package) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header skeleton */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full animate-pulse" />
            <div className="w-32 h-6 rounded animate-pulse" />
          </div>

          {/* Content skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="w-full h-80 rounded-lg animate-pulse" />
            <div className="space-y-4">
              <div className="w-3/4 h-8 rounded animate-pulse" />
              <div className="w-1/2 h-6 rounded animate-pulse" />
              <div className="w-full h-20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error.package) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Package Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              {error.package || "The package you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button onClick={fetchPackageDetails}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No package data
  if (!packageData) {
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        <Card className="w-full max-w-md border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Package Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              The package you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-white">
                {packageData.name}
              </h1>
              <p className="text-sm text-gray-200">
                {packageData.createdByType} • {packageData.duration} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Package Info Card */}
          <PackageInfoCard package={packageData} />

          {/* Package Features */}
          <PackageFeatures
            features={packageData.features || []}
            duration={packageData.duration || 0}
          />
        </div>

        {/* Pet Selection and Payment Section */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              Select Pet & Purchase Package
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Choose which pet this package is for
            </p>
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
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🐕</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Pets Found
                </h3>
                <p className="text-gray-600 mb-4">
                  You need to add a pet to purchase this package
                </p>
                <Button
                  onClick={() => navigate("/add-pet")}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Pet
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Pet Selection Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                    className="w-full p-3 border rounded-lg flex items-center justify-between hover:border-blue-300 transition-colors"
                  >
                    {selectedPetId ? (
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                            {pets
                              .find((p) => p.id === selectedPetId)
                              ?.name.charAt(0)}
                          </div>
                        </Avatar>
                        <div className="text-left">
                          <div className="font-medium text-white">
                            {pets.find((p) => p.id === selectedPetId)?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pets.find((p) => p.id === selectedPetId)?.species}{" "}
                            • {new Date().getFullYear() - new Date(pets.find((p) => p.id === selectedPetId)?.dateOfBirth || "").getFullYear()}{" "}
                            years
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-500">
                        Select a pet for this package
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        petDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {petDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                      {pets.map((pet) => (
                        <button
                          key={pet.id}
                          onClick={() => {
                            setSelectedPetId(pet.id);
                            setPetDropdownOpen(false);
                          }}
                          className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <Avatar className="w-8 h-8">
                            <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-medium">
                              {pet.name.charAt(0)}
                            </div>
                          </Avatar>
                          <div>
                            <div className="font-medium text-gray-900">
                              {pet.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {pet.species} • {new Date().getFullYear() - new Date(pet.dateOfBirth).getFullYear()} years
                            </div>
                          </div>
                          {selectedPetId === pet.id && (
                            <Badge className="ml-auto bg-green-100 text-green-800">
                              Selected
                            </Badge>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Buy Now Button */}
                <Button
                  onClick={handleBuyNow}
                  disabled={!selectedPetId || paymentState === "processing"}
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50"
                >
                  {paymentState === "processing" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      Buy Now - ₹
                      {parseFloat(packageData?.price || "0").toFixed(2)}
                    </>
                  )}
                </Button>

                {/* Complete Payment Button - Show when payment is initiated */}
                {paymentState === "initiated" && paymentId && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-center mb-3">
                      <p className="text-sm text-blue-800 font-medium mb-1">
                        Payment Initiated Successfully!
                      </p>
                      <p className="text-xs text-blue-600">
                        Payment ID: <span className="font-mono">{paymentId}</span>
                      </p>
                    </div>
                    <Button
                      onClick={handleCompletePayment}
                      disabled={isCompletingPayment}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50"
                    >
                      {isCompletingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Completing Payment...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Complete Payment
                        </>
                      )}
                    </Button>
                    <div className="mt-2 text-center">
                      <button
                        onClick={() => navigate("/my-orders")}
                        className="text-sm text-blue-600 hover:text-blue-700 underline"
                      >
                        View My Orders
                      </button>
                    </div>
                  </div>
                )}

                {/* Add Pet Option */}
                <div className="text-center pt-2 border-t">
                  <button
                    onClick={() => navigate("/add-pet")}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add another pet
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payment Dialog */}
        <PaymentDialog
          isOpen={paymentDialogOpen}
          paymentState={paymentState}
          item={{
            id: packageData?.id || "",
            name: packageData?.name || "",
            price: packageData?.price || "0",
          }}
          totalAmount={parseFloat(packageData?.price || "0")}
          paymentId={paymentId}
          onClose={handleDialogClose}
          onPaymentSuccess={handlePaymentSuccess}
          onCompletePayment={handleCompletePayment}
          errorMessage={paymentError}
          petName={pets.find((p) => p.id === selectedPetId)?.name}
        />
      </div>
    </div>
  );
};

export default PackageDetails;
