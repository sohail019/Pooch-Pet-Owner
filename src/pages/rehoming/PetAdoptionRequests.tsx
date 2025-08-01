import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Calendar, Check, X, Mail, Phone, User, MessageSquare, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { 
  getAdoptionRequestsForPet,
  getRehomingPetById,
  updateAdoptionRequestStatus,
  AdoptionRequest,
  RehomingPet,
  getAdoptionStatusDisplay
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";
import { toast } from "react-toastify";

const PetAdoptionRequests: React.FC = () => {
  const { petId } = useParams<{ petId: string }>();
  const navigate = useNavigate();
  
  // State management
  const [pet, setPet] = useState<RehomingPet | null>(null);
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Load pet details and adoption requests
  useEffect(() => {
    const loadData = async () => {
      if (!petId) {
        setError("Pet ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        // Load pet details and adoption requests in parallel
        const [petData, requestsData] = await Promise.all([
          getRehomingPetById(petId),
          getAdoptionRequestsForPet(petId)
        ]);

        setPet(petData);
        setRequests(Array.isArray(requestsData) ? requestsData : []);

      } catch (err) {
        console.error("Failed to load pet adoption requests:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [petId]);

  // Handle request response
  const handleRequestResponse = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      setActionLoading(requestId);

      await updateAdoptionRequestStatus(requestId, { status });

      // Update local state
      setRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status, updatedAt: new Date().toISOString() }
            : request
        )
      );

      toast.success(`Adoption request ${status} successfully!`);

    } catch (err) {
      console.error(`Failed to ${status} adoption request:`, err);
      toast.error(handleApiError(err));
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-6xl mx-auto pt-20">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-6xl mx-auto pt-20">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Pet Information</h2>
              <p className="text-gray-400 mb-6">{error || "Pet not found"}</p>
              <Button
                onClick={() => navigate("/rehoming/my-pets")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg transition-all duration-200"
                size="lg"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to My Pets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-6xl mx-auto pt-20">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate("/rehoming/my-pets")}
              className="flex items-center px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-800 via-purple-800 to-blue-800 text-white font-semibold shadow-lg hover:from-blue-900 hover:to-purple-900 hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="tracking-wide">Back to My Pets</span>
            </Button>
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center gap-3">
                <span className="relative flex h-12 w-12">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-12 w-12 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 items-center justify-center">
                    <Heart className="w-7 h-7 text-white drop-shadow-lg" />
                  </span>
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg tracking-tight">
                  Adoption Requests
                </h1>
              </div>
              <p className="text-gray-300 mt-1 text-lg md:text-xl font-medium">
                Manage adoption requests for{" "}
                <span className="text-blue-400 font-semibold underline decoration-pink-400/60 underline-offset-4">
                  {pet.name}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-row md:flex-col items-start md:items-end space-x-3 md:space-x-0 md:space-y-2 w-full md:w-auto mt-4 md:mt-0">
            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-base font-semibold shadow">
              {pet.adoptionType === "paid" ? "Paid Adoption" : "Free Adoption"}
            </Badge>
            {pet.price && (
              <span className="bg-green-700/80 text-green-200 px-4 py-2 rounded-full font-bold text-lg shadow">
            ${pet.price}
              </span>
            )}
          </div>
        </div>
        </div>

        {/* Pet Overview */}
        <Card className="bg-gray-800 border-gray-700 mb-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-6">
              <img
                src={
                  pet.imageUrls && pet.imageUrls.length > 0
                    ? pet.imageUrls[0]
                    : "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80"
                }
                alt={pet.name}
                className="w-24 h-24 rounded-lg object-cover"
                onError={e => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80";
                }}
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">{pet.name}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Species:</span>
                    <p className="text-white capitalize">{pet.species}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Breed:</span>
                    <p className="text-white">{pet.breed}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Age:</span>
                    <p className="text-white">{pet.age} years old</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Adoption Type:</span>
                    <p className="text-white capitalize">{pet.adoptionType}</p>
                  </div>
                </div>
                {pet.price && (
                  <div className="mt-2">
                    <span className="text-gray-400">Price:</span>
                    <p className="text-green-400 font-semibold">${pet.price}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Adoption Requests */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Adoption Requests ({requests.length})
            </h2>
          </div>

          {requests.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Adoption Requests Yet</h3>
                <p className="text-gray-400 mb-6">
                  No one has requested to adopt {pet.name} yet. Make sure your pet listing is complete and attractive to potential adopters.
                </p>
                <Button 
                  onClick={() => navigate(`/rehoming/${pet.id}`)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  View Pet Listing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Adopter Info */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <Avatar className="w-12 h-12">
                            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {request.adopter?.name?.split(' ').map(n => n[0]).join('') || 'A'}
                            </div>
                          </Avatar>
                          <div>
                            <h3 className="text-lg font-semibold text-white">
                              {request.adopter?.name || 'Unknown Adopter'}
                            </h3>
                            <p className="text-gray-400 text-sm">Potential Adopter</p>
                          </div>
                          <div className="ml-auto">
                            <Badge className={getAdoptionStatusDisplay(request.status).color}>
                              {getAdoptionStatusDisplay(request.status).label}
                            </Badge>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-200 text-sm">
                              {request.adopter?.email || 'Email not available'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-green-400" />
                            <span className="text-gray-200 text-sm">
                              {request.adopter?.phone || 'Phone not available'}
                            </span>
                          </div>
                        </div>

                        {/* Message */}
                        {request.message && (
                          <div className="mb-4">
                            <Label className="text-gray-300 text-sm font-medium">Message from adopter:</Label>
                            <div className="mt-2 bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                              <p className="text-gray-200 italic">"{request.message}"</p>
                            </div>
                          </div>
                        )}

                        {/* Request Metadata */}
                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>Submitted {formatDate(request.createdAt)}</span>
                          </div>
                          {request.status !== "pending" && (
                            <div className="flex items-center space-x-1">
                              <User className="w-4 h-4" />
                              <span>Updated {formatDate(request.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {request.status === "pending" && (
                        <div className="flex flex-col space-y-3 lg:min-w-[200px]">
                          <Button
                            onClick={() => handleRequestResponse(request.id, "accepted")}
                            disabled={actionLoading === request.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {actionLoading === request.id ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Processing...
                              </div>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Accept Request
                              </>
                            )}
                          </Button>
                          
                          <Button
                            onClick={() => handleRequestResponse(request.id, "rejected")}
                            disabled={actionLoading === request.id}
                            variant="outline"
                            className="border-red-600 text-red-200 bg-red-900/20 hover:bg-red-800/30"
                          >
                            {actionLoading === request.id ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-200 mr-2"></div>
                                Processing...
                              </div>
                            ) : (
                              <>
                                <X className="w-4 h-4 mr-2" />
                                Decline Request
                              </>
                            )}
                          </Button>
                        </div>
                      )}

                      {/* Owner Actions for Accepted Requests */}
                      {request.status === "accepted" && pet.adoptionType === "paid" && (
                        <div className="flex flex-col space-y-3 lg:min-w-[200px]">
                          <Button
                            onClick={() => navigate("/rehoming/transactions")}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            � Check Payment Status
                          </Button>
                          
                          <Button
                            onClick={() => navigate("/rehoming/transfer-confirmation")}
                            variant="outline"
                            className="border-yellow-600 text-yellow-200 bg-yellow-900/20 hover:bg-yellow-800/30"
                          >
                            📋 Transfer Status
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Help Section */}
        <Card className="bg-blue-900/20 border-blue-700 mt-8">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <MessageSquare className="w-6 h-6 text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-blue-300 font-medium">Managing Adoption Requests</h3>
                <p className="text-blue-200 text-sm mt-1">
                  Review each adoption request carefully. Contact the adopter if you need more information before making a decision. 
                  Once you accept a request, you can proceed with payment processing (for paid adoptions) and transfer arrangements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default PetAdoptionRequests;
