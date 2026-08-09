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

// Async function to delete a team member
export const getOneProjectFn = createAsyncThunk(
  "getoneProject",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/project/get-project/${id}`);
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
export const getoneProjectSlice = createSlice({
  name: "getoneProject",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneProjectFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Clear previous errors
    });
    builder.addCase(getOneProjectFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getOneProjectFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});
