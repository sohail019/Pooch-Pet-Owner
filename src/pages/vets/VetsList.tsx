import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Award, Video, MapPin, Stethoscope } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { getAllVets, Vet } from "@/controllers/vetController";
import { handleApiError } from "@/types/errors";

const VetsList: React.FC = () => {
  const navigate = useNavigate();
  const [vets, setVets] = useState<Vet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all vets
  const fetchVets = async () => {
    try {
      setLoading(true);
      setError("");
      
      const vetsData = await getAllVets();
      console.log("✅ Vets fetched:", vetsData);
      
      // Ensure vetsData is an array
      const vetsArray = Array.isArray(vetsData) ? vetsData : [];
      setVets(vetsArray);
      console.log("✅ Vets loaded:", vetsArray.length);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch vets:", err);
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVets();
  }, []);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-5 bg-gray-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (error && !loading) {
    return (
      <div className="min-h-screen p-4">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">Find a Veterinarian</h1>
              <p className="text-gray-400">Connect with certified veterinarians</p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                Unable to Load Veterinarians
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/")} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button onClick={fetchVets}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
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
              onClick={() => navigate("/")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Find a Veterinarian</h1>
              <p className="text-gray-400">Connect with certified veterinarians</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {loading ? (
          <LoadingSkeleton />
        ) : !Array.isArray(vets) || vets.length === 0 ? (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-2">
                No Veterinarians Available
              </h2>
              <p className="text-gray-400">
                We're working to add more veterinarians to our platform. Please check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-6">
              <p className="text-gray-400">
                Found {Array.isArray(vets) ? vets.length : 0} veterinarian{(Array.isArray(vets) ? vets.length : 0) !== 1 ? 's' : ''} available
              </p>
            </div>

            {/* Vets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.isArray(vets) && vets.map((vet) => (
                <Card
                    key={vet.id}
                    className="border-0 shadow-xl bg-gradient-to-br from-white via-gray-50 to-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.03] rounded-2xl overflow-hidden group"
                    onClick={() => navigate(`/vets/${vet.id}`)}
                >
                    <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                            <Avatar className="w-16 h-16 ring-2 ring-blue-400 group-hover:ring-indigo-500 transition-all duration-200">
                                {vet.profilePicture ? (
                                    <img
                                        src={vet.profilePicture}
                                        alt={vet.name}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg rounded-full">
                                        {vet.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                )}
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-indigo-700 transition-colors duration-200">
                                    {vet.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-semibold text-gray-700">
                                            {typeof vet.rating === 'string' ? parseFloat(vet.rating) || 0 : vet.rating}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        ({vet.totalReviews} reviews)
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Award className="w-3 h-3 text-indigo-500" />
                                    <span>{vet.experience} yrs experience</span>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-0">
                        {/* Specializations */}
                        <div>
                            <div className="flex flex-wrap gap-2">
                                {vet.specialization.slice(0, 2).map((spec, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full"
                                    >
                                        {spec}
                                    </Badge>
                                ))}
                                {vet.specialization.length > 2 && (
                                    <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 px-2 py-1 rounded-full">
                                        +{vet.specialization.length - 2} more
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Bio */}
                        {vet.bio && (
                            <p className="text-sm text-gray-700 line-clamp-2 italic">
                                {vet.bio}
                            </p>
                        )}

                        {/* Consultation Types */}
                        <div className="flex gap-2 flex-wrap">
                            {vet.consultationTypes?.includes("telemedicine") && (
                                <Badge className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                                    <Video className="w-3 h-3 mr-1" />
                                    Telemedicine
                                </Badge>
                            )}
                            {vet.consultationTypes?.includes("in_clinic") && (
                                <Badge className="bg-orange-50 text-orange-700 border border-orange-200 px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    In Clinic
                                </Badge>
                            )}
                            {/* If no consultation types, show default */}
                            {(!vet.consultationTypes || vet.consultationTypes.length === 0) && (
                                <Badge className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-1 rounded-full flex items-center gap-1 font-medium">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    Available for Consultation
                                </Badge>
                            )}
                        </div>

                        {/* Verification Status */}
                        {vet.isVerified && (
                            <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                <Award className="w-3 h-3" />
                                <span>Verified Veterinarian</span>
                            </div>
                        )}

                        {/* Book Button */}
                        <Button
                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2 rounded-xl shadow-md mt-2 transition-all duration-200"
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/vets/${vet.id}`);
                            }}
                        >
                            View Availability
                        </Button>
                    </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VetsList;
