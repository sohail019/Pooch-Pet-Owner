import React, { useState, useRef, useEffect, ReactNode } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  showArrows?: boolean;
  showDots?: boolean;
  showAutoPlayToggle?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  itemsPerView?: number;
  gap?: number;
}

const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  showArrows = true,
  showDots = true,
  showAutoPlayToggle = false,
  autoPlay = false,
  autoPlayInterval = 3000,
  itemsPerView = 1,
  gap = 16,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);
  const containerRef = useRef<HTMLDivElement>(null);
  const childrenArray = React.Children.toArray(children);
  const totalItems = childrenArray.length;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, maxIndex)));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || !autoPlay) return;

    const interval = setInterval(() => {
      goToNext();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlay, autoPlayInterval, currentIndex, maxIndex]);

  // Pause auto-play on hover
  const handleMouseEnter = () => {
    if (autoPlay) setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoPlay) setIsAutoPlaying(true);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        goToNext();
      } else if (event.key === " ") {
        event.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [maxIndex]);

  // Touch/Swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNext();
    }
    if (isRightSwipe) {
      goToPrevious();
    }
  };

  if (totalItems === 0) return null;

  return (
    <div
      className={cn("relative w-full", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="region"
      aria-label="Carousel"
      aria-live="polite"
    >
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="overflow-hidden carousel-container"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            gap: `${gap}px`,
          }}
          role="list"
        >
          {childrenArray.map((child, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{
                width: `calc(${100 / itemsPerView}% - ${
                  (gap * (itemsPerView - 1)) / itemsPerView
                }px)`,
              }}
              role="listitem"
              aria-hidden={
                index < currentIndex || index >= currentIndex + itemsPerView
              }
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && totalItems > itemsPerView && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 carousel-nav-button"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 carousel-nav-button"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}

      {/* Auto-play Toggle */}
      {showAutoPlayToggle && autoPlay && (
        <Button
          variant="outline"
          size="icon"
          className="absolute top-4 left-4 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background/90 carousel-nav-button"
          onClick={toggleAutoPlay}
          aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
        >
          {isAutoPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Dots Indicator */}
      {showDots && totalItems > itemsPerView && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                index === currentIndex
                  ? "bg-primary scale-125"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      {totalItems > itemsPerView && (
        <div className="absolute top-4 right-4 z-10 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md">
          {currentIndex + 1} / {maxIndex + 1}
        </div>
      )}
    </div>
  );
};

export { Carousel };
