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

// Async function for updating a team
export const updateTeamFn = createAsyncThunk(
  "updateTeam",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("imageUrl", data.imageUrl);
      formData.append("name", data.name);
      formData.append("skill", data.skill);
      formData.append("description", data.description);
      formData.append("id", data.id);

      const response = await axios.put(`${url}/teams/update`, formData);
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
export const updateTeamSlice = createSlice({
  name: "updateTeam",
  initialState,
  reducers: {
    resetUpdateTeam: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(updateTeamFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Clear previous errors
    });
    builder.addCase(updateTeamFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(updateTeamFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetUpdateTeam } = updateTeamSlice.actions;
