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
export const updateBlogFn = createAsyncThunk(
  "updateBlog",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("content", data.content);
      formData.append("image", data.image);
      formData.append("id", data.id);

      const response = await axios.put(`${url}/blog/update-blog`, formData);
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
export const updateBlogSlice = createSlice({
  name: "updateBlog",
  initialState,
  reducers: {
    resetupdateBlog: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateBlogFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
    });
    builder.addCase(updateBlogFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateBlogFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetupdateBlog } = updateBlogSlice.actions;
