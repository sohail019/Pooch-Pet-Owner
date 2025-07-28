import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchPets } from "@/controllers/pet/petController";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getPets = async () => {
      setLoading(true);
      try {
        const data = await fetchPets();
        let petsArr: any[] = [];
        if (Array.isArray(data)) {
          petsArr = data;
        } else if (Array.isArray(data?.pets)) {
          petsArr = data.pets;
        }
        setPets(petsArr);
      } catch {
        setPets([]);
      }
      setLoading(false);
    };
    getPets();
  }, []);

  return loading ? (
    <div className="text-center py-10">Loading pets...</div>
  ) : !pets.length ? (
    <div className="text-center py-10">
      No pets yet.{" "}
      <a href="/add-pet" className="text-blue-500 underline">
        Add a pet
      </a>
    </div>
  ) : (
    pets.map((pet) => (
      <Card
        key={pet.id}
        className="w-full max-w-sm mx-auto hover:shadow-md transition-all cursor-pointer"
        onClick={() => navigate(`/pets/${pet.id}`)}
      >
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          {pet.profilePicture && (
            <img
              src={pet.profilePicture}
              alt={pet.name}
              className="w-24 h-24 rounded-full object-cover border"
            />
          )}
          <h2 className="text-xl font-bold">{pet.name}</h2>
          <div className="flex gap-2">
            <Badge>{pet.species}</Badge>
            <Badge>{pet.breed}</Badge>
            <Badge>{pet.gender}</Badge>
          </div>
          <div className="text-sm text-muted-foreground">
            <div>
              <span className="font-medium">DOB:</span>{" "}
              {pet.dateOfBirth?.slice(0, 10)}
            </div>
            <div>
              <span className="font-medium">Weight:</span> {pet.weight} kg
            </div>
            <div>
              <span className="font-medium">Color:</span> {pet.color}
            </div>
          </div>
        </CardContent>
      </Card>
    ))
  );
};

export default Home;