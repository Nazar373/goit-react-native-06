import { createSlice } from "@reduxjs/toolkit";

const state = {
  userId: null,
  email: null,
  nickName: null,
  image: null,
  stateChange: false
}

export const authSlice = createSlice({
  name: "auth",
  initialState: state,
  reducers: {
    updateUserProfile: (state, { payload}) => ({
      ...state, 
      userId: payload.userId,
      email: payload.email,
      nickName: payload.nickName,
      image: payload.image,
    }),
    authStateChange: (state, {payload}) => ({
      ...state, 
      stateChange: payload.stateChange
    }),
    authSignOut: () => state
  }
})