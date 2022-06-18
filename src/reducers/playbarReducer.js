import { createSlice } from '@reduxjs/toolkit';

const playbarSlice = createSlice({
  name: 'playbar',
  initialState: {
    isPlaying: false,
    isShow: false,
    sound: null
  },
  reducers: {
    setPlay: (state, action) => {
      return {
        ...state,
        isPlaying: action.payload
      };
    },
    setShow: (state, action) => {
      return {
        ...state,
        isShow: action.payload
      }
    },
    setSound: (state, action) => {
      return {
        ...state,
        sound: { ...action.payload }
      };
    }
  }
});

export const { setPlay, setShow, setSound } = playbarSlice.actions;
export const playbarSelector = (state) => state;

export default playbarSlice.reducer;
