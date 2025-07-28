import React from "react";
import VaccinationForm from "@/components/forms/VaccinationForm";
import { useDispatch, useSelector } from "react-redux";
import { setPet } from "@/redux/slices/petSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { addMedicalRecord, fetchPets } from "@/controllers/pet/petController";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";

const AddVaccination: React.FC<{ onboarding?: boolean }> = ({ onboarding }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pet = useSelector((state: RootState) => state.pet.pet);

  // Determine if onboarding by prop or route
  const isOnboarding = onboarding || location.pathname.startsWith("/onboarding");

  const handleSubmit = async (data: any) => {
    if (!pet) {
      toast.error("No pet found. Please add a pet first.");
      return;
    }
    try {
      const payload = {
        ...data,
        type: "vaccination", // Ensure type is always vaccination
        medications: data.medications.split(",").map((s: string) => s.trim()),
        attachments: data.attachments
          ? data.attachments.split(",").map((s: string) => s.trim())
          : [],
      };
      await addMedicalRecord(pet.id, payload);

      // Fetch pets and update Redux
      const petsData = await fetchPets();
      const pets = petsData.pets || petsData || [];
      const latestPet = pets.find((p: any) => p.id === pet.id) || pets[0];
      if (latestPet) {
        dispatch(setPet({ 
          ...latestPet,
          dob: latestPet.dateOfBirth,
          image: latestPet.profilePicture 
        }));
      }
      
      // Navigate based on flow
      navigate("/"); // Always go to home after vaccination (last step in onboarding)
      
      // Show success message
      toast.success(isOnboarding 
        ? "Onboarding complete! Welcome to Pooch Pet Owner." 
        : "Vaccination record added successfully!");
    } catch (err) {
      toast.error("Failed to add vaccination record.");
    }
  };

  // Skip handler
  const handleSkip = () => {
    navigate("/");
    toast.success("Onboarding complete! Welcome to Pooch Pet Owner.");
  };

  return (
    <div>
      {/* Use the VaccinationForm but pass our own submission handler */}
      <div className="max-w-md mx-auto">
        <VaccinationForm onSubmit={handleSubmit} />
        {isOnboarding && (
          <button
            type="button"
            onClick={handleSkip}
            className="mt-4 w-full bg-gray-200 text-gray-800 rounded py-2 font-semibold hover:bg-gray-300 transition"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
};

export default AddVaccination;