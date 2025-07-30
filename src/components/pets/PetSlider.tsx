import React from "react";
import PetCard from "./PetCard";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  weight: string;
  color: string;
  profilePicture?: string;
}

interface PetSliderProps {
  pets: Pet[];
}

const calculateAge = (dateOfBirth: string) => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  const ageInYears = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    return `${ageInYears - 1} years`;
  }
  if (ageInYears === 0) {
    const ageInMonths =
      monthDiff + (today.getDate() < birthDate.getDate() ? -1 : 0);
    return ageInMonths <= 0 ? "Less than 1 month" : `${ageInMonths} months`;
  }
  return `${ageInYears} years`;
};

const PetSlider: React.FC<PetSliderProps> = ({ pets }) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
      {pets.map((pet) => (
        <div key={pet.id} className="snap-center min-w-[220px] max-w-xs">
          <PetCard
            pet={pet}
            onClick={() => navigate(`/pets/${pet.id}`)}
            calculateAge={calculateAge}
          />
        </div>
      ))}
      {/* Add Pet Card */}
      <div className="snap-center min-w-[220px] max-w-xs">
        <Card
          className="flex flex-col items-center justify-center h-full border-2 border-dashed border-primary/50 cursor-pointer hover:bg-muted/50 transition-all min-h-[260px]"
          onClick={() => navigate("/add-pet")}
        >
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary flex items-center justify-center mb-2">
              <span className="text-4xl text-primary font-bold">+</span>
            </div>
            <div className="text-primary font-semibold mt-2">Add Pet</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PetSlider;
