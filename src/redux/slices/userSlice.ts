import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  isVerified?: boolean;
  kycStatus?: "pending" | "approved" | "rejected";
  isActive?: boolean;
  // Add more user fields as needed
}

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export type { User };
export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
