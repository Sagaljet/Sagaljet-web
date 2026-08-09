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

// Async function for sign-up
export const updateCategoryFn = createAsyncThunk(
  "updateCategory",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);

      const response = await axios.put(
        `${url}/categories/edit-category/${parseInt(data.id)}`,
        formData
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
export const updateCategorySlice = createSlice({
  name: "createCategory",
  initialState,
  reducers: {
    resetUpdateCategory: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateCategoryFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateCategoryFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateCategoryFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateCategory } = updateCategorySlice.actions;
