import React from "react";
import { PetForm, PetFormValues } from "@/components/forms/PetForm";
import { useDispatch } from "react-redux";
import { setPet } from "@/redux/slices/petSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { createPet, fetchPets } from "@/controllers/pet/petController";
import { toast } from "react-toastify";

const AddPet: React.FC<{ onboarding?: boolean }> = ({ onboarding }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if onboarding by prop or route
  const isOnboarding = onboarding || location.pathname.startsWith("/onboarding");

  const handleSubmit = async (data: PetFormValues & { dateOfBirth?: string }) => {
    try {
      const payload = {
        name: data.name,
        species: data.species,
        breed: data.breed,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        weight: Number(data.weight),
        color: data.color,
        profilePicture: data.profilePicture,
      };
      
      // Add console.log to debug
      console.log("Creating pet with payload:", payload);
      
      const response = await createPet(payload);
      console.log("Pet created successfully:", response);

      // Fetch all pets after creation
      const petsData = await fetchPets();
      console.log("Fetched pets data:", petsData);
      
      const pets = Array.isArray(petsData) ? petsData : (petsData?.pets || []);
      const latestPet = pets[pets.length - 1];

      if (latestPet) {
        dispatch(setPet({
          ...latestPet,
          dob: latestPet.dateOfBirth,
          image: latestPet.profilePicture,
        }));
        
        console.log("Stored pet in Redux:", latestPet);
      }

      // Navigate based on flow
      if (isOnboarding) {
        console.log("Navigating to /onboarding/add-medical");
        toast.success("Pet created successfully! Now add medical records or skip.");
        
        // Try both approaches:
        navigate("/onboarding/add-medical");
        
        // Backup navigation in case React Router is having issues
        setTimeout(() => {
          if (window.location.pathname.includes("onboarding/add-pet")) {
            console.log("Fallback navigation");
            window.location.href = "/onboarding/add-medical";
          }
        }, 500);
      } else {
        console.log("Navigating to home page");
        toast.success("Pet created successfully!");
        
        // Try both approaches:
        navigate("/");
        
        // Backup navigation
        setTimeout(() => {
          if (window.location.pathname.includes("add-pet")) {
            console.log("Fallback navigation");
            window.location.href = "/";
          }
        }, 500);
      }
    } catch (err) {
      console.error("Error creating pet:", err);
      toast.error("Failed to create pet. Please try again.");
    }
  };

  // Skip handler - only used in onboarding flow
  const handleSkip = () => {
    navigate("/onboarding/add-medical");
  };

  // Add a direct navigation button for testing:

  return (
    <div className="max-w-md mx-auto">
      <PetForm onSubmit={handleSubmit} />
      
      {/* Skip button only appears in onboarding flow */}
      {isOnboarding && (
        <>
          <button
            type="button"
            onClick={handleSkip}
            className="mt-4 w-full bg-gray-200 text-gray-800 rounded py-2 font-semibold hover:bg-gray-300 transition"
          >
            Skip
          </button>
          
          {/* Debug button - remove after fixing */}
          <button
            type="button"
            onClick={() => window.location.href = "/onboarding/add-medical"}
            className="mt-2 w-full bg-red-200 text-red-800 rounded py-2 font-semibold"
          >
            Debug: Force Navigate
          </button>
        </>
      )}
    </div>
  );
};

export default AddPet;