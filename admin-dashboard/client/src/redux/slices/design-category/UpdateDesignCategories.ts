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

// Async function for update
export const updateDesignCategoryFn = createAsyncThunk(
  "DesignCategoriesupdate",
  async (data: any, { rejectWithValue }) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
      };

      const response = await axios.put(
        `${url}/categories/design/edit-category/${parseInt(data.id)}`,
        payload
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

export const updateDesignCategorySlice = createSlice({
  name: "updateDesignCategory", // Magaca waan saxay
  initialState,
  reducers: {
    resetUpdateCategoryDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateDesignCategoryFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Reset message on new request
    });
    builder.addCase(updateDesignCategoryFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateDesignCategoryFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = String(action.payload); // Ensure string format
    });
  },
});

export const { resetUpdateCategoryDesign } = updateDesignCategorySlice.actions;
