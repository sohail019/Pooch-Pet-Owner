import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";

const vaccinationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  veterinarian: z.string().min(1, "Veterinarian is required"),
  clinic: z.string().min(1, "Clinic is required"),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  medications: z.string().optional(),
  attachments: z.string().optional(),
  notes: z.string().optional(),
});

export type VaccinationFormValues = z.infer<typeof vaccinationSchema>;

const defaultValues: VaccinationFormValues = {
  title: "",
  description: "",
  date: "",
  veterinarian: "",
  clinic: "",
  diagnosis: "",
  treatment: "",
  medications: "",
  attachments: "",
  notes: "",
};

const VaccinationForm: React.FC<{
  onSubmit: (data: VaccinationFormValues & { type: string }) => void;
}> = ({ onSubmit }) => {
  const pet = useSelector((state: RootState) => state.pet.pet);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VaccinationFormValues>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues,
  });

  if (!pet) return <div>No pet found. Please add a pet first.</div>;

  const handleFormSubmit = async (data: VaccinationFormValues) => {
    try {
      // Format date correctly - adjust the format based on API requirements
      let formattedDate = data.date;
      if (data.date) {
        // This ensures the date is properly formatted
        const dateObj = new Date(data.date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString();
        }
      }

      onSubmit({
        ...data,
        date: formattedDate,
        type: "vaccination",
      });
    } catch (err) {
      console.error("[VaccinationForm] Error submitting vaccination:", err);
      toast.error("Failed to add vaccination record.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="max-w-md w-full mx-auto bg-background border border-border rounded-xl shadow p-6 flex flex-col gap-5"
      style={{ minWidth: 320 }}
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Add Vaccination Record</h2>
      
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Rabies Vaccination" {...register("title")} />
        {errors.title && (
          <p className="text-xs text-red-500">{errors.title.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Annual rabies vaccination"
          className="min-h-[80px]"
          {...register("description")} 
        />
        {errors.description && (
          <p className="text-xs text-red-500">{errors.description.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date" 
          type="datetime-local" 
          {...register("date")} 
        />
        {errors.date && (
          <p className="text-xs text-red-500">{errors.date.message}</p>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="veterinarian">Veterinarian</Label>
          <Input id="veterinarian" placeholder="Dr. Smith" {...register("veterinarian")} />
          {errors.veterinarian && (
            <p className="text-xs text-red-500">{errors.veterinarian.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="clinic">Clinic</Label>
          <Input id="clinic" placeholder="Happy Paws Clinic" {...register("clinic")} />
          {errors.clinic && (
            <p className="text-xs text-red-500">{errors.clinic.message}</p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="diagnosis">Diagnosis</Label>
          <Input id="diagnosis" placeholder="Optional" {...register("diagnosis")} />
          {errors.diagnosis && (
            <p className="text-xs text-red-500">{errors.diagnosis.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="treatment">Treatment</Label>
          <Input id="treatment" placeholder="Optional" {...register("treatment")} />
          {errors.treatment && (
            <p className="text-xs text-red-500">{errors.treatment.message}</p>
          )}
        </div>
      </div>
      
      <div>
        <Label htmlFor="medications">Medications</Label>
        <Input 
          id="medications" 
          placeholder="Comma separated (e.g., Medication A, Medication B)" 
          {...register("medications")} 
        />
        {errors.medications && (
          <p className="text-xs text-red-500">{errors.medications.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="attachments">Attachments</Label>
        <Input 
          id="attachments" 
          placeholder="Comma separated URLs" 
          {...register("attachments")} 
        />
        {errors.attachments && (
          <p className="text-xs text-red-500">{errors.attachments.message}</p>
        )}
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          placeholder="Additional notes about the vaccination"
          className="min-h-[80px]"
          {...register("notes")} 
        />
        {errors.notes && (
          <p className="text-xs text-red-500">{errors.notes.message}</p>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground rounded py-2 font-semibold hover:bg-primary/90 transition"
      >
        Add Vaccination
      </button>
    </form>
  );
};

export default VaccinationForm;