import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import petReducer from "./slices/petSlice";
import petsReducer from "./slices/petsSlice";
import packagesReducer from "./slices/packagesSlice";
import inventoriesReducer from "./slices/inventoriesSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    pet: petReducer,
    pets: petsReducer,
    packages: packagesReducer,
    inventories: inventoriesReducer,
    user: userReducer,
  },
});

// Types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
