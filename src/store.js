import { configureStore } from '@reduxjs/toolkit';
import frameRateReducer from './slices/FrameRateSlice';

export default configureStore({
  reducer: {
    frameRate: frameRateReducer,
  },
});
