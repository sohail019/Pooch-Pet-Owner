import { useContext } from "react";

// Dummy user context for demonstration. Replace with your actual AuthContext if available.
const dummyUser = {
  id: "user-uuid",
  name: "John Doe",
  email: "john@example.com",
  // Add other fields as needed
};

export function useAuth() {
  // Replace this with your actual authentication logic/context
  return { user: dummyUser };
}
