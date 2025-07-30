import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";

interface AddPetCardProps {
  onClick: () => void;
  isFirstPet: boolean;
}

const AddPetCard: React.FC<AddPetCardProps> = ({ onClick, isFirstPet }) => {
  return (
    <Card
      className="w-full h-44 border-2 border-dashed border-primary/30 bg-primary/5 hover:border-primary/60 active:border-primary/80 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-full gap-3 text-center p-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
          <PlusIcon size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base mb-1">
            {isFirstPet ? "Add Your First Pet" : "Add Another Pet"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {isFirstPet ? "Get started by adding your pet" : "Expand your pet family"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddPetCard;
