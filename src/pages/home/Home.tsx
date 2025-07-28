import React from "react";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-svh">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">Welcome Home!</h2>
        <p className="text-muted-foreground text-center">
          This is the protected home page.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default Home;