import React from "react";
import { DogIcon } from "lucide-react";

const Header: React.FC = () => (
  <header className="w-full bg-primary text-primary-foreground flex items-center justify-center py-4 shadow">
    <div className="flex items-center gap-2 text-lg font-semibold">
      <span className="bg-background text-primary flex items-center justify-center rounded-md p-1">
        <DogIcon className="size-5" />
      </span>
      Pooch Pet Owner
    </div>
  </header>
);

export default Header;