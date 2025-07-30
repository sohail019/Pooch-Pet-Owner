import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserIcon } from "lucide-react";

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

interface PetCardProps {
  pet: Pet;
  onClick: (petId: string) => void;
  calculateAge: (dateOfBirth: string) => string;
}

const PetCard: React.FC<PetCardProps> = ({ pet, onClick, calculateAge }) => {
  return (
    <Card
      className="w-full h-44 hover:shadow-md active:scale-95 transition-all cursor-pointer shadow-sm border border-border/50"
      onClick={() => onClick(pet.id)}
    >
      <CardContent className="p-4 h-full flex flex-col">
        {/* Pet Header */}
        <div className="flex items-center gap-3 mb-3">
          {pet.profilePicture ? (
            <img
              src={pet.profilePicture}
              alt={pet.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-border"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border-2 border-border">
              <UserIcon size={18} className="text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate text-base">
              {pet.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {pet.breed}
            </p>
          </div>
        </div>
        
        {/* Pet Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs px-2 py-1 font-medium">
            {pet.species}
          </Badge>
          <Badge variant="outline" className="text-xs px-2 py-1 font-medium">
            {pet.gender}
          </Badge>
        </div>
        
        {/* Pet Details */}
        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Age:</span>
            <span className="text-sm font-semibold text-foreground">
              {calculateAge(pet.dateOfBirth)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Weight:</span>
            <span className="text-sm font-semibold text-foreground">{pet.weight}kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Color:</span>
            <span className="text-sm font-semibold text-foreground truncate max-w-24">
              {pet.color}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PetCard;
