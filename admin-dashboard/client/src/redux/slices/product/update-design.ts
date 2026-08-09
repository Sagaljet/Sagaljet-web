// redux/slices/product/update-design.ts
import { url } from "../../API";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

interface UpdateDesignData {
  id: string | number;
  title: string;
  slug?: string;
  price: number;
  description?: string;
  isPrintable?: boolean;
  categoryDesignId?: string | number;
  features?: Array<{ name: string; value: string; extraCost?: number }>;
  components?: Array<{ optionId: number; extraPrice?: number }>;
  // ✅ Updated to match component
  existingImages?: string[];      // URLs of images to keep
  newImages?: File[];             // New files to upload
  imagesToDelete?: string[];      // URLs of images to delete (for backend cleanup)
}

interface UpdateDesignState {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  message: string;
  data: any;
}

const initialState: UpdateDesignState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
  data: {},
};

export const updateDesignFn = createAsyncThunk(
  "updateDesign",
  async (data: UpdateDesignData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Basic fields
      formData.append("title", data.title);
      
      if (data.slug) {
        formData.append("slug", data.slug);
      }
      
      formData.append("price", data.price.toString());
      
      if (data.description !== undefined) {
        formData.append("description", data.description || "");
      }
      
      formData.append(
        "isPrintable",
        data.isPrintable !== undefined ? data.isPrintable.toString() : "true"
      );

      if (data.categoryDesignId !== undefined) {
        formData.append("categoryDesignId", data.categoryDesignId.toString());
      }

      if (data.features && data.features.length > 0) {
        formData.append("features", JSON.stringify(data.features));
      }

      if (data.components !== undefined) {
        formData.append("components", JSON.stringify(data.components));
      }

      // ✅ Handle existing images (URLs to keep)
      const existingImageUrls = data.existingImages || [];
      formData.append("existingImages", JSON.stringify(existingImageUrls));

      // ✅ Handle images to delete (for backend cleanup if needed)
      if (data.imagesToDelete && data.imagesToDelete.length > 0) {
        formData.append("imagesToDelete", JSON.stringify(data.imagesToDelete));
      }

      // ✅ Handle new images (Files to upload)
      if (data.newImages && data.newImages.length > 0) {
        data.newImages.forEach((file) => {
          formData.append("images", file, file.name);
        });
      }

      // Debug logging
      console.log("📤 Update Design Request:");
      console.log("   ID:", data.id);
      console.log("   Title:", data.title);
      console.log("   Existing images to keep:", existingImageUrls.length);
      console.log("   New images to upload:", data.newImages?.length || 0);
      console.log("   Images to delete:", data.imagesToDelete?.length || 0);
      
      // Log FormData contents
      console.log("   FormData entries:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`     ${key}: File(${value.name}, ${value.size} bytes)`);
        } else {
          const displayValue = value.length > 100 ? value.substring(0, 100) + '...' : value;
          console.log(`     ${key}: ${displayValue}`);
        }
      }

      const userInfo = localStorage.getItem("userInfo");
      if (!userInfo) {
        return rejectWithValue("User not authenticated");
      }
      
      const token = JSON.parse(userInfo)?.token;
      if (!token) {
        return rejectWithValue("Authentication token not found");
      }

      const response = await axios.put(
        `${url}/design/edit-design/${data.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ Don't set Content-Type - axios handles multipart/form-data automatically
          },
          timeout: 120000, // 2 minute timeout for large uploads
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            console.log(`   Upload progress: ${percentCompleted}%`);
          },
        }
      );

      console.log("✅ Update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Update error:", error);
      
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message || 
                       error.response?.data?.error ||
                       error.message ||
                       "Failed to update design";
        console.error("   Error details:", error.response?.data);
        return rejectWithValue(message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const updateDesignSlice = createSlice({
  name: "updateDesign",
  initialState,
  reducers: {
    resetUpdateDesign: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDesignFn.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateDesignFn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
        state.message = action.payload?.message || "Design updated successfully";
      })
      .addCase(updateDesignFn.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetUpdateDesign } = updateDesignSlice.actions;
export default updateDesignSlice.reducer;