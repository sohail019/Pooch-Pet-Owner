import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import UserDetailsCard from "@/components/user/UserDetailsCard";
import PetSlider from "@/components/pets/PetSlider";
import PackagesList from "@/components/packages/PackagesList";
import InventoriesList from "@/components/inventories/InventoriesList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stethoscope, Calendar, Clock, ArrowRight } from "lucide-react";
import { setUser, clearUser } from "@/redux/slices/userSlice";
import { setPets, clearPets } from "@/redux/slices/petsSlice";
import { setPackages, clearPackages } from "@/redux/slices/packagesSlice";
import {
  setInventories,
  clearInventories,
} from "@/redux/slices/inventoriesSlice";
import { RootState } from "@/redux/store";
import { getUser } from "@/controllers/auth/userController";
import { fetchPets } from "@/controllers/pet/petController";
import { getPackages } from "@/controllers/packagesController";
import { getInventories } from "@/controllers/inventoryController";
import { handleApiError } from "@/types/errors";

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const user = useSelector((state: RootState) => state.user.user);
  const pets = useSelector((state: RootState) => state.pets.pets);
  const packages = useSelector((state: RootState) => state.packages.packages);
  const inventories = useSelector(
    (state: RootState) => state.inventories.inventories
  );

  // Local loading/error state
  const [loading, setLoading] = useState({
    user: true,
    pets: true,
    packages: true,
    inventories: true,
  });
  const [error, setError] = useState({
    user: "",
    pets: "",
    packages: "",
    inventories: "",
  });

  const fetchAll = async () => {
    setLoading({ user: true, pets: true, packages: true, inventories: true });
    setError({ user: "", pets: "", packages: "", inventories: "" });
    // USER
    try {
      const userData = await getUser();
      dispatch(setUser(userData));
      setLoading((l) => ({ ...l, user: false }));
    } catch (err: unknown) {
      dispatch(clearUser());
      const errorMessage = handleApiError(err);
      setError((e) => ({ ...e, user: errorMessage }));
      setLoading((l) => ({ ...l, user: false }));
    }
    // PETS
    try {
      const petsData = await fetchPets();
      const petsArr = Array.isArray(petsData) ? petsData : petsData?.pets || [];
      dispatch(setPets(petsArr));
      setLoading((l) => ({ ...l, pets: false }));
    } catch (err: unknown) {
      dispatch(clearPets());
      const errorMessage = handleApiError(err);
      setError((e) => ({ ...e, pets: errorMessage }));
      setLoading((l) => ({ ...l, pets: false }));
    }
    // PACKAGES
    try {
      const packagesData = await getPackages();
      console.log("📦 Packages received in Home:", packagesData);
      dispatch(setPackages(packagesData));
      setLoading((l) => ({ ...l, packages: false }));
    } catch (err: unknown) {
      dispatch(clearPackages());
      const errorMessage = handleApiError(err);
      setError((e) => ({
        ...e,
        packages: errorMessage,
      }));
      setLoading((l) => ({ ...l, packages: false }));
    }
    // INVENTORIES
    try {
      const inventoriesData = await getInventories();
      dispatch(setInventories(inventoriesData));
      setLoading((l) => ({ ...l, inventories: false }));
    } catch (err: unknown) {
      dispatch(clearInventories());
      const errorMessage = handleApiError(err);
      setError((e) => ({
        ...e,
        inventories: errorMessage,
      }));
      setLoading((l) => ({ ...l, inventories: false }));
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      {/* User Details */}
      {loading.user ? (
        <div className="h-24 bg-muted rounded-lg animate-pulse mb-6" />
      ) : error.user ? (
        <div className="mb-6 text-center">
          <div className="text-destructive font-semibold mb-2">
            {error.user}
          </div>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            onClick={fetchAll}
          >
            Retry
          </button>
          <a
            href="/login"
            className="ml-4 underline text-blue-600 hover:text-blue-800"
          >
            Go to Login
          </a>
        </div>
      ) : user ? (
        <UserDetailsCard
          name={user.name}
          email={user.email || user.phone || ""}
          avatarUrl={user.avatarUrl}
          phone={user.phone}
          isVerified={user.isVerified}
          kycStatus={user.kycStatus}
          isActive={user.isActive}
        />
      ) : null}

      {/* Pets Slider */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Your Pets</h2>
        {loading.pets ? (
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-[220px] max-w-xs h-[260px] bg-muted rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : error.pets ? (
          <div className="text-destructive font-semibold mb-2">
            {error.pets}
            <button
              className="ml-4 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
              onClick={fetchAll}
            >
              Retry
            </button>
          </div>
        ) : (
          <PetSlider pets={pets} />
        )}
      </div>

      {/* Packages Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Packages</h2>
        <Link
          to="/my-packages"
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
          View All →
        </Link>
      </div>
      {loading.packages ? (
        <div className="flex gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="min-w-[220px] max-w-xs h-[140px] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : error.packages ? (
        <div className="text-destructive font-semibold mb-2">
          {error.packages}
          <button
            className="ml-4 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            onClick={fetchAll}
          >
            Retry
          </button>
        </div>
      ) : (
        <PackagesList packages={packages} />
      )}

      {/* Find Vets Section */}
      <Card className="border border-gray-300 rounded-xl shadow hover:shadow-md transition-all duration-200 bg-gradient-to-br mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg">
              <Stethoscope className="w-5 h-5 text-blue-600" />
            </div>
            Find Veterinarians
          </CardTitle>
          <p className="text-gray-400">
            Connect with certified veterinarians for your pet's health needs
          </p>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 via-green-100 to-green-200 rounded-xl shadow hover:shadow-lg transition-all duration-200 border border-green-100">
              <div className="flex items-center justify-center w-12 h-12 bg-green-200 rounded-full">
              <Calendar className="w-6 h-6 text-green-700" />
              </div>
              <div>
              <p className="font-semibold text-green-900 text-lg">Book Appointments</p>
              <p className="text-sm text-green-700">Schedule consultations easily</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-xl shadow hover:shadow-lg transition-all duration-200 border border-blue-100">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-200 rounded-full">
              <Clock className="w-6 h-6 text-blue-700" />
              </div>
              <div>
              <p className="font-semibold text-blue-900 text-lg">Flexible Timing</p>
              <p className="text-sm text-blue-700">Choose convenient time slots</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-xl shadow hover:shadow-lg transition-all duration-200 border border-purple-100">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-200 rounded-full">
              <Stethoscope className="w-6 h-6 text-purple-700" />
              </div>
              <div>
              <p className="font-semibold text-purple-900 text-lg">Expert Care</p>
              <p className="text-sm text-purple-700">Certified professionals</p>
              </div>
            </div>
            </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/vets")}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-md px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-150"
            >
              Find Vets
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => navigate("/my-appointments")}
              variant="outline"
              className="border border-blue-500 text-blue-600 font-semibold px-3 py-2 rounded-lg hover:bg-blue-50 hover:border-blue-600 transition-all duration-150 "
            >
              My Appointments
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inventories Section */}
      {loading.inventories ? (
        <div className="flex gap-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="min-w-[180px] max-w-xs h-[140px] bg-muted rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : error.inventories ? (
        <div className="text-destructive font-semibold mb-2">
          {error.inventories}
          <button
            className="ml-4 px-3 py-1 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            onClick={fetchAll}
          >
            Retry
          </button>
        </div>
      ) : (
        <InventoriesList inventories={inventories} />
      )}
    </div>
  );
};

export default Home;
