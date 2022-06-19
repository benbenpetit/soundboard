import { createSlice } from '@reduxjs/toolkit';

const userLibrarySlice = createSlice({
  name: 'userLibrary',
  initialState: {
    filterBy: 'DATE_ASC',
    sounds: []
  },
  reducers: {
    setFilterLibrary: (state, action) => {
      return {
        ...state,
        filterBy: action.payload
      };
    },
    addSoundLibrary: (state, action) => {
      return {
        ...state,
        sounds: [
          ...state.sounds,
          {
            ...action.payload,
            addedDate: new Date()
          }
        ]
      };
    },
    removeSoundLibrary: (state, action) => {
      return {
        ...state,
        sounds: state.sounds.filter(sound => sound.id != action.payload)
      }
    }
  }
});

export const { setFilterLibrary, addSoundLibrary, removeSoundLibrary } = userLibrarySlice.actions;
export const userLibrarySelector = (state) => state;

export default userLibrarySlice.reducer;
