import React, { useEffect, useState, useCallback } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, User, Calendar, Clock, MessageSquare, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RootState } from "@/redux/store";
import { bookAppointment, BookAppointmentPayload, Vet, VetAvailability } from "@/controllers/vetController";
import { fetchPets } from "@/controllers/pet/petController";
import { Pet } from "@/redux/slices/petsSlice";
import { handleApiError } from "@/types/errors";

// Validation schema
const bookingSchema = z.object({
  petId: z.string().min(1, "Please select a pet"),
  appointmentDate: z.string().min(1, "Please select an appointment date"),
  startTime: z.string().min(1, "Please select a start time"),
  consultationType: z.enum(["telemedicine", "in_clinic"]),
  reason: z.string().min(10, "Reason must be at least 10 characters"),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface LocationState {
  vet: Vet;
  availability: VetAvailability;
  selectedTime: string;
}

const BookAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  
  // Redux state
  const reduxPets = useSelector((state: RootState) => state.pets.pets);

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Local state
  const [pets, setPets] = useState<Pet[]>([]);
  const [petDropdownOpen, setPetDropdownOpen] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    petId: "",
    appointmentDate: "",
    startTime: state?.selectedTime || "",
    consultationType: (state?.availability?.consultationType as "telemedicine" | "in_clinic") || "telemedicine",
    reason: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState({
    pets: true,
    booking: false,
  });
  const [error, setError] = useState({
    pets: "",
    booking: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Fetch pets for selection
  const fetchPetsData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, pets: true }));
      setError(prev => ({ ...prev, pets: "" }));
      
      // Try to use Redux pets first
      if (reduxPets && Array.isArray(reduxPets) && reduxPets.length > 0) {
        setPets(reduxPets);
        if (reduxPets.length === 1) {
          setFormData(prev => ({ ...prev, petId: reduxPets[0].id }));
        }
        setLoading(prev => ({ ...prev, pets: false }));
        return;
      }

      // Fetch from API if Redux is empty
      console.log("🐕 Fetching pets for appointment booking...");
      const petsData = await fetchPets();
      const petsArray = Array.isArray(petsData) ? petsData : petsData?.pets || [];
      setPets(petsArray);
      
      // Auto-select if only one pet
      if (Array.isArray(petsArray) && petsArray.length === 1) {
        setFormData(prev => ({ ...prev, petId: petsArray[0].id }));
      }
      
      console.log("✅ Pets fetched for selection:", petsArray.length);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch pets:", err);
      const errorMessage = handleApiError(err);
      setError(prev => ({ ...prev, pets: errorMessage }));
    } finally {
      setLoading(prev => ({ ...prev, pets: false }));
    }
  }, [reduxPets]);

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle form input changes
  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      bookingSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          if (issue.path && issue.path.length > 0) {
            newErrors[issue.path[0] as string] = issue.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    if (!id) {
      toast.error("Vet ID is required");
      return;
    }

    try {
      setLoading(prev => ({ ...prev, booking: true }));
      setError(prev => ({ ...prev, booking: "" }));

      const appointmentData: BookAppointmentPayload = {
        petId: formData.petId,
        appointmentDate: formData.appointmentDate,
        startTime: formData.startTime,
        consultationType: formData.consultationType,
        reason: formData.reason,
        notes: formData.notes || undefined,
      };

      console.log("📅 Booking appointment:", appointmentData);
      const result = await bookAppointment(id, appointmentData);
      
      console.log("✅ Appointment booked successfully:", result);
      toast.success("Appointment booked successfully!");
      setBookingSuccess(true);

      // Auto-redirect after showing success
      setTimeout(() => {
        navigate("/my-appointments", { replace: true });
      }, 3000);

    } catch (err: unknown) {
      console.error("❌ Failed to book appointment:", err);
      const errorMessage = handleApiError(err);
      setError(prev => ({ ...prev, booking: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setLoading(prev => ({ ...prev, booking: false }));
    }
  };

  useEffect(() => {
    fetchPetsData();
  }, [fetchPetsData]);

  // Redirect if no state provided
  if (!state || !state.vet || !state.availability) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Invalid Access
              </h2>
              <p className="text-gray-600 mb-6">
                Please select a time slot from the vet's availability page.
              </p>
              <Button onClick={() => navigate("/vets")} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Vets
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { vet, availability, selectedTime } = state;

  // Success state
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Appointment Booked Successfully! 🎉
              </h2>
              <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 font-medium">{vet.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900">{formData.appointmentDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900">{formData.startTime}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-900 capitalize">{formData.consultationType.replace('_', ' ')}</span>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                A WhatsApp notification has been sent to the vet. You will receive a confirmation shortly.
              </p>
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => navigate("/")} 
                  variant="outline"
                  className="text-gray-700 border-gray-300"
                >
                  Back to Home
                </Button>
                <Button 
                  onClick={() => navigate("/my-appointments")}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  View My Appointments
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate(`/vets/${id}`)}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Book Appointment</h1>
              <p className="text-gray-400">Schedule your consultation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Vet Summary Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
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
              <div>
            <h2 className="text-xl font-bold text-white">{vet.name}</h2>
            <p className="text-gray-300">{vet.specialization.join(", ")}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                className={
                  availability.consultationType === "telemedicine"
                ? "bg-green-800 text-green-100"
                : "bg-orange-800 text-orange-100"
                }
              >
                {availability.consultationType === "telemedicine" ? "Telemedicine" : "In Clinic"}
              </Badge>
              <span className="text-sm text-gray-400">
                {availability.consultationDuration} minutes
              </span>
            </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Booking Form */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              Appointment Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Pet Selection */}
              <div className="space-y-2">
            <Label htmlFor="petId" className="text-gray-200 font-medium">
              Select Pet *
            </Label>
            {loading.pets ? (
              <div className="w-full h-12 bg-gray-700 rounded-lg animate-pulse" />
            ) : error.pets ? (
              <div className="p-4 border border-red-400 rounded-lg bg-red-900/30">
                <div className="flex items-center gap-2 text-red-300 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error.pets}
                </div>
              </div>
            ) : pets.length === 0 ? (
              <div className="text-center py-4 border border-gray-700 rounded-lg bg-gray-800">
                <p className="text-gray-300 mb-2">No pets found</p>
                <Button
                  type="button"
                  onClick={() => navigate("/add-pet")}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-200"
                >
                  Add Pet
                </Button>
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setPetDropdownOpen(!petDropdownOpen)}
                  className={`w-full p-3 border rounded-lg flex items-center justify-between bg-gray-800 hover:border-blue-500 transition-colors ${
                errors.petId ? "border-red-400 bg-red-900/30" : "border-gray-700"
                  }`}
                >
                  {formData.petId ? (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center text-white font-medium">
                      {pets.find((p) => p.id === formData.petId)?.name.charAt(0)}
                    </div>
                  </Avatar>
                  <div className="text-left">
                    <div className="font-medium text-white">
                      {pets.find((p) => p.id === formData.petId)?.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {pets.find((p) => p.id === formData.petId)?.species} • {calculateAge(pets.find((p) => p.id === formData.petId)?.dateOfBirth || "")} years
                    </div>
                  </div>
                </div>
                  ) : (
                <span className="text-gray-400">Select a pet</span>
                  )}
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${petDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {petDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    type="button"
                    onClick={() => {
                      handleInputChange("petId", pet.id);
                      setPetDropdownOpen(false);
                    }}
                    className="w-full p-3 text-left hover:bg-gray-800 flex items-center gap-3 transition-colors"
                  >
                    <Avatar className="w-8 h-8">
                      <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-700 flex items-center justify-center text-white font-medium">
                    {pet.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium text-white">{pet.name}</div>
                      <div className="text-sm text-gray-400">{pet.species} • {calculateAge(pet.dateOfBirth)} years</div>
                    </div>
                  </button>
                ))}
                  </div>
                )}
              </div>
            )}
            {errors.petId && (
              <p className="text-red-400 text-sm">{errors.petId}</p>
            )}
              </div>

              {/* Appointment Date */}
              <div className="space-y-2">
            <Label htmlFor="appointmentDate" className="text-gray-200 font-medium">
              Appointment Date *
            </Label>
            <Input
              id="appointmentDate"
              type="date"
              min={getMinDate()}
              value={formData.appointmentDate}
              onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
              className={`bg-gray-800 text-white ${errors.appointmentDate ? "border-red-400 bg-red-900/30" : "border-gray-700"}`}
            />
            {errors.appointmentDate && (
              <p className="text-red-400 text-sm">{errors.appointmentDate}</p>
            )}
              </div>

              {/* Start Time */}
              <div className="space-y-2">
            <Label htmlFor="startTime" className="text-gray-200 font-medium">
              Start Time *
            </Label>
            <Input
              id="startTime"
              type="time"
              value={formData.startTime}
              onChange={(e) => handleInputChange("startTime", e.target.value)}
              className={`bg-gray-800 text-white ${errors.startTime ? "border-red-400 bg-red-900/30" : "border-gray-700"}`}
            />
            {selectedTime && (
              <p className="text-sm text-gray-400">
                Selected from available slot: <span className="text-blue-300">{selectedTime}</span>
              </p>
            )}
            {errors.startTime && (
              <p className="text-red-400 text-sm">{errors.startTime}</p>
            )}
              </div>

              {/* Consultation Type (Read-only) */}
              <div className="space-y-2">
            <Label className="text-gray-200 font-medium">
              Consultation Type
            </Label>
            <div className="p-3 bg-gray-800 rounded-lg">
              <Badge 
                className={availability.consultationType === "telemedicine" 
                  ? "bg-green-900 text-green-200" 
                  : "bg-orange-900 text-orange-200"
                }
              >
                {availability.consultationType === "telemedicine" ? "Telemedicine" : "In Clinic"}
              </Badge>
            </div>
              </div>

              {/* Reason */}
              <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-200 font-medium">
              Reason for Visit * (minimum 10 characters)
            </Label>
            <Textarea
              id="reason"
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Describe the reason for your visit..."
              className={`bg-gray-800 text-white ${errors.reason ? "border-red-400 bg-red-900/30" : "border-gray-700"}`}
              rows={3}
            />
            <div className="flex justify-between items-center">
              {errors.reason && (
                <p className="text-red-400 text-sm">{errors.reason}</p>
              )}
              <p className="text-sm text-gray-400 ml-auto">
                {formData.reason.length}/10 characters
              </p>
            </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-200 font-medium">
              Additional Notes (optional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Any additional information or special requirements..."
              rows={2}
              className="bg-gray-800 text-white border-gray-700"
            />
              </div>

              {/* Error Message */}
              {error.booking && (
            <div className="p-4 border border-red-400 rounded-lg bg-red-900/30">
              <div className="flex items-center gap-2 text-red-300">
                <AlertCircle className="w-4 h-4" />
                <span>{error.booking}</span>
              </div>
            </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => navigate(`/vets/${id}`)}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading.booking}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold"
            >
              {loading.booking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;
