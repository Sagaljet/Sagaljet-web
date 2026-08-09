import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo")!)
  : {
      userName: "",
      role: "",
      email: "",
      token: "",
    };

const userInfoSlice = createSlice({
  // name
  name: "userInfo",
  reducers: {
    setUser: (state, action) => {
      state.userName = action.payload.userName;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.token = action.payload.token;

      localStorage.setItem("userInfo", JSON.stringify(state));
    },

    logout: (state) => {
      localStorage.removeItem("userInfo");
      state.userName = "";
      state.role = "";
      state.email = "";
      state.token = "";
    },
  },
  initialState,
});

export default userInfoSlice;
export const { setUser, logout } = userInfoSlice.actions;
