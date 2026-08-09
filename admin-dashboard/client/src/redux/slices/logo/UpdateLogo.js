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
export const updateLogoFn = createAsyncThunk(
  "updateLogo",
  async (data, { rejectWithValue }) => {
    try {
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("color", data.color);
      formData.append("imageUrl", data.imageUrl);
      formData.append("id", data.id);

      const response = await axios.put(`${url}/logo/edit-logo/${id}`, formData);
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
export const updateLogoSlice = createSlice({
  name: "updateLogo",
  initialState,
  reducers: {
    resetupdateLogo: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateLogoFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = {}; // Clear previous errors
    });
    builder.addCase(updateLogoFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateLogoFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { resetupdateLogo } = updateLogoSlice.actions;
