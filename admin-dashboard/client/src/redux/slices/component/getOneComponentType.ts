// Redux slice for fetching a single component type by ID

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

// Async function to get a single component type by ID
export const getOneComponentTypeFn = createAsyncThunk(
  "getOneComponentType",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/design/get-component-type/${id}`
      );
      return response.data.result;
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
export const getOneComponentTypeSlice = createSlice({
  name: "getOneComponentType",
  initialState,
  reducers: {
    resetGetOneComponentType: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getOneComponentTypeFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getOneComponentTypeFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getOneComponentTypeFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetOneComponentType } = getOneComponentTypeSlice.actions;