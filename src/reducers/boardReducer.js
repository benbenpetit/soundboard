import { createSlice } from '@reduxjs/toolkit';

const boardSlice = createSlice({
  name: 'board',
  initialState: [],
  reducers: {
    addSoundBoard: (state, action) => {
      return [...state, { ...action.payload.sound }];
    },
    removeSoundBoard: (state, action) => {
      return state.filter(sound => sound.id != action.payload.id);
    },
    updateSoundBoard: (state, action) => {
      return state.map(sound =>
        sound.id === action.payload.id ? action.payload : sound
      );
    }
  }
});

export const { addSoundBoard, removeSoundBoard, updateSoundBoard } = boardSlice.actions;
export const boardSelector = (state) => state;

export default boardSlice.reducer;
