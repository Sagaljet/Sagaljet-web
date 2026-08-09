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
export const deleteProjectFn = createAsyncThunk(
  "deleteProject",
  async (id: any, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${url}/project/delete-project/${parseInt(id)}`
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
export const deleteProjectSlice = createSlice({
  name: "deleteProject",
  initialState,
  reducers: {
    deleteProjectReset: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(deleteProjectFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(deleteProjectFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(deleteProjectFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { deleteProjectReset } = deleteProjectSlice.actions;
