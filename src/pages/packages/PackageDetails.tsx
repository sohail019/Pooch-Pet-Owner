import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RootState } from "@/redux/store";
import { getPackageById } from "@/controllers/packagesController";
import { fetchPets } from "@/controllers/pet/petController";
import { Package } from "@/redux/slices/packagesSlice";
import { Pet } from "@/redux/slices/petsSlice";
import { handleApiError } from "@/types/errors";
import PackageInfoCard from "@/components/packages/PackageInfoCard";
import PackageFeatures from "@/components/packages/PackageFeatures";
import PackagePaymentSection from "@/components/packages/PackagePaymentSection";

const PackageDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Redux state
  const reduxPets = useSelector((state: RootState) => state.pets.pets);
  
  // Local state
  const [packageData, setPackageData] = useState<Package | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [selectedPetId, setSelectedPetId] = useState<string>("");
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
    toast.success("Payment completed successfully! 🎉");
    setTimeout(() => {
      navigate("/", { replace: true });
    }, 2000);
  };

  // Handle payment error
  const handlePaymentError = (errorMessage: string) => {
    setError(prev => ({ ...prev, payment: errorMessage }));
    toast.error(errorMessage);
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
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Package Details</h1>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold mb-2">Failed to Load Package</h3>
            <p className="text-gray-600 mb-4">{error.package}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={fetchPackageDetails} variant="outline">
                Try Again
              </Button>
              <Button onClick={() => navigate("/")} variant="default">
                Go Home
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
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-1"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold">Package Details</h1>
        </div>
        
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 text-4xl mb-4">📦</div>
            <h3 className="text-lg font-semibold mb-2">Package Not Found</h3>
            <p className="text-gray-600 mb-4">The package you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/")} variant="default">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b sticky top-0 z-10">
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
              <p className="text-sm text-gray-400">
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
          <PackageInfoCard 
            package={packageData}
          />

          {/* Package Features */}
          <PackageFeatures 
            features={packageData.features || []}
            duration={packageData.duration || 0}
          />
        </div>

        {/* Payment Section */}
        <PackagePaymentSection
          package={packageData}
          pets={pets}
          selectedPetId={selectedPetId}
          onPetSelect={setSelectedPetId}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          loading={{
            pets: loading.pets,
            payment: loading.payment,
          }}
          error={{
            pets: error.pets,
            payment: error.payment,
          }}
          onNavigateToAddPet={() => navigate("/add-pet")}
        />
      </div>
    </div>
  );
};

export default PackageDetails;
