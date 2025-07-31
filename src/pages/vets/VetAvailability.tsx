import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Award, Video, MapPin, Clock, Calendar, Stethoscope } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { getAllVets, getVetAvailability, Vet, VetAvailability } from "@/controllers/vetController";
import { handleApiError } from "@/types/errors";

const VetAvailabilityScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [vet, setVet] = useState<Vet | null>(null);
  const [availability, setAvailability] = useState<VetAvailability[]>([]);
  const [selectedConsultationType, setSelectedConsultationType] = useState<"telemedicine" | "in_clinic" | "all">("all");
  const [loading, setLoading] = useState({
    vet: true,
    availability: true,
  });
  const [error, setError] = useState({
    vet: "",
    availability: "",
  });

  // Fetch vet details
  const fetchVetDetails = async () => {
    if (!id) return;
    
    try {
      setLoading(prev => ({ ...prev, vet: true }));
      setError(prev => ({ ...prev, vet: "" }));
      
      const vetsData = await getAllVets();
      const vetData = vetsData.find(v => v.id === id);
      
      if (!vetData) {
        throw new Error("Vet not found");
      }
      
      setVet(vetData);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch vet details:", err);
      const errorMessage = handleApiError(err);
      setError(prev => ({ ...prev, vet: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, vet: false }));
    }
  };

  // Fetch vet availability
  const fetchAvailability = async () => {
    if (!id) return;
    
    try {
      setLoading(prev => ({ ...prev, availability: true }));
      setError(prev => ({ ...prev, availability: "" }));
      
      const availabilityData = await getVetAvailability(id);
      setAvailability(availabilityData);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch vet availability:", err);
      const errorMessage = handleApiError(err);
      setError(prev => ({ ...prev, availability: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, availability: false }));
    }
  };

  useEffect(() => {
    if (id) {
      fetchVetDetails();
      fetchAvailability();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Generate time slots based on availability
  const generateTimeSlots = (availability: VetAvailability) => {
    const slots = [];
    const start = new Date(`2024-01-01T${availability.startTime}:00`);
    const end = new Date(`2024-01-01T${availability.endTime}:00`);
    const duration = availability.consultationDuration;
    
    while (start < end) {
      const timeString = start.toTimeString().slice(0, 5); // HH:MM format
      slots.push(timeString);
      start.setMinutes(start.getMinutes() + duration);
    }
    
    return slots;
  };

  // Group availability by day and consultation type
  // const groupedAvailability = availability.reduce((acc, item) => {
  //   const key = `${item.dayOfWeek}_${item.consultationType}`;
  //   if (!acc[key]) {
  //     acc[key] = [];
  //   }
  //   acc[key].push(item);
  //   return acc;
  // }, {} as Record<string, VetAvailability[]>);

  // Filter availability based on selected consultation type
  const filteredAvailability = selectedConsultationType === "all" 
    ? availability 
    : availability.filter(item => item.consultationType === selectedConsultationType);

  // Days of the week
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday", 
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday"
  };

  // Handle book appointment
  const handleBookAppointment = (availability: VetAvailability, timeSlot: string) => {
    navigate(`/vets/${id}/book`, {
      state: {
        vet,
        availability,
        selectedTime: timeSlot,
      }
    });
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse" />
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
              <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-24 h-5 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Error state
  if (error.vet && !loading.vet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate("/vets")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">Vet Details</h1>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Vet Not Found
              </h2>
              <p className="text-gray-600 mb-6">{error.vet}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => navigate("/vets")} variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Vets
                </Button>
                <Button onClick={fetchVetDetails}>
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
              onClick={() => navigate("/vets")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Book Appointment</h1>
              <p className="text-gray-400">Select available time slot</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {loading.vet ? (
          <LoadingSkeleton />
        ) : vet ? (
          <>
            {/* Vet Profile Card */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <div className="flex items-start gap-6">
                  <Avatar className="w-20 h-20">
                    {vet.profilePicture ? (
                      <img 
                        src={vet.profilePicture} 
                        alt={vet.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {vet.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{vet.name}</h2>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className="font-medium text-gray-700">{vet.rating}</span>
                        <span className="text-gray-500">({vet.totalReviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Award className="w-4 h-4" />
                        <span>{vet.experience} years experience</span>
                      </div>
                    </div>
                    
                    {/* Specializations */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {vet.specialization.map((spec, index) => (
                        <Badge 
                          key={index}
                          variant="secondary" 
                          className="bg-blue-100 text-blue-800"
                        >
                          {spec}
                        </Badge>
                      ))}
                    </div>

                    {/* Bio */}
                    {vet.bio && (
                      <p className="text-gray-600 mb-3">{vet.bio}</p>
                    )}

                    {/* Consultation Types */}
                    <div className="flex gap-2">
                      {vet.consultationTypes?.includes("telemedicine") && (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          <Video className="w-3 h-3 mr-1" />
                          Telemedicine
                        </Badge>
                      )}
                      {vet.consultationTypes?.includes("in_clinic") && (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          <MapPin className="w-3 h-3 mr-1" />
                          In Clinic
                        </Badge>
                      )}
                      {/* If consultationTypes is not available, show based on availability data */}
                      {!vet.consultationTypes && availability.length > 0 && (
                        <>
                          {availability.some(a => a.consultationType === "telemedicine") && (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              <Video className="w-3 h-3 mr-1" />
                              Telemedicine
                            </Badge>
                          )}
                          {availability.some(a => a.consultationType === "in_clinic") && (
                            <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                              <MapPin className="w-3 h-3 mr-1" />
                              In Clinic
                            </Badge>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Consultation Type Filter */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Select Consultation Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={selectedConsultationType === "all" ? "default" : "outline"}
                    onClick={() => setSelectedConsultationType("all")}
                    className={selectedConsultationType === "all" ? 
                      "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" : 
                      "text-gray-700 border-gray-300 hover:bg-gray-50"
                    }
                  >
                    All Types
                  </Button>
                  {/* Show telemedicine button if consultationTypes includes it OR if availability has telemedicine */}
                  {(vet.consultationTypes?.includes("telemedicine") || 
                    (!vet.consultationTypes && availability.some(a => a.consultationType === "telemedicine"))) && (
                    <Button
                      variant={selectedConsultationType === "telemedicine" ? "default" : "outline"}
                      onClick={() => setSelectedConsultationType("telemedicine")}
                      className={selectedConsultationType === "telemedicine" ? 
                        "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" : 
                        "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Telemedicine
                    </Button>
                  )}
                  {/* Show in_clinic button if consultationTypes includes it OR if availability has in_clinic */}
                  {(vet.consultationTypes?.includes("in_clinic") || 
                    (!vet.consultationTypes && availability.some(a => a.consultationType === "in_clinic"))) && (
                    <Button
                      variant={selectedConsultationType === "in_clinic" ? "default" : "outline"}
                      onClick={() => setSelectedConsultationType("in_clinic")}
                      className={selectedConsultationType === "in_clinic" ? 
                        "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700" : 
                        "text-gray-700 border-gray-300 hover:bg-gray-50"
                      }
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      In Clinic
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Availability Schedule */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Available Time Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading.availability ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
                        <div className="grid grid-cols-2 gap-2">
                          {[1, 2, 3, 4].map((j) => (
                            <div key={j} className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : error.availability ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Unable to Load Availability
                    </h3>
                    <p className="text-gray-600 mb-4">{error.availability}</p>
                    <Button onClick={fetchAvailability}>Try Again</Button>
                  </div>
                ) : filteredAvailability.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <Clock className="w-8 h-8 text-gray-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Availability Found
                    </h3>
                    <p className="text-gray-600">
                      {selectedConsultationType === "all" 
                        ? "This vet has no available time slots."
                        : `This vet has no available ${selectedConsultationType.replace('_', ' ')} slots.`
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {daysOfWeek.map((day) => {
                      const dayAvailability = filteredAvailability.filter(item => item.dayOfWeek === day);
                      
                      if (dayAvailability.length === 0) return null;

                      return (
                        <Card key={day} className="border border-gray-200 shadow-sm">
                          <CardHeader className="pb-3">
                            <h3 className="font-semibold text-gray-900">
                              {dayLabels[day as keyof typeof dayLabels]}
                            </h3>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {dayAvailability.map((avail) => (
                              <div key={avail.id} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Badge 
                                    className={avail.consultationType === "telemedicine" 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-orange-100 text-orange-800"
                                    }
                                  >
                                    {avail.consultationType === "telemedicine" ? (
                                      <Video className="w-3 h-3 mr-1" />
                                    ) : (
                                      <MapPin className="w-3 h-3 mr-1" />
                                    )}
                                    {avail.consultationType === "telemedicine" ? "Telemedicine" : "In Clinic"}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {avail.consultationDuration} min
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2">
                                  {generateTimeSlots(avail).map((timeSlot) => (
                                    <Button
                                      key={timeSlot}
                                      variant="outline"
                                      size="sm"
                                      className="text-xs hover:bg-blue-50 hover:border-blue-300"
                                      onClick={() => handleBookAppointment(avail, timeSlot)}
                                    >
                                      {timeSlot}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default VetAvailabilityScreen;
