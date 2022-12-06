import { configureStore } from "@reduxjs/toolkit";
import frameRateReducer from "./slices/FrameRateSlice";
import sceneProfileReducer from "./slices/SceneProfileSlice";


export default configureStore({
  reducer: {
    frameRate: frameRateReducer,
    sceneProfile: sceneProfileReducer
  },
});