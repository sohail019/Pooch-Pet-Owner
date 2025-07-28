import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  // Add more user fields as needed
}

interface AuthState {
  token: string | null;
  user: User | null;
}

const rawUser = localStorage.getItem('user');
const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user:
    rawUser && rawUser !== "undefined"
      ? JSON.parse(rawUser)
      : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<{ token: string; user: User }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    clearAuth(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

export type { AuthState };

export const { setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;