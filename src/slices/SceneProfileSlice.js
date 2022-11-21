import { createSlice } from "@reduxjs/toolkit";

export const sceneProfileSlice = createSlice({
  name: "sceneProfile",
  initialState: {},
  reducers: {
    setSceneProfile: (state, action) => {
      state.fps = action.payload.fps;
      state.indices = action.payload.indices;
      state.faces = action.payload.faces;
      state.meshes = action.payload.meshes;
      //console.log(state)
    },
  },
});

// Action creators are generated for each case reducer function
export const { setSceneProfile } = sceneProfileSlice.actions;

export default sceneProfileSlice.reducer;
