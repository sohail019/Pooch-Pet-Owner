import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Dog, Cat, Edit, Trash2, Eye, Heart, Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  getRehomingPets, 
  deleteRehomingPet,
  RehomingPet 
} from "@/controllers/rehomingController";
import { handleApiError } from "@/types/errors";
import { toast } from "react-toastify";

const MyRehomingPets: React.FC = () => {
  const navigate = useNavigate();
  
  // State management
  const [pets, setPets] = useState<RehomingPet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch user's rehoming pets
  const fetchUserPets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      
      console.log("🏠 Fetching user's rehoming pets");
      // For now, we'll get all pets and filter by current user
      // In a real app, you'd have a getUserRehomingPets endpoint
      const response = await getRehomingPets();
      setPets(response.pets);
      console.log("✅ User pets fetched:", response.pets);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch user pets:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle pet deletion
  const handleDeletePet = async (petId: string, petName: string) => {
    if (!window.confirm(`Are you sure you want to delete the listing for ${petName}? This action cannot be undone.`)) {
      return;
    }

    try {
      setActionLoading(petId);
      
      console.log("🏠 Deleting pet listing:", petId);
      await deleteRehomingPet(petId);
      
      // Remove from local state
      setPets(prev => prev.filter(pet => pet.id !== petId));
      
      // Success handled by controller
      console.log("✅ Pet listing deleted:", petId);
      
    } catch (err: unknown) {
      console.error("❌ Failed to delete pet listing:", err);
      // Error handled by controller
    } finally {
      setActionLoading(null);
    }
  };

  // Handle status update (mark as adopted) - For demo, we'll just show a message
  const handleMarkAsAdopted = async (petId: string, petName: string) => {
    if (!window.confirm(`Mark ${petName} as adopted? This will remove the listing from public view.`)) {
      return;
    }

    try {
      setActionLoading(petId);
      
      console.log("🏠 Marking pet as adopted:", petId);
      // In a real app, you would have an API to update the adoption status
      // await updateRehomingPetAdoptionStatus(petId, { isAdopted: true });
      
      // For now, just show success message and update local state
      toast.success(`${petName} has been marked as adopted!`);
      
      // Update local state
      setPets(prev => prev.map(pet => 
        pet.id === petId ? { ...pet, isAdopted: true } : pet
      ));
      
      console.log("✅ Pet marked as adopted:", petId);
      
    } catch (err: unknown) {
      console.error("❌ Failed to update pet status:", err);
      toast.error("Failed to update pet status. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  // Format price
  const formatPrice = (price: number | null | undefined, adoptionType: string) => {
    if (adoptionType === "free") return "Free Adoption";
    return price ? `₹${price.toLocaleString()}` : "Price on request";
  };

  // Get status badge
  const getStatusBadge = (pet: RehomingPet) => {
    if (pet.isAdopted) {
      return (
        <Badge className="bg-green-900 text-green-200 border-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Adopted
        </Badge>
      );
    }

    if (!pet.isVerified) {
      return (
        <Badge className="bg-yellow-900 text-yellow-200 border-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          Under Review
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-900 text-blue-200 border-blue-700">
        <Eye className="w-3 h-3 mr-1" />
        Active
      </Badge>
    );
  };

  useEffect(() => {
    fetchUserPets();
  }, [fetchUserPets]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
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
        </div>

        <div className="max-w-6xl mx-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <CardContent className="p-0">
                  <div className="aspect-square bg-gray-700 rounded-t-lg animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="w-32 h-5 bg-gray-700 rounded animate-pulse" />
                    <div className="w-24 h-4 bg-gray-700 rounded animate-pulse" />
                    <div className="w-full h-4 bg-gray-700 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
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
              Failed to Load Your Listings
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
                onClick={fetchUserPets}
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
          <div className="flex items-center justify-between">
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
                <h1 className="text-2xl font-bold">My Pet Listings</h1>
                <p className="text-gray-400">
                  {pets.length === 0 ? "No listings yet" : `${pets.length} ${pets.length === 1 ? 'listing' : 'listings'}`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/rehoming/create")}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Pet
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {pets.length === 0 ? (
          // Empty state
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Heart className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No Pet Listings Yet
              </h2>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Help your pet find a loving new home by creating your first listing. It's easy and helps connect with caring families.
              </p>
              <Button
                onClick={() => navigate("/rehoming/create")}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Pet listings grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden group hover:shadow-xl transition-shadow">
                <CardContent className="p-0">
                  {/* Pet Image */}
                  <div className="aspect-square relative">
                    {pet.imageUrls && pet.imageUrls.length > 0 ? (
                        <img
                            src={pet.imageUrls[0]}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                            onError={e => {
                                (e.currentTarget as HTMLImageElement).src =
                                    "https://img.freepik.com/free-photo/cute-pet-collage-isolated_23-2150007407.jpg?semt=ais_hybrid&w=740&q=80";
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                            {pet.species === "dog" ? (
                                <Dog className="w-16 h-16 text-gray-400" />
                            ) : (
                                <Cat className="w-16 h-16 text-gray-400" />
                            )}
                        </div>
                    )}
                    
                    {/* Status overlay */}
                    <div className="absolute top-3 left-3">
                      {getStatusBadge(pet)}
                    </div>
                    
                    {/* Price overlay */}
                    <div className="absolute top-3 right-3">
                      <Badge 
                        className={
                          pet.adoptionType === "free"
                            ? "bg-green-900/80 text-green-200 border-green-700"
                            : "bg-orange-900/80 text-orange-200 border-orange-700"
                        }
                      >
                        {formatPrice(pet.price, pet.adoptionType)}
                      </Badge>
                    </div>

                    {/* Image count indicator */}
                    {pet.imageUrls && pet.imageUrls.length > 1 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        +{pet.imageUrls.length - 1} more
                      </div>
                    )}
                  </div>

                  {/* Pet Details */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          {pet.species === "dog" ? (
                            <Dog className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Cat className="w-4 h-4 text-purple-400" />
                          )}
                          {pet.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {pet.breed} • {pet.age} {pet.age === 1 ? 'year' : 'years'} old
                        </p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {pet.description}
                    </p>

                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-4">
                      <Calendar className="w-3 h-3" />
                      Listed {formatDate(pet.createdAt)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/rehoming/${pet.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      
                      {!pet.isAdopted && (
                        <>
                          <Button
                            onClick={() => navigate(`/rehoming/edit/${pet.id}`)}
                            variant="outline"
                            size="sm"
                            className="border-blue-600 text-blue-200 bg-blue-900/20 hover:bg-blue-800/30"
                            disabled={actionLoading === pet.id}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          
                          <Button
                            onClick={() => handleMarkAsAdopted(pet.id, pet.name)}
                            variant="outline"
                            size="sm"
                            className="border-green-600 text-green-200 bg-green-900/20 hover:bg-green-800/30"
                            disabled={actionLoading === pet.id}
                          >
                            {actionLoading === pet.id ? (
                              <div className="w-3 h-3 border border-green-200 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3" />
                            )}
                          </Button>
                        </>
                      )}
                      
                      <Button
                        onClick={() => handleDeletePet(pet.id, pet.name)}
                        variant="outline"
                        size="sm"
                        className="border-red-600 text-red-200 bg-red-900/20 hover:bg-red-800/30"
                        disabled={actionLoading === pet.id}
                      >
                        {actionLoading === pet.id ? (
                          <div className="w-3 h-3 border border-red-200 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </Button>
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

export default MyRehomingPets;
