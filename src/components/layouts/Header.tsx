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
      <button onClick={() => handleNav("/vets")} className="hover:underline">
        Find Vets
      </button>
      <button onClick={() => handleNav("/my-appointments")} className="hover:underline">
        My Appointments
      </button>
      {/* <button onClick={() => handleNav("/my-packages")} className="hover:underline">
        My Packages
      </button> */}
      <button onClick={() => handleNav("/my-orders")} className="hover:underline">
        My Orders
      </button>
      <button onClick={() => handleNav("/rehoming")} className="hover:underline">
        Rehoming
      </button>
      <button onClick={() => handleNav("/rehoming/transactions")} className="hover:underline">
        Transactions
      </button>
      <button onClick={() => handleNav("/add-pet")} className="hover:underline">
        Add Pet
      </button>
      <button onClick={handleLogout} className="hover:underline text-red-200">
        Logout
      </button>
      </nav>
      {/* Mobile Hamburger */}
      <button
      className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
      onClick={() => setOpen((v) => !v)}
      aria-label="Open menu"
      >
      {open ? <XIcon className="size-6" /> : <MenuIcon className="size-6" />}
      </button>
      {/* Mobile Menu */}
      {open && (
      <div className="absolute top-full right-4 mt-3 w-56 bg-white  rounded-xl shadow-2xl flex flex-col z-50 md:hidden border border-gray-200 animate-fade-in">
        <button
        onClick={() => handleNav("/vets")}
        className="px-5 py-4 text-left hover:bg-primary/10 transition-colors font-medium border-b border-gray-100"
        >
        Find Vets
        </button>
        <button
        onClick={() => handleNav("/my-appointments")}
        className="px-5 py-4 text-left hover:bg-primary/10 transition-colors font-medium border-b border-gray-100"
        >
        My Appointments
        </button>
        {/* <button
        onClick={() => handleNav("/my-packages")}
        className="px-5 py-4 text-left hover:bg-primary/10 transition-colors font-medium border-b border-gray-100"
        >
        My Packages
        </button> */}
        <button
        onClick={() => handleNav("/my-orders")}
        className="px-5 py-4 text-left hover:bg-primary/10 transition-colors font-medium border-b border-gray-100"
        >
        My Orders
        </button>
        <button
        onClick={() => handleNav("/rehoming")}
        className="px-5 py-4 text-left hover:bg-primary/10 transition-colors font-medium border-b border-gray-100"
        >
        Rehoming
        </button>
        <button
        onClick={() => handleNav("/rehoming/transactions")}
        className="px-5 py-4 text-left hover:bg-primary/10 transition-colors font-medium border-b border-gray-100"
        >
        Transactions
        </button>
        <button
        onClick={() => handleNav("/add-pet")}
        className="px-5 py-4 text-left hover:bg-primary/10 transition-colors font-medium border-b border-gray-100"
        >
        Add Pet
        </button>
        <button
        onClick={handleLogout}
        className="px-5 py-4 text-left text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
        Logout
        </button>
      </div>
      )}
    </header>
  );
};

export default Header;