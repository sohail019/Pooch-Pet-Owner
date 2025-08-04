import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Verified, Phone, Mail, User, Calendar, Dog, Cat, MessageSquare, AlertCircle, ChevronLeft, ChevronRight, CreditCard, Clock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  getRehomingPetById, 
  createAdoptionRequest,
  getMyAdoptionRequestsAsAdopter,
  getAdoptionRequestsForPet,
  processAdoptionPayment,
  confirmAdopterTransfer,
  confirmPetOwnerTransfer,
  RehomingPet,
  AdoptionRequest 
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";
import { useAuth } from "@/hooks/useAuth";

const RehomingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [pet, setPet] = useState<RehomingPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [adoptionMessage, setAdoptionMessage] = useState("");
  const [submittingAdoption, setSubmittingAdoption] = useState(false);
  const [myAdoptionRequest, setMyAdoptionRequest] = useState<AdoptionRequest | null>(null);
  const [checkingRequest, setCheckingRequest] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmingAdopterTransfer, setConfirmingAdopterTransfer] = useState(false);
  const [confirmingOwnerTransfer, setConfirmingOwnerTransfer] = useState(false);
  
  // Pet owner specific states
  const [petAdoptionRequests, setPetAdoptionRequests] = useState<AdoptionRequest[]>([]);
  const [loadingPetRequests, setLoadingPetRequests] = useState(false);

  // Fetch pet details
  const fetchPetDetails = useCallback(async () => {
    if (!id) {
      setError("Pet ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      
      console.log("🏠 Fetching pet details for ID:", id);
      const petData = await getRehomingPetById(id);
      setPet(petData);
      console.log("✅ Pet details fetched:", petData);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch pet details:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Check if current user has adoption request for this pet
  const checkMyAdoptionRequest = useCallback(async () => {
    if (!id) return;
    
    try {
      setCheckingRequest(true);
      console.log("🔍 Checking my adoption request for pet:", id);
      
      const myRequests = await getMyAdoptionRequestsAsAdopter();
      const requestForThisPet = myRequests.find(request => request.pet?.id === id);
      
      setMyAdoptionRequest(requestForThisPet || null);
      console.log("✅ My adoption request status:", requestForThisPet?.status || 'none');
      
    } catch (err) {
      console.error("❌ Failed to check adoption request:", err);
      // Don't show error toast for this - it's not critical
    } finally {
      setCheckingRequest(false);
    }
  }, [id]);

  // Check adoption requests for this pet if user is the pet owner
  const checkPetAdoptionRequests = useCallback(async () => {
    if (!id || !pet || !user || !pet.owner || user.id !== pet.owner.id) return;
    
    try {
      setLoadingPetRequests(true);
      console.log("🔍 Checking adoption requests for my pet:", id);
      
      const requests = await getAdoptionRequestsForPet(id);
      setPetAdoptionRequests(requests);
      console.log("✅ Pet adoption requests loaded:", requests.length);
      
    } catch (err) {
      console.error("❌ Failed to check pet adoption requests:", err);
      // Don't show error toast for this - it's not critical
    } finally {
      setLoadingPetRequests(false);
    }
  }, [id, pet, user]);

  // Handle adoption request
  const handleAdoptionRequest = async () => {
    if (!id) {
      toast.error("Pet ID is required");
      return;
    }

    if (!adoptionMessage.trim()) {
      toast.error("Please add a message with your adoption request");
      return;
    }

    try {
      setSubmittingAdoption(true);
      
      console.log("🏠 Creating adoption request for pet:", id);
      await createAdoptionRequest(id, { message: adoptionMessage });
      
      // Success handled by controller (toast)
      setShowAdoptionForm(false);
      setAdoptionMessage("");
      
      // Refresh adoption request status
      await checkMyAdoptionRequest();
      
      // Optionally navigate to adoption requests
      setTimeout(() => {
        navigate("/rehoming/my-requests");
      }, 2000);
      
    } catch (err: unknown) {
      console.error("❌ Failed to create adoption request:", err);
      // Error handled by controller (toast)
    } finally {
      setSubmittingAdoption(false);
    }
  };

  // Handle payment processing
  const handlePaymentProcessing = async () => {
    if (!myAdoptionRequest?.id) {
      toast.error("Adoption request ID is required");
      return;
    }

    try {
      setProcessingPayment(true);
      
      console.log("💳 Processing payment for adoption request:", myAdoptionRequest.id);
      
      // For demo purposes, we'll simulate a successful payment
      // In a real app, this would integrate with actual payment gateway (Stripe, etc.)
      const paymentPayload = {
        paymentMethod: "stripe" as const,
        gatewayResponse: {
          paymentIntentId: `pi_${Math.random().toString(36).substr(2, 9)}`,
          status: "succeeded"
        }
      };
      
      await processAdoptionPayment(myAdoptionRequest.id, paymentPayload);
      
      // Refresh adoption request status to show the updated status
      await checkMyAdoptionRequest();
      
      // Show success message and navigate
      toast.success("Payment processed successfully! The pet owner will verify the payment.");
      
      setTimeout(() => {
        navigate("/rehoming/my-requests");
      }, 2000);
      
    } catch (err: unknown) {
      console.error("❌ Failed to process payment:", err);
      // Error handled by controller (toast)
    } finally {
      setProcessingPayment(false);
    }
  };

  // Handle adopter confirmation
  const handleAdopterConfirmation = async () => {
    if (!myAdoptionRequest?.id) {
      toast.error("Adoption request ID is required");
      return;
    }

    try {
      setConfirmingAdopterTransfer(true);
      
      console.log("🤝 Confirming pet received by adopter for request:", myAdoptionRequest.id);
      
      await confirmAdopterTransfer(myAdoptionRequest.id, "Pet received successfully. Thank you!");
      
      // Refresh adoption request status to show the updated status
      await checkMyAdoptionRequest();
      
      // Show success message
      toast.success("Pet transfer confirmed! The escrow will be released soon.");
      
    } catch (err: unknown) {
      console.error("❌ Failed to confirm adopter transfer:", err);
      // Error handled by controller (toast)
    } finally {
      setConfirmingAdopterTransfer(false);
    }
  };

  // Handle pet owner confirmation
  const handlePetOwnerConfirmation = async (adoptionRequestId?: string) => {
    const requestId = adoptionRequestId || myAdoptionRequest?.id;
    
    if (!requestId) {
      toast.error("Adoption request ID is required");
      return;
    }

    try {
      setConfirmingOwnerTransfer(true);
      
      console.log("🤝 Confirming pet transferred by owner for request:", requestId);
      
      await confirmPetOwnerTransfer(requestId, "Pet transferred successfully to new owner!");
      
      // Refresh adoption request status to show the updated status
      await checkMyAdoptionRequest();
      
      // Refresh pet adoption requests if user is pet owner
      if (pet && user && pet.owner && user.id === pet.owner.id) {
        await checkPetAdoptionRequests();
      }
      
      // Show success message
      toast.success("Pet transfer confirmed! Thank you for your cooperation.");
      
    } catch (err: unknown) {
      console.error("❌ Failed to confirm pet owner transfer:", err);
      // Error handled by controller (toast)
    } finally {
      setConfirmingOwnerTransfer(false);
    }
  };

  // Navigate carousel
  const goToPreviousImage = () => {
    if (pet?.imageUrls) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? pet.imageUrls.length - 1 : prev - 1
      );
    }
  };

  const goToNextImage = () => {
    if (pet?.imageUrls) {
      setCurrentImageIndex((prev) => 
        prev === pet.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Format price
  const formatPrice = (price: number | null | undefined, adoptionType: string) => {
    if (adoptionType === "free") return "Free Adoption";
    return price ? `₹${price.toLocaleString()}` : "Price on request";
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchPetDetails();
      await checkMyAdoptionRequest();
    };
    
    loadData();
  }, [fetchPetDetails, checkMyAdoptionRequest]);

  // Check pet adoption requests when pet data is loaded and user is the owner
  useEffect(() => {
    if (pet && user && pet.owner && user.id === pet.owner.id) {
      checkPetAdoptionRequests();
    }
  }, [pet, user, checkPetAdoptionRequests]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/rehoming")}
                variant="ghost"
                size="sm"
                className="p-2 text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <div className="w-32 h-6 bg-gray-700 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-700 rounded animate-pulse mt-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image skeleton */}
            <div className="aspect-square bg-gray-700 rounded-lg animate-pulse" />
            
            {/* Details skeleton */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="w-48 h-8 bg-gray-700 rounded" />
                    <div className="w-32 h-6 bg-gray-700 rounded" />
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-gray-700 rounded" />
                      <div className="w-3/4 h-4 bg-gray-700 rounded" />
                      <div className="w-1/2 h-4 bg-gray-700 rounded" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center px-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-red-900/20 via-red-800/20 to-red-900/20 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Failed to Load Pet Details
            </h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate("/rehoming")} 
                variant="outline"
                className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Browse
              </Button>
              <Button 
                onClick={fetchPetDetails}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/rehoming")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{pet.name}</h1>
              <p className="text-gray-400">
                {pet.breed} • {pet.age} {pet.age === 1 ? "year" : "years"} old
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              {pet.isVerified && (
                <Badge className="bg-green-900 text-green-200 border-green-700">
                  <Verified className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge
                className={
                  pet.adoptionType === "free"
                    ? "bg-blue-900 text-blue-200 border-blue-700"
                    : "bg-orange-900 text-orange-200 border-orange-700"
                }
              >
                {pet.adoptionType === "free" ? "Free" : "Paid"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="space-y-4">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  {pet.imageUrls && pet.imageUrls.length > 0 ? (
                    <>
                      <img
                        src={
                          pet.imageUrls[currentImageIndex] ||
                          "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80"
                        }
                        alt={`${pet.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80";
                        }}
                      />

                      {/* Navigation arrows */}
                      {pet.imageUrls.length > 1 && (
                        <>
                          <Button
                            onClick={goToPreviousImage}
                            variant="ghost"
                            size="sm"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={goToNextImage}
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </>
                      )}

                      {/* Image indicators */}
                      {pet.imageUrls.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {pet.imageUrls.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentImageIndex
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      {pet.species === "dog" ? (
                        <Dog className="w-24 h-24 text-gray-400" />
                      ) : (
                        <Cat className="w-24 h-24 text-gray-400" />
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pet Details */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                  {pet.species === "dog" ? (
                    <Dog className="w-6 h-6 text-blue-400" />
                  ) : (
                    <Cat className="w-6 h-6 text-purple-400" />
                  )}
                  Pet Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Species</p>
                    <p className="text-white font-medium capitalize">
                      {pet.species}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Breed</p>
                    <p className="text-white font-medium">{pet.breed}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Age</p>
                    <p className="text-white font-medium">
                      {pet.age} {pet.age === 1 ? "year" : "years"} old
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Adoption Fee</p>
                    <p className="text-green-400 font-semibold">
                      {formatPrice(pet.price, pet.adoptionType)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-2">Description</p>
                  <p className="text-gray-200 leading-relaxed break-words whitespace-pre-line text-sm sm:text-base">
                  {pet.description}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">Listed on</p>
                  <p className="text-white font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-400" />
                    {formatDate(pet.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            {pet.owner && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6 text-green-400" />
                    Owner Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                        {pet.owner.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </Avatar>
                    <div>
                      <p className="text-white font-semibold">
                        {pet.owner.name}
                      </p>
                      <p className="text-gray-400 text-sm">Pet Owner</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-blue-400" />
                      <span className="text-gray-200">{pet.owner.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-green-400" />
                      <span className="text-gray-200">{pet.owner.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pet Transfer Status - Only for Pet Owners */}
            {pet.owner && user && user.id === pet.owner.id && (
              <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-purple-400" />
                    Pet Transfer Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingPetRequests ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                      <span className="ml-3 text-gray-300">
                        Loading adoption requests...
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Summary Stats */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-blue-200">
                            {petAdoptionRequests.length}
                          </div>
                          <div className="text-blue-300 text-sm">
                            Total Requests
                          </div>
                        </div>
                        <div className="bg-orange-900/20 border border-orange-600 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-orange-200">
                            {
                              petAdoptionRequests.filter(
                                (r) => r.status === "pet_transfer_pending"
                              ).length
                            }
                          </div>
                          <div className="text-orange-300 text-sm">
                            Pending Transfers
                          </div>
                        </div>
                        <div className="bg-green-900/20 border border-green-600 rounded-lg p-3 text-center">
                          <div className="text-2xl font-bold text-green-200">
                            {
                              petAdoptionRequests.filter(
                                (r) => r.status === "completed"
                              ).length
                            }
                          </div>
                          <div className="text-green-300 text-sm">
                            Completed
                          </div>
                        </div>
                      </div>

                      {petAdoptionRequests.length === 0 ? (
                        <div className="text-center py-6">
                          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-gray-300">
                            No adoption requests yet
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            Requests will appear here when someone shows
                            interest in {pet.name}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {petAdoptionRequests
                            .filter(
                              (request) =>
                                request.status === "pet_transfer_pending"
                            )
                            .map((request) => (
                              <div
                                key={request.id}
                                className="bg-orange-900/20 border border-orange-600 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="text-white font-semibold">
                                      Transfer Confirmation Required
                                    </h4>
                                    <p className="text-gray-300 text-sm">
                                      {request.adopter?.name} is waiting for
                                      transfer confirmation
                                    </p>
                                  </div>
                                  <Badge className="bg-orange-900 text-orange-200 border-orange-700">
                                    Pending Transfer
                                  </Badge>
                                </div>

                                {/* Confirmation Status */}
                                <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3 mb-4">
                                  <h5 className="text-blue-200 font-medium mb-2">
                                    Confirmation Status:
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                      <span className="text-blue-200">
                                        Your Confirmation:
                                      </span>
                                      {request.petOwnerConfirmation ? (
                                        <Badge className="bg-green-900 text-green-200 border-green-700">
                                          ✓ Confirmed
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-yellow-900 text-yellow-200 border-yellow-700">
                                          ⏳ Pending
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-blue-200">
                                        Adopter Confirmation:
                                      </span>
                                      {request.adopterConfirmation ? (
                                        <Badge className="bg-green-900 text-green-200 border-green-700">
                                          ✓ Confirmed
                                        </Badge>
                                      ) : (
                                        <Badge className="bg-yellow-900 text-yellow-200 border-yellow-700">
                                          ⏳ Pending
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Action Button for Pet Owner */}
                                {!request.petOwnerConfirmation ? (
                                  <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-3">
                                    <p className="text-purple-200 text-sm mb-3">
                                      <strong>Action Required:</strong> Have you
                                      transferred {pet.name} to the adopter?
                                    </p>
                                    <Button
                                      onClick={() =>
                                        handlePetOwnerConfirmation(request.id)
                                      }
                                      disabled={confirmingOwnerTransfer}
                                      className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-semibold"
                                    >
                                      {confirmingOwnerTransfer ? (
                                        <>
                                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                          Confirming...
                                        </>
                                      ) : (
                                        <>
                                          <CheckCircle className="w-5 h-5 mr-2" />
                                          Confirm Pet Transferred
                                        </>
                                      )}
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="bg-green-900/20 border border-green-600 rounded-lg p-3">
                                    <p className="text-green-200 text-sm text-center">
                                      ✓ You have confirmed the transfer.
                                      {!request.adopterConfirmation &&
                                        " Waiting for adopter confirmation to release funds."}
                                      {request.adopterConfirmation &&
                                        " Transfer completed! Funds will be released."}
                                    </p>
                                  </div>
                                )}

                                {/* Adopter Details */}
                                <div className="mt-4 pt-4 border-t border-gray-700">
                                  <h5 className="text-white font-medium mb-2">
                                    Adopter Details:
                                  </h5>
                                  <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-2">
                                      <User className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-200">
                                        {request.adopter?.name}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="w-4 h-4 text-gray-400" />
                                      <span className="text-gray-200">
                                        {request.adopter?.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                          {/* Show message if no pending transfers */}
                          {petAdoptionRequests.length > 0 &&
                            petAdoptionRequests.filter(
                              (request) =>
                                request.status === "pet_transfer_pending"
                            ).length === 0 && (
                              <div className="text-center py-6">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-emerald-700 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-gray-300">
                                  No pending transfers
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  All adoptions for {pet.name} are either
                                  completed or in other stages
                                </p>
                              </div>
                            )}
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Adoption CTA - Dynamic based on adoption request status */}
            {pet.isVerified && !pet.isAdopted && (
              <Card className="shadow-lg bg-gradient-to-br from-green-900/20 via-emerald-800/20 to-green-900/20 border border-green-800/50">
                <CardContent className="p-6 text-center">
                  {/* Loading adoption request status */}
                  {checkingRequest && (
                    <>
                      <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Checking Status...
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Loading your adoption request status for {pet.name}...
                      </p>
                    </>
                  )}

                  {/* No adoption request yet */}
                  {!checkingRequest && !myAdoptionRequest && (
                    <>
                      <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Interested in Adopting {pet.name}?
                      </h3>
                      <p className="text-gray-300 mb-6">
                        Send an adoption request to the owner with a personal
                        message about why you'd be a great fit!
                      </p>

                      {!showAdoptionForm ? (
                        <Button
                          onClick={() => setShowAdoptionForm(true)}
                          className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold px-8 py-3"
                        >
                          <Heart className="w-5 h-5 mr-2" />
                          Send Adoption Request
                        </Button>
                      ) : (
                        <div className="space-y-4">
                          <div className="text-left">
                            <Label
                              htmlFor="adoptionMessage"
                              className="text-gray-200 font-medium"
                            >
                              Your Message to the Owner *
                            </Label>
                            <Textarea
                              id="adoptionMessage"
                              value={adoptionMessage}
                              onChange={(e) =>
                                setAdoptionMessage(e.target.value)
                              }
                              placeholder="Tell the owner why you'd be perfect for this pet. Share your experience, living situation, and what you can offer..."
                              rows={4}
                              className="mt-2 bg-gray-800 border-gray-700 text-white"
                            />
                            <p className="text-sm text-gray-400 mt-1">
                              {adoptionMessage.length}/1000 characters
                            </p>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => {
                                setShowAdoptionForm(false);
                                setAdoptionMessage("");
                              }}
                              variant="outline"
                              className="flex-1 border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                              disabled={submittingAdoption}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleAdoptionRequest}
                              disabled={
                                submittingAdoption || !adoptionMessage.trim()
                              }
                              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold"
                            >
                              {submittingAdoption ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <MessageSquare className="w-4 h-4 mr-2" />
                                  Send Request
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Pending adoption request */}
                  {!checkingRequest &&
                    myAdoptionRequest?.status === "pending" && (
                      <>
                        <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Request Submitted!
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Your adoption request for {pet.name} has been sent to
                          the owner. They will review it and get back to you
                          soon!
                        </p>
                        <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 mb-4">
                          <p className="text-yellow-200 text-sm">
                            <strong>Your message:</strong> "
                            {myAdoptionRequest.message}"
                          </p>
                        </div>
                        <Button
                          onClick={() => navigate("/rehoming/my-requests")}
                          variant="outline"
                          className="border-yellow-600 text-yellow-200 bg-yellow-900/20 hover:bg-yellow-800/30"
                        >
                          View My Requests
                        </Button>
                      </>
                    )}

                  {/* Accepted adoption request - Payment needed */}
                  {!checkingRequest &&
                    myAdoptionRequest?.status === "payment_pending" && (
                      <>
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Request Accepted! 🎉
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Great news! The owner has accepted your adoption
                          request for {pet.name}.
                        </p>

                        {pet.adoptionType === "paid" ? (
                          <>
                            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-6">
                              <p className="text-blue-200 text-sm mb-2">
                                <strong>Next Step:</strong> Complete the payment
                                to secure the adoption.
                              </p>
                              <p className="text-blue-200 text-sm">
                                Amount:{" "}
                                <span className="font-semibold text-lg">
                                  ₹{pet.price}
                                </span>
                              </p>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                onClick={() =>
                                  navigate("/rehoming/my-requests")
                                }
                                variant="outline"
                                className="flex-1 border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                              >
                                View All Requests
                              </Button>
                              <Button
                                onClick={handlePaymentProcessing}
                                disabled={processingPayment}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold"
                              >
                                {processingPayment ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Pay ₹{pet.price}
                                  </>
                                )}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-6">
                              <p className="text-green-200 text-sm">
                                This is a free adoption! Contact the owner to
                                arrange the transfer.
                              </p>
                            </div>

                            <Button
                              onClick={() =>
                                navigate("/rehoming/transfer-confirmation")
                              }
                              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold"
                            >
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Proceed to Transfer
                            </Button>
                          </>
                        )}
                      </>
                    )}

                  {/* Payment completed - Transfer pending confirmation */}
                  {!checkingRequest &&
                    myAdoptionRequest?.status === "pet_transfer_pending" && (
                      <>
                        <CheckCircle className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Transfer Confirmation Required! 🤝
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Payment of ₹{pet.price} is being held in escrow. Both
                          parties need to confirm the pet transfer.
                        </p>

                        {/* Confirmation Status */}
                        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4 mb-6">
                          <h4 className="text-blue-200 font-semibold mb-3">
                            Confirmation Status:
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-blue-200">
                                Adopter Confirmation:
                              </span>
                              {myAdoptionRequest.adopterConfirmation ? (
                                <Badge className="bg-green-900 text-green-200 border-green-700">
                                  ✓ Confirmed
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-900 text-yellow-200 border-yellow-700">
                                  ⏳ Pending
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-blue-200">
                                Pet Owner Confirmation:
                              </span>
                              {myAdoptionRequest.petOwnerConfirmation ? (
                                <Badge className="bg-green-900 text-green-200 border-green-700">
                                  ✓ Confirmed
                                </Badge>
                              ) : (
                                <Badge className="bg-yellow-900 text-yellow-200 border-yellow-700">
                                  ⏳ Pending
                                </Badge>
                              )}
                            </div>
                            <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                              <p className="text-green-200 text-sm mb-3">
                                <strong>Action Required:</strong> Have you
                                received the pet? Confirm to release payment.
                              </p>
                              <Button
                                onClick={handleAdopterConfirmation}
                                disabled={confirmingAdopterTransfer}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold"
                              >
                                {confirmingAdopterTransfer ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Confirming...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Confirm Pet Received
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-4">
                          {/* Show confirmation buttons based on user role */}
                          {user &&
                            pet.owner &&
                            user.id === myAdoptionRequest.adopterId &&
                            !myAdoptionRequest.adopterConfirmation && (
                              <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                                <p className="text-green-200 text-sm mb-3">
                                  <strong>Action Required:</strong> Have you
                                  received the pet? Confirm to release payment.
                                </p>
                                <Button
                                  onClick={handleAdopterConfirmation}
                                  disabled={confirmingAdopterTransfer}
                                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold"
                                >
                                  {confirmingAdopterTransfer ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      Confirming...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-5 h-5 mr-2" />
                                      Confirm Pet Received
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}

                          {user &&
                            pet.owner &&
                            user.id === pet.owner.id &&
                            !myAdoptionRequest.petOwnerConfirmation && (
                              <div className="bg-purple-900/30 border border-purple-600 rounded-lg p-4">
                                <p className="text-purple-200 text-sm mb-3">
                                  <strong>Action Required:</strong> Have you
                                  transferred the pet to the adopter?
                                </p>
                                <Button
                                  onClick={() => handlePetOwnerConfirmation()}
                                  disabled={confirmingOwnerTransfer}
                                  className="w-full bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800 text-white font-semibold"
                                >
                                  {confirmingOwnerTransfer ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                      Confirming...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-5 h-5 mr-2" />
                                      Confirm Pet Transferred
                                    </>
                                  )}
                                </Button>
                              </div>
                            )}

                          {/* Information for users who already confirmed */}
                          {user &&
                            myAdoptionRequest.adopterConfirmation &&
                            user.id === myAdoptionRequest.adopterId && (
                              <div className="bg-green-900/20 border border-green-600 rounded-lg p-4">
                                <p className="text-green-200 text-sm text-center">
                                  ✓ You have confirmed receiving the pet.
                                  Waiting for pet owner confirmation.
                                </p>
                              </div>
                            )}

                          {user &&
                            pet.owner &&
                            myAdoptionRequest.petOwnerConfirmation &&
                            user.id === pet.owner.id && (
                              <div className="bg-purple-900/20 border border-purple-600 rounded-lg p-4">
                                <p className="text-purple-200 text-sm text-center">
                                  ✓ You have confirmed transferring the pet.
                                  Waiting for adopter confirmation.
                                </p>
                              </div>
                            )}

                          {/* Navigation buttons */}
                          <div className="flex gap-3">
                            <Button
                              onClick={() => navigate("/rehoming/my-requests")}
                              variant="outline"
                              className="flex-1 border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                            >
                              View My Requests
                            </Button>
                            <Button
                              onClick={() => navigate("/rehoming/transactions")}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold"
                            >
                              <CreditCard className="w-5 h-5 mr-2" />
                              View Transaction
                            </Button>
                          </div>
                        </div>
                      </>
                    )}

                  {/* Pet owner verified payment - Ready for transfer */}
                  {!checkingRequest &&
                    myAdoptionRequest?.status === "payment_verified" && (
                      <>
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Payment Verified! ✅
                        </h3>
                        <p className="text-gray-300 mb-4">
                          The pet owner has verified your payment. You can now
                          proceed with the pet transfer!
                        </p>

                        <div className="bg-green-900/30 border border-green-600 rounded-lg p-4 mb-6">
                          <p className="text-green-200 text-sm mb-2">
                            <strong>Next Step:</strong> Coordinate with the pet
                            owner to arrange the physical transfer of {pet.name}
                            .
                          </p>
                          <p className="text-green-200 text-sm">
                            Your payment (₹{pet.price}) will be released to the
                            owner once both parties confirm the transfer.
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            onClick={() => navigate("/rehoming/transactions")}
                            variant="outline"
                            className="flex-1 border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                          >
                            View Transaction
                          </Button>
                          <Button
                            onClick={() =>
                              navigate("/rehoming/transfer-confirmation", {
                                state: {
                                  adoptionRequestId: myAdoptionRequest.id,
                                },
                              })
                            }
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold"
                          >
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Pet Received
                          </Button>
                        </div>
                      </>
                    )}

                  {/* Rejected adoption request */}
                  {!checkingRequest &&
                    myAdoptionRequest?.status === "rejected" && (
                      <>
                        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                          Request Not Accepted
                        </h3>
                        <p className="text-gray-300 mb-4">
                          Unfortunately, the owner decided not to proceed with
                          your adoption request for {pet.name}.
                        </p>
                        <p className="text-gray-400 text-sm mb-6">
                          Don't worry! There are many other wonderful pets
                          looking for homes.
                        </p>
                        <Button
                          onClick={() => navigate("/rehoming")}
                          className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold"
                        >
                          <Heart className="w-5 h-5 mr-2" />
                          Browse Other Pets
                        </Button>
                      </>
                    )}
                </CardContent>
              </Card>
            )}

            {/* Not Available Messages */}
            {!pet.isVerified && (
              <Card className="shadow-lg bg-gradient-to-br from-yellow-900/20 via-amber-800/20 to-yellow-900/20 border border-yellow-800/50">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Verification Pending
                  </h3>
                  <p className="text-gray-300">
                    This pet listing is currently under review. Adoption
                    requests will be available once verified.
                  </p>
                </CardContent>
              </Card>
            )}

            {pet.isAdopted && (
              <Card className="shadow-lg bg-gradient-to-br from-gray-700/20 via-gray-600/20 to-gray-700/20 border border-gray-600/50">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Already Adopted
                  </h3>
                  <p className="text-gray-300">
                    {pet.name} has found a loving home! Check out other pets
                    available for adoption.
                  </p>
                  <Button
                    onClick={() => navigate("/rehoming")}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
                  >
                    Browse Other Pets
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RehomingDetails;
