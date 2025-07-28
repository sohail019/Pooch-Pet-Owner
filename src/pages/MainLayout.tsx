import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import React from "react";

import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => (
  <div className="flex flex-col min-h-svh">
    <Header />
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 gap-8">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;