import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Pet {
  name: string;
  species: string;
  breed: string;
  gender: string;
  dob: string;
  weight: string;
  color: string;
  image?: string; // base64 or url
}

interface PetState {
  pet: Pet | null;
}

const initialState: PetState = {
  pet: localStorage.getItem('pet')
    ? JSON.parse(localStorage.getItem('pet')!)
    : null,
};

const petSlice = createSlice({
  name: 'pet',
  initialState,
  reducers: {
    setPet(state, action: PayloadAction<Pet>) {
      state.pet = action.payload;
      localStorage.setItem('pet', JSON.stringify(action.payload)); 
    },
    clearPet(state) {
      state.pet = null;
      localStorage.removeItem('pet'); 
    },
  },
});

export type { PetState };

export const { setPet, clearPet } = petSlice.actions;
export default petSlice.reducer;