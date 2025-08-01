import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Camera, X, Dog, Cat, Plus, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SelectNative } from "@/components/ui/select-native";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createRehomingListing } from "@/controllers/rehomingController";

interface PetFormData {
  name: string;
  species: "dog" | "cat" | "";
  breed: string;
  age: number | "";
  description: string;
  adoptionType: "free" | "paid" | "";
  price: number | "";
  imageUrls: string[];
}

const CreateRehoming: React.FC = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState<PetFormData>({
    name: "",
    species: "",
    breed: "",
    age: "",
    description: "",
    adoptionType: "",
    price: "",
    imageUrls: []
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Common dog breeds
  const dogBreeds = [
    "Golden Retriever", "Labrador Retriever", "German Shepherd", "Bulldog",
    "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund",
    "Siberian Husky", "Shih Tzu", "Boston Terrier", "Pomeranian", "Border Collie",
    "Chihuahua", "Boxer", "Cocker Spaniel", "Dalmatian", "Great Dane",
    "Maltese", "Pug", "Saint Bernard", "Mixed Breed", "Other"
  ];

  // Common cat breeds
  const catBreeds = [
    "Persian", "Maine Coon", "British Shorthair", "Ragdoll", "Bengal",
    "Abyssinian", "Birman", "Oriental Shorthair", "Devon Rex", "Cornish Rex",
    "Scottish Fold", "Sphynx", "American Shorthair", "Russian Blue", "Siamese",
    "Norwegian Forest Cat", "Manx", "Exotic Shorthair", "Bombay", "Burmese",
    "Turkish Angora", "Chartreux", "Mixed Breed", "Domestic Shorthair", "Other"
  ];

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Pet name is required";
    }

    if (!formData.species) {
      newErrors.species = "Please select a species";
    }

    if (!formData.breed.trim()) {
      newErrors.breed = "Breed is required";
    }

    if (!formData.age || formData.age < 0 || formData.age > 30) {
      newErrors.age = "Please enter a valid age (0-30 years)";
    }

    if (!formData.description.trim() || formData.description.length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.adoptionType) {
      newErrors.adoptionType = "Please select adoption type";
    }

    if (formData.adoptionType === "paid" && (!formData.price || formData.price <= 0)) {
      newErrors.price = "Please enter a valid price for paid adoption";
    }

    if (formData.imageUrls.length === 0) {
      newErrors.images = "Please add at least one image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      setLoading(true);
      
      console.log("🏠 Creating rehoming listing:", formData);
      
      // Prepare data for API
      const petData = {
        name: formData.name.trim(),
        species: formData.species as "dog" | "cat",
        breed: formData.breed.trim(),
        age: Number(formData.age),
        description: formData.description.trim(),
        adoptionType: formData.adoptionType as "free" | "paid",
        price: formData.adoptionType === "paid" ? Number(formData.price) : undefined,
        imageUrls: formData.imageUrls
      };

      const result = await createRehomingListing(petData);
      
      // Success handled by controller
      console.log("✅ Pet listing created:", result);
      
      // Navigate to my listings
      setTimeout(() => {
        navigate("/rehoming/my-pets");
      }, 2000);
      
    } catch (err: unknown) {
      console.error("❌ Failed to create pet listing:", err);
      // Error handled by controller
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload (mock function - in real app would upload to cloud storage)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setImageUploading(true);
      
      // Mock image upload process
      const newImageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not a valid image file`);
          continue;
        }
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }
        
        // In a real app, you would upload to cloud storage
        // For now, we'll create a mock URL
        const mockUrl = `https://api.pooch-app.com/uploads/${Date.now()}-${file.name}`;
        newImageUrls.push(mockUrl);
      }
      
      if (newImageUrls.length > 0) {
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...newImageUrls].slice(0, 6) // Max 6 images
        }));
        
        // Clear errors for images if we now have some
        if (errors.images) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.images;
            return newErrors;
          });
        }
        
        toast.success(`${newImageUrls.length} image(s) uploaded successfully`);
      }
      
    } catch (err) {
      console.error("Failed to upload images:", err);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setImageUploading(false);
      // Reset file input
      e.target.value = "";
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  // Handle input changes
  const handleInputChange = (field: keyof PetFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 sticky top-0 z-10 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/rehoming")}
              variant="ghost"
              size="sm"
              className="p-2 text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">List Your Pet for Rehoming</h1>
              <p className="text-gray-400">Help your pet find a loving new home</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Dog className="w-6 h-6 text-blue-400" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pet Name */}
              <div>
                <Label htmlFor="name" className="text-gray-200 font-medium">
                  Pet Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your pet's name"
                  className={`mt-2 bg-gray-800 border-gray-700 text-white ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Species and Breed */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-200 font-medium mb-3 block">
                    Species *
                  </Label>
                  <RadioGroup
                    value={formData.species}
                    onValueChange={(value) => handleInputChange("species", value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dog" id="dog" />
                      <Label htmlFor="dog" className="text-white flex items-center gap-2 cursor-pointer">
                        <Dog className="w-5 h-5 text-blue-400" />
                        Dog
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cat" id="cat" />
                      <Label htmlFor="cat" className="text-white flex items-center gap-2 cursor-pointer">
                        <Cat className="w-5 h-5 text-purple-400" />
                        Cat
                      </Label>
                    </div>
                  </RadioGroup>
                  {errors.species && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.species}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="breed" className="text-gray-200 font-medium">
                    Breed *
                  </Label>
                  <SelectNative
                    id="breed"
                    value={formData.breed}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange("breed", e.target.value)}
                    className={`mt-2 bg-gray-800 border-gray-700 text-white ${
                      errors.breed ? "border-red-500" : ""
                    }`}
                    disabled={!formData.species}
                  >
                    <option value="">Select breed</option>
                    {formData.species === "dog" && dogBreeds.map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                    {formData.species === "cat" && catBreeds.map(breed => (
                      <option key={breed} value={breed}>{breed}</option>
                    ))}
                  </SelectNative>
                  {errors.breed && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.breed}
                    </p>
                  )}
                </div>
              </div>

              {/* Age */}
              <div>
                <Label htmlFor="age" className="text-gray-200 font-medium">
                  Age (years) *
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="30"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", parseInt(e.target.value) || "")}
                  placeholder="Enter age in years"
                  className={`mt-2 bg-gray-800 border-gray-700 text-white ${
                    errors.age ? "border-red-500" : ""
                  }`}
                />
                {errors.age && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.age}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-gray-200 font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your pet's personality, habits, health status, and why you're rehoming. Be honest about any special needs or requirements."
                  rows={5}
                  className={`mt-2 bg-gray-800 border-gray-700 text-white ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {errors.description ? (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm">
                      Minimum 50 characters
                    </p>
                  )}
                  <p className="text-gray-400 text-sm">
                    {formData.description.length}/1000
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adoption Details */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white">
                Adoption Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Adoption Type */}
              <div>
                <Label className="text-gray-200 font-medium mb-3 block">
                  Adoption Type *
                </Label>
                <RadioGroup
                  value={formData.adoptionType}
                  onValueChange={(value) => handleInputChange("adoptionType", value)}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="free" id="free" />
                    <Label htmlFor="free" className="text-white cursor-pointer">
                      Free Adoption - No rehoming fee
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paid" id="paid" />
                    <Label htmlFor="paid" className="text-white cursor-pointer">
                      Paid Adoption - Rehoming fee required
                    </Label>
                  </div>
                </RadioGroup>
                {errors.adoptionType && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.adoptionType}
                  </p>
                )}
              </div>

              {/* Price (only show if paid adoption) */}
              {formData.adoptionType === "paid" && (
                <div>
                  <Label htmlFor="price" className="text-gray-200 font-medium">
                    Rehoming Fee (₹) *
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", parseInt(e.target.value) || "")}
                    placeholder="Enter rehoming fee in rupees"
                    className={`mt-2 bg-gray-800 border-gray-700 text-white ${
                      errors.price ? "border-red-500" : ""
                    }`}
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    A small rehoming fee helps ensure serious adopters and covers basic care costs
                  </p>
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.price}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Camera className="w-6 h-6 text-green-400" />
                Pet Photos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Button */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={imageUploading || formData.imageUrls.length >= 6}
                  />
                  <Label
                    htmlFor="image-upload"
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      imageUploading || formData.imageUrls.length >= 6
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {imageUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Photos
                      </>
                    )}
                  </Label>
                  <p className="text-gray-400 text-sm">
                    {formData.imageUrls.length}/6 photos uploaded
                  </p>
                </div>
                
                <p className="text-gray-400 text-sm">
                  Add up to 6 clear photos of your pet. Good photos help attract potential adopters!
                </p>
                
                {errors.images && (
                  <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.images}
                  </p>
                )}
              </div>

              {/* Image Preview Grid */}
              {formData.imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Pet photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeImage(index)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-blue-600/80 text-white text-xs px-2 py-1 rounded">
                          Cover Photo
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="shadow-lg bg-gradient-to-br from-blue-900/20 via-indigo-800/20 to-blue-900/20 border border-blue-800/50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  Ready to List Your Pet?
                </h3>
                <p className="text-gray-300 mb-6">
                  Your listing will be reviewed before going live. This helps ensure all pets find the best possible homes.
                </p>
                
                <div className="flex gap-4 justify-center">
                  <Button
                    type="button"
                    onClick={() => navigate("/rehoming")}
                    variant="outline"
                    className="border-gray-600 text-gray-200 bg-gray-800 hover:bg-gray-700"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold px-8"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Listing...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Listing
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateRehoming;
