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

// Async function for creating Design with Features and Components
export const createDesignFn = createAsyncThunk(
  "createDesign",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("price", data.price.toString());
      formData.append("categoryDesignId", data.categoryDesignId);
      formData.append("description", data.description || "");
      formData.append(
        "isPrintable",
        data.isPrintable !== undefined ? data.isPrintable.toString() : "true"
      );

      // Append features as JSON string
      if (data.features && data.features.length > 0) {
        formData.append("features", JSON.stringify(data.features));
      }

      // Append components as JSON string
      if (data.components && data.components.length > 0) {
        formData.append("components", JSON.stringify(data.components));
      }

      // Append multiple images if exists
      if (data.images && data.images.length > 0) {
        data.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(`${url}/design/add-design`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
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
export const createDesignSlice = createSlice({
  name: "createDesign",
  initialState,
  reducers: {
    resetCreateDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createDesignFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createDesignFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createDesignFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateDesign } = createDesignSlice.actions;
