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

// Async function for creating Project
export const createProjectFn = createAsyncThunk(
  "createProject",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("categoryId", data.categoryId);
      formData.append("link", data.link);
      formData.append("client", data.client);
      formData.append("industry", data.industry);
      formData.append("createAt", data.createAt);
      // Append multiple image files
      for (let i = 0; i < data.imageUrl.length; i++) {
        formData.append("imageUrl", data.imageUrl[i]);
      }

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(
        `${url}/project/add-project`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
export const createProjectSlice = createSlice({
  name: "createProject",
  initialState,
  reducers: {
    resetCreateProject: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createProjectFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(createProjectFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createProjectFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateProject } = createProjectSlice.actions;
