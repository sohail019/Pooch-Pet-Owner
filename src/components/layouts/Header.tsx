import React, { useState } from "react";
import { DogIcon, MenuIcon, XIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearAuth } from "@/redux/slices/authSlice";
import { clearPet } from "@/redux/slices/petSlice";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(clearPet());
    localStorage.clear();
    navigate("/login");
  };

  const handleNav = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <header className="w-full bg-primary text-primary-foreground flex items-center justify-between py-4 px-4 shadow relative">
      <a
        href="/"
        className="flex items-center gap-2 text-lg font-semibold hover:underline focus:outline-none"
        aria-label="Home"
      >
        <span className="bg-background text-primary flex items-center justify-center rounded-md p-1">
          <DogIcon className="size-5" />
        </span>
        Pooch Pet Owner
      </a>
      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-6 items-center ">
        <button onClick={() => handleNav("/add-pet")} className="hover:underline">
          Add Pet
        </button>
        <button onClick={() => handleNav("/add-medical")} className="hover:underline">
          Add Medical Record
        </button>
        <button onClick={() => handleNav("/add-vaccination")} className="hover:underline">
          Add Vaccination
        </button>
        <button onClick={handleLogout} className="hover:underline text-red-200">
          Logout
        </button>
      </nav>
      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-2"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open menu"
      >
        {open ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
      </button>
      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-full right-2 mt-2 w-48 bg-white text-primary rounded shadow-lg flex flex-col z-50 md:hidden">
          <button
            onClick={() => handleNav("/add-pet")}
            className="px-4 py-3 text-left hover:bg-muted text-black"
          >
            Add Pet
          </button>
          <button
            onClick={() => handleNav("/add-medical")}
            className="px-4 py-3 text-left hover:bg-muted text-black"
          >
            Add Medical Record
          </button>
          <button
            onClick={() => handleNav("/add-vaccination")}
            className="px-4 py-3 text-left hover:bg-muted text-black"
          >
            Add Vaccination
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-3 text-left text-red-600 hover:bg-muted"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;