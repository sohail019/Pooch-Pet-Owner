import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Calendar, CreditCard, Clock, Check, AlertCircle, Eye, Dog, Cat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  getMyAdoptionRequestsAsAdopter,
  AdoptionRequest,
  getAdoptionStatusDisplay
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";

const MyAdoptionRequests: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load adoption requests
  useEffect(() => {
    const loadAdoptionRequests = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("🏠 Fetching my adoption requests as adopter...");
        
        // This endpoint should return requests where current user is the adopter
        const requestsData = await getMyAdoptionRequestsAsAdopter();
        
        // Filter requests where current user is adopter (not pet owner)
        // In a real app, the API should handle this filtering
        setRequests(Array.isArray(requestsData) ? requestsData : []);

      } catch (err) {
        console.error("Failed to load adoption requests:", err);
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    loadAdoptionRequests();
  }, []);

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

  // Get status-specific message
  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your adoption request is being reviewed by the pet owner.";
      case "accepted":
        return "Great news! Your adoption request has been accepted. Please proceed with payment.";
      case "rejected":
        return "Unfortunately, your adoption request was not accepted. Keep looking for other pets!";
      default:
        return "";
    }
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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
        <div className="max-w-6xl mx-auto pt-20">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">Unable to Load Your Requests</h2>
              <p className="text-gray-400 mb-6">{error}</p>
              <Button 
                onClick={() => navigate("/rehoming")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rehoming
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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/rehoming")}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rehoming
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-white">My Adoption Requests</h1>
              <p className="text-gray-400">Track your adoption requests and manage payments</p>
            </div>
          </div>
        </div>

        {/* Adoption Requests */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-12 text-center">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Adoption Requests Yet</h3>
                <p className="text-gray-400 mb-6">
                  You haven't requested to adopt any pets yet. Browse available pets and send adoption requests to get started.
                </p>
                <Button 
                  onClick={() => navigate("/rehoming")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Browse Available Pets
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* Pet Information */}
                      <div className="flex-1">
                        <div className="flex items-start space-x-4 mb-4">
                          {/* Pet Image */}
                          {request.pet?.imageUrls && request.pet.imageUrls.length > 0 && (
                            <img
                              src={request.pet.imageUrls[0]}
                              alt={request.pet.name}
                              className="w-20 h-20 rounded-lg object-cover"
                            />
                          )}
                          
                          {/* Pet Details */}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
                                {request.pet?.species === "dog" ? (
                                  <Dog className="w-5 h-5 text-blue-400" />
                                ) : (
                                  <Cat className="w-5 h-5 text-purple-400" />
                                )}
                                <span>{request.pet?.name || 'Unknown Pet'}</span>
                              </h3>
                              <Badge className={getAdoptionStatusDisplay(request.status).color}>
                                {getAdoptionStatusDisplay(request.status).label}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                              <div>
                                <span className="text-gray-400">Breed:</span>
                                <p className="text-gray-200">{request.pet?.breed || 'Unknown'}</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Age:</span>
                                <p className="text-gray-200">{request.pet?.age} years old</p>
                              </div>
                              <div>
                                <span className="text-gray-400">Adoption Type:</span>
                                <p className="text-gray-200 capitalize">{request.pet?.adoptionType}</p>
                              </div>
                              {request.pet?.price && (
                                <div>
                                  <span className="text-gray-400">Price:</span>
                                  <p className="text-green-400 font-semibold">₹{request.pet.price}</p>
                                </div>
                              )}
                            </div>

                            {/* Pet Owner */}
                            <div className="text-sm text-gray-400 mb-3">
                              <span>Owner: </span>
                              <span className="text-gray-200">{request.pet?.owner?.name || 'Unknown'}</span>
                            </div>

                            {/* Status Message */}
                            <div className="bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500 mb-3">
                              <p className="text-gray-200 text-sm">{getStatusMessage(request.status)}</p>
                            </div>

                            {/* Your Message */}
                            {request.message && (
                              <div className="mb-3">
                                <Label className="text-gray-300 text-sm font-medium">Your message:</Label>
                                <div className="mt-1 bg-gray-700 rounded-lg p-3 border-l-4 border-green-500">
                                  <p className="text-gray-200 italic text-sm">"{request.message}"</p>
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
                                  <Clock className="w-4 h-4" />
                                  <span>Updated {formatDate(request.updatedAt)}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col space-y-3 lg:min-w-[200px]">
                        {/* View Pet Details */}
                        <Button
                          onClick={() => navigate(`/rehoming/${request.pet?.id}`)}
                          variant="outline"
                          className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Pet Details
                        </Button>

                        {/* Payment Button for Accepted Paid Adoptions */}
                        {request.status === "accepted" && request.pet?.adoptionType === "paid" && (
                          <Button
                            onClick={() => navigate(`/rehoming/payment/${request.id}`)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Pay ₹{request.pet.price}
                          </Button>
                        )}

                        {/* Transfer Status for Accepted Requests */}
                        {request.status === "accepted" && (
                          <Button
                            onClick={() => navigate("/rehoming/transfer-confirmation")}
                            variant="outline"
                            className="border-yellow-600 text-yellow-200 bg-yellow-900/20 hover:bg-yellow-800/30"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Transfer Status
                          </Button>
                        )}
                      </div>
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
              <Heart className="w-6 h-6 text-blue-400 mt-0.5" />
              <div>
                <h3 className="text-blue-300 font-medium">Adoption Process</h3>
                <p className="text-blue-200 text-sm mt-1">
                  After your adoption request is accepted, you'll need to complete payment (for paid adoptions) and then confirm the pet transfer. 
                  Once both you and the pet owner confirm the transfer, the process will be complete!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyAdoptionRequests;
