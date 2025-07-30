import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const LoadingCard: React.FC = () => {
  return (
    <Card className="w-full h-44 animate-pulse">
      <CardContent className="p-4 h-full">
        {/* Header with avatar and name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
          </div>
        </div>
        
        {/* Badges */}
        <div className="flex gap-2 mb-3">
          <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
          <div className="h-6 w-12 bg-muted rounded-full animate-pulse" />
        </div>
        
        {/* Details */}
        <div className="space-y-2 mt-auto">
          <div className="flex justify-between">
            <div className="h-3 bg-muted rounded animate-pulse w-8" />
            <div className="h-3 bg-muted rounded animate-pulse w-12" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-muted rounded animate-pulse w-12" />
            <div className="h-3 bg-muted rounded animate-pulse w-10" />
          </div>
          <div className="flex justify-between">
            <div className="h-3 bg-muted rounded animate-pulse w-10" />
            <div className="h-3 bg-muted rounded animate-pulse w-16" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingCard;
