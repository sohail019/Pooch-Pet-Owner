import React, { useState, useEffect } from "react";
import { Carousel } from "./carousel";

interface ResponsiveCarouselProps {
  children: React.ReactNode;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  showAutoPlayToggle?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  gap?: number;
}

const ResponsiveCarousel: React.FC<ResponsiveCarouselProps> = ({
  children,
  className,
  showArrows = true,
  showDots = true,
  showAutoPlayToggle = false,
  autoPlay = false,
  autoPlayInterval = 3000,
  gap = 16,
}) => {
  const [itemsPerView, setItemsPerView] = useState(1);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const updateItemsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setItemsPerView(3); // Desktop: 3 items
      } else if (width >= 768) {
        setItemsPerView(2); // Tablet: 2 items
      } else {
        setItemsPerView(1); // Mobile: 1 item
      }
    };

    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);

    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  if (!isMounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <Carousel
      className={className}
      itemsPerView={itemsPerView}
      gap={gap}
      showArrows={showArrows}
      showDots={showDots}
      showAutoPlayToggle={showAutoPlayToggle}
      autoPlay={autoPlay}
      autoPlayInterval={autoPlayInterval}
    >
      {children}
    </Carousel>
  );
};

export { ResponsiveCarousel };
