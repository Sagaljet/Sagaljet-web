// Redux slice for fetching a single design by ID or slug

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

// Async function to get a single design by ID
export const getOneDesignFn = createAsyncThunk(
  "getOneDesign",
  async (id: string | number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/design/get-design/${id}`);
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

// Async function to get a single design by slug
export const getDesignBySlugFn = createAsyncThunk(
  "getDesignBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/design/get-design-by-slug/${slug}`);
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
export const getOneDesignSlice = createSlice({
  name: "getOneDesign",
  initialState,
  reducers: {
    resetGetOneDesign: () => initialState,
  },
  extraReducers: (builder) => {
    // Get design by ID
    builder.addCase(getOneDesignFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getOneDesignFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getOneDesignFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Get design by slug
    builder.addCase(getDesignBySlugFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    });
    builder.addCase(getDesignBySlugFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getDesignBySlugFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetOneDesign } = getOneDesignSlice.actions;