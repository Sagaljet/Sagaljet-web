import { errorMess, url } from "../../API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function for creating a user
export const createUserFn = createAsyncThunk(
  "createUser",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("userName", data.userName);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("role", data.role);

      // Log the formData entries to verify
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(`${url}/user/new`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          return rejectWithValue(error.response.data.errors);
        }
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Slice definition
export const createUserSlice = createSlice({
  name: "createUser",
  initialState,
  reducers: {
    resetCreateUser: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createUserFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createUserFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createUserFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateUser } = createUserSlice.actions;
