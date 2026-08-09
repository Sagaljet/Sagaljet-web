// Redux slice for fetching a single component option by ID

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

// Async function to get a single component option by ID
export const getOneComponentOptionFn = createAsyncThunk(
  "getOneComponentOption",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${url}/design/get-component-option/${id}`
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
export const getOneComponentOptionSlice = createSlice({
  name: "getOneComponentOption",
  initialState,
  reducers: {
    resetGetOneComponentOption: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(getOneComponentOptionFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getOneComponentOptionFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getOneComponentOptionFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetOneComponentOption } = getOneComponentOptionSlice.actions;