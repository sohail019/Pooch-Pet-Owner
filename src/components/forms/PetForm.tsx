import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar-rac";
import { getLocalTimeZone } from "@internationalized/date";
import type { DateValue } from "react-aria-components";
import { toast } from "react-toastify";
import { useId } from "react";
import { SelectNative } from "@/components/ui/select-native";

const petSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  species: z.enum(["dog", "cat", "rabbit", "bird", "other"], {
    message: "Select a valid species",
  }),
  breed: z.string().min(1, "Breed is required"),
  gender: z.enum(["male", "female"]),
  // dateOfBirth: z.string().min(1, "Date of birth is required"),
  weight: z.string().min(1, "Weight is required"),
  color: z.string().min(1, "Color is required"),
  profilePicture: z.string().optional(),
});

type PetFormValues = z.infer<typeof petSchema>;

export const PetForm: React.FC<{
  onSubmit: (data: PetFormValues & { dateOfBirth?: string }) => void;
}> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PetFormValues>({
    resolver: zodResolver(petSchema),
  });

  const [preview, setPreview] = useState<string | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [dob, setDob] = useState<DateValue | null>(null);
  const speciesId = useId();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setValue("profilePicture", imageData);
        setPreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: PetFormValues) => {
    // Format date if needed
    const formattedData = {
      ...data,
      dateOfBirth:
        dob && typeof dob === "object" && "toDate" in dob
          ? dob.toDate(getLocalTimeZone()).toISOString()
          : "",
    };

    // Pass data to parent component's onSubmit
    onSubmit(formattedData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="max-w-md w-full mx-auto bg-background border border-border rounded-xl shadow p-6 flex flex-col gap-5"
      style={{ minWidth: 320 }}
    >
      <h2 className="text-2xl font-bold mb-2 text-center">Add Your Pet</h2>
      <div>
        <Label htmlFor="name">Pet Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor={speciesId}>Species</Label>
        <SelectNative
          id={speciesId}
          className="bg-muted border-transparent shadow-none"
          {...register("species")}
          defaultValue=""
        >
          <option value="" disabled>
            Select species
          </option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="rabbit">Rabbit</option>
          <option value="bird">Bird</option>
          <option value="other">Other</option>
        </SelectNative>
        {errors.species && (
          <p className="text-xs text-red-500">{errors.species.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="breed">Breed</Label>
        <Input id="breed" {...register("breed")} />
        {errors.breed && (
          <p className="text-xs text-red-500">{errors.breed.message}</p>
        )}
      </div>
      <div>
        <Label>Gender</Label>
        <div className="flex gap-6 mt-1">
          <label className="flex items-center gap-1">
            <input type="radio" value="male" {...register("gender")} />
            Male
          </label>
          <label className="flex items-center gap-1">
            <input type="radio" value="female" {...register("gender")} />
            Female
          </label>
        </div>
        {errors.gender && (
          <p className="text-xs text-red-500">{errors.gender.message}</p>
        )}
      </div>
      <div>
        <Label>Date of Birth</Label>
        <Input
          readOnly
          value={
            dob && typeof dob === "object" && "toDate" in dob
              ? dob.toDate(getLocalTimeZone()).toISOString().slice(0, 10)
              : ""
          }
          placeholder="Select date"
          onClick={() => setShowCalendar(true)}
          className="cursor-pointer"
        />
        {showCalendar && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-background text-foreground rounded-xl p-4 shadow-xl w-[90vw] max-w-xs mx-auto">
              <Calendar
                className="rounded-md border p-2"
                value={dob}
                onChange={(date) => {
                  setDob(date);
                  setShowCalendar(false);
                }}
              />
              <button
                type="button"
                className="mt-2 text-sm text-primary underline w-full"
                onClick={() => setShowCalendar(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          step="0.1"
          {...register("weight")}
        />
        {errors.weight && (
          <p className="text-xs text-red-500">{errors.weight.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="color">Color</Label>
        <Input id="color" {...register("color")} />
        {errors.color && (
          <p className="text-xs text-red-500">{errors.color.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="profilePicture">Profile Picture URL</Label>
        <Input
          id="profilePicture"
          type="url"
          placeholder="https://example.com/whiskers.jpg"
          {...register("profilePicture")}
        />
        {errors.profilePicture && (
          <p className="text-xs text-red-500">{errors.profilePicture.message}</p>
        )}
        {watch("profilePicture") && (
          <img
            src={watch("profilePicture")}
            alt="Pet Preview"
            className="mt-2 rounded-full w-20 h-20 object-cover mx-auto"
          />
        )}
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground rounded py-2 font-semibold hover:bg-primary/90 transition"
      >
        Add Pet
      </button>
    </form>
  );
};

export type { PetFormValues };
