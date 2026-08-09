import { errorMess, url } from "@/redux/API";
import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
interface CreateEventState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: any;
}

interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  link?: string;
  client?: string;
  startAt: string;
  endAt?: string;
  isActive?: boolean | string;
  images?: File[];
}

const initialState: CreateEventState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

export const createEventFn = createAsyncThunk(
  "event/create",
  async (data: CreateEventData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Required fields
      formData.append("title", data.title);
      formData.append("startAt", data.startAt);

      // Optional text fields
      if (data.description) {
        formData.append("description", data.description);
      }
      if (data.location) {
        formData.append("location", data.location);
      }
      if (data.link) {
        formData.append("link", data.link);
      }
      if (data.client) {
        formData.append("client", data.client);
      }
      if (data.endAt) {
        formData.append("endAt", data.endAt);
      }

      // Boolean field
      formData.append(
        "isActive",
        data.isActive !== undefined ? String(data.isActive) : "true"
      );

      // ✅ Multiple images - field name "images" must match backend multer config
      if (data.images && data.images.length > 0) {
        data.images.forEach((image: File) => {
          formData.append("images", image);
        });
      }

      // Get auth token
      const userInfo = localStorage.getItem("userInfo");
      const token = userInfo ? JSON.parse(userInfo)?.token : null;

      if (!token) {
        return rejectWithValue("Authentication required");
      }

      const response = await axios.post(`${url}/event/add-event`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Create Event Error:", error);
      
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message 
          || error.response?.data?.errors 
          || errorMess;
        return rejectWithValue(message);
      }
      
      return rejectWithValue(errorMess);
    }
  }
);

export const createEventSlice = createSlice({
  name: "createEvent",
  initialState,
  reducers: {
    resetCreateEvent: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEventFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(createEventFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.data = action.payload;
        state.message = "Event created successfully";
      })
      .addCase(createEventFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = action.payload as string;
      });
  },
});

export const { resetCreateEvent } = createEventSlice.actions;
export default createEventSlice.reducer;