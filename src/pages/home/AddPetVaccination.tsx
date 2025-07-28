import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import VaccinationForm, { VaccinationFormValues } from "@/components/forms/VaccinationForm";
import { addMedicalRecord, fetchPetById } from "@/controllers/pet/petController";
import { setPet } from "@/redux/slices/petSlice";
import { toast } from "react-toastify";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const AddPetVaccination: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [petData, setPetData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch pet data on component mount
  useEffect(() => {
    const loadPet = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await fetchPetById(id);
        const pet = response.data;
        
        // Save to local state
        setPetData(pet);
        
        // Update Redux (optional)
        dispatch(setPet({
          ...pet,
          dob: pet.dateOfBirth,
          image: pet.profilePicture
        }));
        
        setError(null);
      } catch (err) {
        console.error("Failed to fetch pet:", err);
        setError("Could not load pet information");
      } finally {
        setLoading(false);
      }
    };
    
    loadPet();
  }, [id, dispatch]);

  const handleSubmit = async (data: VaccinationFormValues) => {
    if (!id) {
      toast.error("Pet ID is missing");
      return;
    }

    try {
      const payload = {
        ...data,
        type: "vaccination", // Ensure type is always vaccination
        medications: data.medications.split(",").map((s) => s.trim()),
        attachments: data.attachments
          ? data.attachments.split(",").map((s) => s.trim())
          : [],
      };
      
      await addMedicalRecord(id, payload);
      toast.success("Vaccination record added successfully!");
      navigate(`/pets/${id}`);
    } catch (err) {
      toast.error("Failed to add vaccination record");
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading pet information...</p>
      </div>
    );
  }

  if (error || !petData) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <p className="text-red-500">{error || "Pet not found"}</p>
        <button 
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl text-center">
            Add Vaccination for {petData.name}
          </CardTitle>
        </CardHeader>
      </Card>
      <VaccinationForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddPetVaccination;