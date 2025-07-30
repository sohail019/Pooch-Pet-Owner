import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  dateOfBirth: string;
  weight: string;
  color: string;
  profilePicture?: string;
}

interface PetsState {
  pets: Pet[];
}

const initialState: PetsState = {
  pets: [],
};

const petsSlice = createSlice({
  name: "pets",
  initialState,
  reducers: {
    setPets(state, action: PayloadAction<Pet[]>) {
      state.pets = action.payload;
    },
    clearPets(state) {
      state.pets = [];
    },
  },
});

export type { Pet };
export const { setPets, clearPets } = petsSlice.actions;
export default petsSlice.reducer;
