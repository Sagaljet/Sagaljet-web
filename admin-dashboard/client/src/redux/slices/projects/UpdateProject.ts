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
export const updateProjectFn = createAsyncThunk(
  "updateProject",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("imageUrl", data.imageUrl);
      //@ts-ignore
      formData.append("categoryId", parseInt(data.categoryId));
      formData.append("link", data.link);
      formData.append("client", data.client);

      const response = await axios.put(
        `${url}/project/edit-project/${parseInt(data.id)}`,
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
export const updateProjectSlice = createSlice({
  name: "createProject",
  initialState,
  reducers: {
    resetUpdateProject: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateProjectFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateProjectFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateProjectFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateProject } = updateProjectSlice.actions;
