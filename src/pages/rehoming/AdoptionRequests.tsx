import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Calendar, Check, X, Eye, Dog, Cat, Phone, Mail, AlertCircle, DollarSign, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { 
  getMyAdoptionRequests,
  updateAdoptionRequestStatus,
  AdoptionRequest 
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";

const AdoptionRequests: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  // Note: Dialog functionality commented out for now - can be enabled later
  // const [selectedRequest, setSelectedRequest] = useState<AdoptionRequest | null>(null);
  // const [showResponseDialog, setShowResponseDialog] = useState(false);
  // const [responseMessage, setResponseMessage] = useState("");

  // Fetch adoption requests
  const fetchAdoptionRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🏠 Fetching adoption requests");
      const requestsData = await getMyAdoptionRequests();
      setRequests(requestsData);
      console.log("✅ Adoption requests fetched:", requestsData);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch adoption requests:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle request response
  const handleRequestResponse = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      setActionLoading(requestId);
      
      console.log("🏠 Updating adoption request status:", { requestId, status });
      await updateAdoptionRequestStatus(requestId, { status });
      
      // Update local state
      setRequests(prev => prev.map(request => 
        request.id === requestId ? { ...request, status } : request
      ));
      
      // Success handled by controller
      console.log("✅ Adoption request status updated:", { requestId, status });
      
    } catch (err: unknown) {
      console.error("❌ Failed to update adoption request:", err);
      // Error handled by controller
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-900 text-yellow-200 border-yellow-700">
            Pending Review
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-900 text-green-200 border-green-700">
            <Check className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "pet_transfer_pending":
        return (
          <Badge className="bg-blue-900 text-blue-200 border-blue-700">
            <DollarSign className="w-3 h-3 mr-1" />
            Payment Received
          </Badge>
        );
      case "payment_verified":
        return (
          <Badge className="bg-purple-900 text-purple-200 border-purple-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Payment Verified
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-emerald-900 text-emerald-200 border-emerald-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-900 text-red-200 border-red-700">
            <X className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    fetchAdoptionRequests();
  }, [fetchAdoptionRequests]);

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
                <div className="w-48 h-6 bg-gray-700 rounded animate-pulse" />
                <div className="w-32 h-4 bg-gray-700 rounded animate-pulse mt-1" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 mb-6">
              <CardContent className="p-6">
                <div className="animate-pulse space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-700 rounded-full" />
                    <div className="flex-1">
                      <div className="w-32 h-5 bg-gray-700 rounded mb-2" />
                      <div className="w-48 h-4 bg-gray-700 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-20 bg-gray-700 rounded" />
                </div>
              </CardContent>
            </Card>
          ))}
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
              Failed to Load Adoption Requests
            </h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button 
                onClick={() => navigate("/rehoming")} 
                variant="outline"
                className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rehoming
              </Button>
              <Button 
                onClick={fetchAdoptionRequests}
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
              <h1 className="text-2xl font-bold">Adoption Requests</h1>
              <p className="text-gray-400">
                {requests.length === 0 
                  ? "No adoption requests yet" 
                  : `${requests.length} ${requests.length === 1 ? 'request' : 'requests'}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
    <div className="max-w-4xl mx-auto p-4">
      {requests.length === 0 ? (
        // Empty state
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <CardContent className="p-8 sm:p-12 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
            No Adoption Requests Yet
          </h2>
          <p className="text-gray-300 mb-8 max-w-md mx-auto text-base sm:text-lg">
            When people are interested in adopting your pets, their requests will appear here for you to review and respond to.
          </p>
          <Button
            onClick={() => navigate("/rehoming/my-pets")}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg"
          >
            View My Pet Listings
          </Button>
        </CardContent>
        </Card>
      ) : (
        // Adoption requests list
        <div className="space-y-6">
        {requests.map((request) => (
          <Card key={request.id} className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
              {/* Pet Image */}
              <div className="w-full sm:w-24 h-40 sm:h-24 rounded-lg overflow-hidden flex-shrink-0 mb-4 sm:mb-0">
                {request.pet?.imageUrls && request.pet.imageUrls.length > 0 ? (
                    <img
                        src={request.pet.imageUrls[0]}
                        alt={request.pet.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                            (e.currentTarget as HTMLImageElement).src =
                                "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80";
                        }}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        {request.pet?.species === "dog" ? (
                            <Dog className="w-8 h-8 text-gray-400" />
                        ) : (
                            <Cat className="w-8 h-8 text-gray-400" />
                        )}
                    </div>
                )}
              </div>

              {/* Request Details */}
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-white mb-1">
                    Request for {request.pet?.name || "Unknown Pet"}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    {request.pet?.breed} • {request.pet?.age} {request.pet?.age === 1 ? 'year' : 'years'} old
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(request.status)}
                </div>
                </div>

                {/* Adopter Info */}
                {request.adopter && (
                <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                      {request.adopter.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    </Avatar>
                    <div>
                    <p className="text-white font-medium text-sm sm:text-base">{request.adopter.name}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">Potential Adopter</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-200 break-all">{request.adopter.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-gray-200 break-all">{request.adopter.phone}</span>
                    </div>
                  </div>
                </div>
                )}

                {/* Message */}
                {request.message && (
                <div className="mb-4">
                  <Label className="text-gray-300 text-xs sm:text-sm font-medium">Message from adopter:</Label>
                  <div className="mt-2 bg-gray-800/30 rounded-lg p-2 sm:p-3 border-l-4 border-blue-500">
                    <p className="text-gray-200 italic text-xs sm:text-sm">"{request.message}"</p>
                  </div>
                </div>
                )}

                {/* Request Metadata */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Submitted {formatDate(request.createdAt)}</span>
                </div>

                {/* Action Buttons */}
                {request.status === "pending" && (
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Button
                    onClick={() => navigate(`/rehoming/${request.pet?.id}`)}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                    >
                    <Eye className="w-3 h-3 mr-1" />
                    View Pet
                    </Button>
                    
                    <Button
                    onClick={() => handleRequestResponse(request.id, "rejected")}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-200 bg-red-900/20 hover:bg-red-800/30"
                    disabled={actionLoading === request.id}
                    >
                    {actionLoading === request.id ? (
                      <div className="w-3 h-3 border border-red-200 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <X className="w-3 h-3 mr-1" />
                        Decline
                      </>
                    )}
                    </Button>
                    
                    <Button
                    onClick={() => handleRequestResponse(request.id, "accepted")}
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-200 bg-green-900/20 hover:bg-green-800/30"
                    disabled={actionLoading === request.id}
                    >
                    {actionLoading === request.id ? (
                      <div className="w-3 h-3 border border-green-200 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Accept
                      </>
                    )}
                    </Button>
                  </div>
                )}
                
                {/* Actions for Accepted Requests - Pet Owner View */}
                {request.status === "accepted" && (
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <Button
                    onClick={() => navigate("/rehoming/transactions")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Check Payment Status
                    </Button>
                    
                    <Button
                    onClick={() => navigate("/rehoming/transfer-confirmation")}
                    variant="outline"
                    size="sm"
                    className="border-yellow-600 text-yellow-200 bg-yellow-900/20 hover:bg-yellow-800/30"
                    >
                    📋 View Transfer Status
                    </Button>
                  </div>
                )}

                {/* Actions for Payment Completed - Pet Owner Needs to Verify */}
                {request.status === "pet_transfer_pending" && (
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <div className="bg-green-900/30 border border-green-600 rounded-lg p-3 mb-2">
                      <p className="text-green-200 text-sm font-medium">
                        💰 Payment Received! Adopter paid ₹{request.pet?.price || 0}
                      </p>
                      <p className="text-green-200 text-xs mt-1">
                        Please verify the payment and proceed with pet transfer arrangements.
                      </p>
                    </div>
                    
                    <Button
                    onClick={() => navigate("/rehoming/transactions")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                    >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verify Payment
                    </Button>
                    
                    <Button
                    onClick={() => navigate("/rehoming/transfer-confirmation")}
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-200 bg-blue-900/20 hover:bg-blue-800/30"
                    >
                    📋 Setup Transfer
                    </Button>
                  </div>
                )}

                {/* Actions for Payment Verified - Ready for Transfer */}
                {request.status === "payment_verified" && (
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3 mb-2">
                      <p className="text-blue-200 text-sm font-medium">
                        ✅ Payment Verified - Ready for Transfer
                      </p>
                      <p className="text-blue-200 text-xs mt-1">
                        Coordinate with adopter to complete the pet transfer.
                      </p>
                    </div>
                    
                    <Button
                    onClick={() => navigate("/rehoming/transfer-confirmation")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="sm"
                    >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Confirm Transfer
                    </Button>
                    
                    <Button
                    onClick={() => navigate("/rehoming/transactions")}
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                    >
                    💰 View Transaction
                    </Button>
                  </div>
                )}
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        ))}
        </div>
      )}
    </div>
    </div>
  );
};

export default AdoptionRequests;
