import { createSlice } from '@reduxjs/toolkit';

const userLibrarySlice = createSlice({
  name: 'userLibrary',
  initialState: [],
  reducers: {
    addSound: (state, action) => {
      return [...state, { ...action.payload.sound }];
    },
    removeSound: (state, action) => {
      return state.filter(sound => sound.id != action.payload.id);
    }
  }
});

export const { addSound, removeSound } = userLibrarySlice.actions;
export const soundsSelector = (state) => state;

export const userLibraryReducer = userLibrarySlice.reducer;
