import { createSlice } from '@reduxjs/toolkit';

const boardSlice = createSlice({
  name: 'board',
  initialState: [],
  reducers: {
    addSound: (state, action) => {
      return [...state, { ...action.payload.sound }];
    },
    removeSound: (state, action) => {
      return state.filter(sound => sound.id != action.payload.id);
    },
    updateSound: (state, action) => {
      return state.map(sound =>
        sound.id === action.payload.id ? action.payload : sound
      );
    }
  }
});

export const { addSound, removeSound, updateSound } = boardSlice.actions;
export const boardSelector = (state) => state;

export const boardReducer = boardSlice.reducer;
