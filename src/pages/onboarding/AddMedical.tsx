import React from "react";
import MedicalForm, { MedicalFormValues } from "@/components/forms/MedicalForm";
import { useDispatch, useSelector } from "react-redux";
import { setPet } from "@/redux/slices/petSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { addMedicalRecord, fetchPets } from "@/controllers/pet/petController";
import { toast } from "react-toastify";
import { RootState } from "@/redux/store";

const AddMedical: React.FC<{ onboarding?: boolean }> = ({ onboarding }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pet = useSelector((state: RootState) => state.pet.pet);

  // Determine if onboarding by prop or route
  const isOnboarding = onboarding || location.pathname.startsWith("/onboarding");

  const handleSubmit = async (data: MedicalFormValues) => {
    if (!pet) {
      toast.error("No pet found. Please add a pet first.");
      return;
    }
    try {
      const payload = {
        ...data,
        medications: data.medications.split(",").map((s) => s.trim()),
        attachments: data.attachments
          ? data.attachments.split(",").map((s) => s.trim())
          : [],
      };
      await addMedicalRecord(pet.id, payload);

      // Optionally fetch pets and update Redux
      const petsData = await fetchPets();
      const pets = petsData.pets || petsData.data || [];
      const latestPet = pets.find((p: any) => p.id === pet.id) || pets[pets.length - 1];
      if (latestPet) {
        dispatch(setPet({ ...latestPet, dob: latestPet.dateOfBirth, image: latestPet.profilePicture }));
      }
      // Navigate based on flow
      if (isOnboarding) {
        navigate("/onboarding/add-vaccination");
        toast.success("Medical record added successfully! Now add vaccination or skip.");
      } else {
        navigate("/");
        toast.success("Medical record added successfully!");
      }
    } catch (err) {
      toast.error("Failed to add medical record.");
    }
  };

  // Skip handler
  const handleSkip = () => {
    if (isOnboarding) {
      navigate("/onboarding/add-vaccination");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <MedicalForm onSubmit={handleSubmit} />
      
      {/* Skip button only appears in onboarding flow */}
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
  );
};

export default AddMedical;