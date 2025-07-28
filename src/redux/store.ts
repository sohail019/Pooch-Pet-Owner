import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import petReducer from './slices/petSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pet: petReducer,
  },
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;