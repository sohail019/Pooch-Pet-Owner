import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-muted text-muted-foreground flex items-center justify-center py-3 text-xs">
    &copy; {new Date().getFullYear()} Pooch Pet Owner. All rights reserved.
  </footer>
);

export default Footer;