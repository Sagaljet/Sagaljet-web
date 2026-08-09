
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { errorMess, url } from "../../API";

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

// Async function for creating a team
export const createTeamFn = createAsyncThunk(
  "createTeam",
  async (data: any, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("imageUrl", data?.imageUrl);
      formData.append("name", data.name);
      formData.append("skill", data.skill);
      formData.append("description", data?.description);

      const token = JSON.parse(localStorage.getItem("userInfo")!)?.token;

      const response = await axios.post(`${url}/teams`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
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
export const createTeamSlice = createSlice({
  name: "createTeam",
  initialState,
  reducers: {
    resetCreateTeam: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(createTeamFn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.isSuccess = false;
      state.message = ""; // Clear previous errors
    });
    builder.addCase(createTeamFn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.data = action.payload;
    });
    builder.addCase(createTeamFn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = Object(action.payload);
    });
  },
});

export const { resetCreateTeam } = createTeamSlice.actions;
