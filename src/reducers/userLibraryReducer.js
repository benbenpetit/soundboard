import { createSlice } from '@reduxjs/toolkit';
import { isSoundInList } from 'utils/redux';

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
      if (isSoundInList(action.payload.id, state.sounds)) {
        return state;
      }

      return {
        ...state,
        sounds: [
          ...state.sounds,
          {
            ...action.payload,
            addedDate: new Date(),
            volume: 1,
            isLooping: false,
            positionStart: 0,
            positionEnd: 1
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
