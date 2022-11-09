import { createSlice } from '@reduxjs/toolkit';

export const frameRateSlice = createSlice({
  name: 'frameRate',
  initialState: {
    value: 0,
  },
  reducers: {
    setFrameRate: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setFrameRate } = frameRateSlice.actions;

export default frameRateSlice.reducer;
