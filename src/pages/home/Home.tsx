import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import UserDetailsCard from "@/components/user/UserDetailsCard";
import PetSlider from "@/components/pets/PetSlider";
import PackagesList from "@/components/packages/PackagesList";
import InventoriesList from "@/components/inventories/InventoriesList";
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
        <h2 className="text-xl font-bold">Your Packages</h2>
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
