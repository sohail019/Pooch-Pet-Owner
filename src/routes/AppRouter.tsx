import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Home from '@/pages/home/Home';
import AddPet from '@/pages/onboarding/AddPet';
import AddMedical from '@/pages/onboarding/AddMedical';
import AddVaccination from '@/pages/onboarding/AddVaccination';
import MainLayout from '@/pages/MainLayout';
import PetDetails from '@/pages/home/PetDetails';
import AddPetMedical from '@/pages/home/AddPetMedical';
import AddPetVaccination from '@/pages/home/AddPetVaccination';
import PackageDetails from '@/pages/packages/PackageDetails';
import MyPackages from '@/pages/packages/MyPackages';
import InventoryDetails from '@/pages/inventory/InventoryDetails';
import VetsList from '@/pages/vets/VetsList';
import VetAvailability from '@/pages/vets/VetAvailability';
import BookAppointment from '@/pages/vets/BookAppointment';
import MyAppointments from '@/pages/vets/MyAppointments';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes with shared layout */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Pet Details & Operations */}
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/pets/:id/add-medical" element={<AddPetMedical />} />
        <Route path="/pets/:id/add-vaccination" element={<AddPetVaccination />} />

        {/* Package Details & Payment */}
        <Route path="/packages/:id" element={<PackageDetails />} />
        
        {/* My Packages */}
        <Route path="/my-packages" element={<MyPackages />} />

        {/* Inventory Details & Payment */}
        <Route path="/inventory/:id" element={<InventoryDetails />} />

        {/* Vet Appointments */}
        <Route path="/vets" element={<VetsList />} />
        <Route path="/vets/:id" element={<VetAvailability />} />
        <Route path="/vets/:id/book" element={<BookAppointment />} />
        <Route path="/my-appointments" element={<MyAppointments />} />

        {/* Onboarding Flow */}
        <Route path="/onboarding/add-pet" element={<AddPet onboarding />} />
        <Route path="/onboarding/add-medical" element={<AddMedical onboarding />} />
        <Route path="/onboarding/add-vaccination" element={<AddVaccination onboarding />} />

        {/* Standalone Actions */}
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/add-medical" element={<AddMedical />} />
        <Route path="/add-vaccination" element={<AddVaccination />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;