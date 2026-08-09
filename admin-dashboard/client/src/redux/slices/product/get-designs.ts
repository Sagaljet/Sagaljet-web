// redux/slices/product/get-designs.ts

import { errorMess, url } from "../../API";
import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

export interface Design {
  id: number;  // Changed to number
  title: string;
  description: string | null;
  images: string[];
  price: number;
  isPrintable: boolean;
  displayOrder: number;
  features: any[];
  components: any[];
  CategoryDesign: any[];
}

interface DesignsState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isReordering: boolean;
  message: string;
  data: Design[];
}

const initialState: DesignsState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  isReordering: false,
  message: "",
  data: [],
};

// Get printable designs
export const getDesignsFn = createAsyncThunk<Design[], void>(
  "designs/getDesigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/design/get-designs`);
      return response.data.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Get all designs
export const getAllDesignsFn = createAsyncThunk<Design[], void>(
  "designs/getAllDesigns",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/design/get-all-designs`);
      return response.data.result;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

// Update designs order - accepts number array
export const updateDesignsOrderFn = createAsyncThunk<
  { success: boolean },
  number[],  // Changed to number[]
  { rejectValue: string }
>(
  "designs/updateOrder",
  async (orderedIds, { rejectWithValue }) => {
    try {
      console.log("Sending orderedIds:", orderedIds);
      
      const response = await axios.put(
        `${url}/design/update-order`,
        { orderedIds },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Update order error:", error);
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data?.message || errorMess);
      }
      return rejectWithValue(errorMess);
    }
  }
);

export const getDesignsSlice = createSlice({
  name: "designs",
  initialState,
  reducers: {
    reorderDesigns: (state, action: PayloadAction<Design[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Get printable designs
    builder
      .addCase(getDesignsFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getDesignsFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getDesignsFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });

    // Get all designs
    builder
      .addCase(getAllDesignsFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getAllDesignsFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(getAllDesignsFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = String(action.payload);
      });

    // Update order
    builder
      .addCase(updateDesignsOrderFn.pending, (state) => {
        state.isReordering = true;
      })
      .addCase(updateDesignsOrderFn.fulfilled, (state) => {
        state.isReordering = false;
      })
      .addCase(updateDesignsOrderFn.rejected, (state, action) => {
        state.isReordering = false;
        state.isError = true;
        state.message = String(action.payload);
      });
  },
});

export const { reorderDesigns } = getDesignsSlice.actions;
export default getDesignsSlice.reducer;