// redux/slices/sideCard/getSideCardsSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../API";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: [],
};

// Async function for getting active side cards
export const getSideCardsFn = createAsyncThunk<any, void>(
  "getSideCards",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/side-cards/get-side-cards`);
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

// Async function for getting all side cards (including inactive)
export const getAllSideCardsFn = createAsyncThunk<any, void>(
  "getAllSideCards",
  async (_, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.get(`${url}/side-cards/get-all-side-cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

// Async function for getting single side card by ID
export const getSideCardFn = createAsyncThunk(
  "getSideCard",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.get(`${url}/side-cards/get-side-card/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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
export const getSideCardsSlice = createSlice({
  name: "getSideCards",
  initialState,
  reducers: {
    resetGetSideCards: () => initialState,
  },
  extraReducers: (builder) => {
    // Get active side cards
    builder.addCase(getSideCardsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getSideCardsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getSideCardsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Get all side cards
    builder.addCase(getAllSideCardsFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getAllSideCardsFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getAllSideCardsFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });

    // Get single side card
    builder.addCase(getSideCardFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(getSideCardFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(getSideCardFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetGetSideCards } = getSideCardsSlice.actions;