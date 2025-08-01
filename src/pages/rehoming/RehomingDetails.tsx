import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Verified, Phone, Mail, User, Calendar, Dog, Cat, MessageSquare, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
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
  RehomingPet 
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";

const RehomingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State management
  const [pet, setPet] = useState<RehomingPet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdoptionForm, setShowAdoptionForm] = useState(false);
  const [adoptionMessage, setAdoptionMessage] = useState("");
  const [submittingAdoption, setSubmittingAdoption] = useState(false);

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
    fetchPetDetails();
  }, [fetchPetDetails]);

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
              <p className="text-gray-400">{pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
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
                            onError={e => {
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
                                            index === currentImageIndex ? "bg-white" : "bg-white/50"
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
                  {pet.species === "dog" ? <Dog className="w-6 h-6 text-blue-400" /> : <Cat className="w-6 h-6 text-purple-400" />}
                  Pet Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Species</p>
                    <p className="text-white font-medium capitalize">{pet.species}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Breed</p>
                    <p className="text-white font-medium">{pet.breed}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Age</p>
                    <p className="text-white font-medium">{pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
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
                  <p className="text-gray-200 leading-relaxed">{pet.description}</p>
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
                        {pet.owner.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    </Avatar>
                    <div>
                      <p className="text-white font-semibold">{pet.owner.name}</p>
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

            {/* Adoption CTA */}
            {pet.isVerified && !pet.isAdopted && (
              <Card className="shadow-lg bg-gradient-to-br from-green-900/20 via-emerald-800/20 to-green-900/20 border border-green-800/50">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Interested in Adopting {pet.name}?
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Send an adoption request to the owner with a personal message about why you'd be a great fit!
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
                        <Label htmlFor="adoptionMessage" className="text-gray-200 font-medium">
                          Your Message to the Owner *
                        </Label>
                        <Textarea
                          id="adoptionMessage"
                          value={adoptionMessage}
                          onChange={(e) => setAdoptionMessage(e.target.value)}
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
                          disabled={submittingAdoption || !adoptionMessage.trim()}
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
                    This pet listing is currently under review. Adoption requests will be available once verified.
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
                    {pet.name} has found a loving home! Check out other pets available for adoption.
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
