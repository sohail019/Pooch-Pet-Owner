import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SyringeIcon, UserIcon, PlusIcon, BriefcaseMedicalIcon } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "@/utils/axiosInstance";

interface MedicalRecord {
  id: string;
  title: string;
  type: string;
  description: string;
  date: string;
  veterinarian: string;
  clinic: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  createdAt: string;
}

interface Vaccination {
  id: string;
  title: string;
  description: string;
  date: string;
  veterinarian: string;
  clinic: string;
  medications: string[];
  createdAt: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  weight: string;
  color: string;
  profilePicture: string | null;
  microchipNumber: string | null;
  medicalRecords: MedicalRecord[];
  vaccinations: Vaccination[];
  createdAt: string;
  updatedAt: string;
}

const PetDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/pets/${id}`);
        setPet(response.data.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching pet:", err);
        setError(err?.response?.data?.message || "Failed to fetch pet details");
        toast.error("Could not load pet details");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  const handleAddMedical = () => {
    navigate(`/pets/${id}/add-medical`);
  };

  const handleAddVaccination = () => {
    navigate(`/pets/${id}/add-vaccination`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (error || !pet) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Pet Not Found</h2>
          <p className="text-muted-foreground mb-4">{error || "This pet does not exist or you don't have permission to view it."}</p>
          <Button onClick={() => navigate("/")}>Return Home</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Pet Info Card */}
      <Card className="mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-2">
          <div className="relative">
            {pet.profilePicture ? (
              <img
                src={pet.profilePicture}
                alt={pet.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
                <UserIcon size={48} className="text-muted-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <CardTitle className="text-3xl">{pet.name}</CardTitle>
            <div className="flex flex-wrap gap-2 my-2 justify-center sm:justify-start">
              <Badge variant="secondary">{pet.species}</Badge>
              <Badge variant="secondary">{pet.breed}</Badge>
              <Badge variant="secondary">{pet.gender}</Badge>
            </div>
            <p className="text-muted-foreground">Added on {new Date(pet.createdAt).toLocaleDateString()}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p>{pet.dateOfBirth ? new Date(pet.dateOfBirth).toLocaleDateString() : "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Weight</p>
              <p>{pet.weight} kg</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Color</p>
              <p>{pet.color}</p>
            </div>
            {pet.microchipNumber && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">Microchip</p>
                <p>{pet.microchipNumber}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical Records Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <BriefcaseMedicalIcon className="mr-2" size={20} />
            Medical Records
          </h2>
          <Button onClick={handleAddMedical} size="sm">
            <PlusIcon className="mr-1" size={16} /> Add Record
          </Button>
        </div>

        {pet.medicalRecords && pet.medicalRecords.filter(record => record.type !== "vaccination").length > 0 ? (
          <div className="space-y-4">
            {pet.medicalRecords
              .filter(record => record.type !== "vaccination")
              .map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-semibold">{record.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{record.description}</p>
                    <div className="text-sm text-muted-foreground">
                      {record.veterinarian} • {record.clinic}
                    </div>
                    {record.diagnosis && (
                      <div className="mt-2">
                        <span className="text-xs font-semibold">Diagnosis:</span>{" "}
                        <span className="text-sm">{record.diagnosis}</span>
                      </div>
                    )}
                    {record.treatment && (
                      <div className="mt-1">
                        <span className="text-xs font-semibold">Treatment:</span>{" "}
                        <span className="text-sm">{record.treatment}</span>
                      </div>
                    )}
                    {record.medications.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {record.medications.map((med, i) => (
                          <Badge key={i} variant="outline">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No medical records found</p>
              <Button onClick={handleAddMedical} variant="outline" className="mt-4">
                Add First Medical Record
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Vaccinations Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <SyringeIcon className="mr-2" size={20} />
            Vaccinations
          </h2>
          <Button onClick={handleAddVaccination} size="sm">
            <PlusIcon className="mr-1" size={16} /> Add Vaccination
          </Button>
        </div>

        {((pet.medicalRecords && pet.medicalRecords.filter(record => record.type === "vaccination").length > 0) || 
           (pet.vaccinations && pet.vaccinations.length > 0)) ? (
          <div className="space-y-4">
            {/* Display vaccination records from medicalRecords */}
            {pet.medicalRecords
              .filter(record => record.type === "vaccination")
              .map((record) => (
                <Card key={record.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h3 className="font-semibold">{record.title}</h3>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm mb-2">{record.description}</p>
                    <div className="text-sm text-muted-foreground">
                      {record.veterinarian} • {record.clinic}
                    </div>
                    {record.medications.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {record.medications.map((med, i) => (
                          <Badge key={i} variant="outline">
                            {med}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              
            {/* Display vaccination schedule from vaccinations array */}
            {pet.vaccinations.map((vacc) => (
              <Card key={vacc.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="font-semibold">{vacc.name}</h3>
                    <Badge variant={vacc.status === 'pending' ? 'outline' : 'secondary'}>
                      {vacc.status === 'pending' ? 'Scheduled' : 'Completed'}
                    </Badge>
                  </div>
                  <p className="text-sm mb-2">{vacc.description}</p>
                  <div className="text-sm text-muted-foreground">
                    Scheduled: {new Date(vacc.scheduledDate).toLocaleDateString()}
                    {vacc.completedDate && ` • Completed: ${new Date(vacc.completedDate).toLocaleDateString()}`}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {vacc.veterinarian} • {vacc.clinic}
                  </div>
                  {vacc.notes && (
                    <div className="mt-2 text-sm">
                      <span className="text-xs font-semibold">Notes:</span> {vacc.notes}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground">No vaccination records found</p>
              <Button onClick={handleAddVaccination} variant="outline" className="mt-4">
                Add First Vaccination
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PetDetails;