import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface UserDetailsCardProps {
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  isVerified?: boolean;
  kycStatus?: "pending" | "approved" | "rejected";
  isActive?: boolean;
}

const UserDetailsCard: React.FC<UserDetailsCardProps> = ({
  name,
  email,
  avatarUrl,
  phone = "9920376331",
  // isVerified = false,
  kycStatus = "pending",
  isActive = true,

}) => {
  return (
    <Card className="flex items-center gap-4 p-4 mb-6 shadow-md">
      <div>
      {avatarUrl ? (
        <img
        src={avatarUrl}
        alt={name}
        className="w-16 h-16 rounded-full object-cover border"
        />
      ) : (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-bold">
        {name.charAt(0)}
        </div>
      )}
      </div>
      <CardContent className="flex-1 min-w-0">
      <div className="text-lg font-semibold mb-1">
        Hello, {name} <span className="text-xl">👋</span>
      </div>
      <div className="text-muted-foreground text-sm truncate">{email}</div>
      <div className="mt-2 text-sm">
        <span className="font-medium">Phone:</span> {phone}
      </div>
      {/* <div className="mt-1 text-sm">
        <span className="font-medium">Verified:</span>{" "}
        <span className={isVerified ? "text-green-600" : "text-red-600"}>
          {isVerified ? "Yes" : "No"}
        </span>
      </div> */}
      <div className="mt-1 text-sm">
        <span className="font-medium">KYC Status:</span>{" "}
        <span className="capitalize">{kycStatus}</span>
      </div>
      <div className="mt-1 text-sm">
        <span className="font-medium">Active:</span>{" "}
        <span className={isActive ? "text-green-600" : "text-red-600"}>
          {isActive ? "Yes" : "No"}
        </span>
      </div>
      </CardContent>
    </Card>
  );
};

export default UserDetailsCard;
