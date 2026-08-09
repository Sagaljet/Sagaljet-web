import { errorMess, url } from "@/redux/API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function for sign-up
export const createLogoFn = createAsyncThunk(
  "createLogo",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("color", data.color);
      formData.append("imageUrl", data.imageUrl);

      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

      const response = await axios.post(`${url}/logo/add-logo`, formData, 
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
export const createLogoSlice = createSlice({
  name: "createLogo",
  initialState,
  reducers: {
    resetcreateLogo: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createLogoFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = {}; // Clear previous errors
    });
    builder.addCase(createLogoFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createLogoFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { resetcreateLogo } = createLogoSlice.actions;
