// Redux slice for updating a component option

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

// Async function for updating component option
export const updateComponentOptionFn = createAsyncThunk(
  "updateComponentOption",
  async (
    data: { id: number | string; value?: string; typeId?: number | string },
    { rejectWithValue }
  ) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const { id, ...updateData } = data;

      const response = await axios.put(
        `${url}/design/edit-component-option/${id}`,
        updateData,
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
export const updateComponentOptionSlice = createSlice({
  name: "updateComponentOption",
  initialState,
  reducers: {
    resetUpdateComponentOption: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateComponentOptionFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateComponentOptionFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateComponentOptionFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateComponentOption } = updateComponentOptionSlice.actions;