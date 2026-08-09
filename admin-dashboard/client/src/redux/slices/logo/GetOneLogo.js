import { errorMess, url } from '@/redux/API'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'

const initialState = {
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
  data: {},
}

// Async function for sign-up
export const getOneLogoFn = createAsyncThunk(
  'getOneLogo',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${url}/logo/one-logo/${id}`)
      return response.data.result
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.errors) {
          return rejectWithValue(error.response.data.errors)
        }
        return rejectWithValue(error.response?.data?.message || errorMess)
      }
      return rejectWithValue(errorMess)
    }
  }
)

// Slice definition
export const getOneLogoSlice = createSlice({
  name: 'getOneLogo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneLogoFn.pending, (state) => {
      state.isLoading = true
      state.isError = false
      state.isSuccess = false
      state.message = {} // Clear previous errors
    })
    builder.addCase(getOneLogoFn.fulfilled, (state, action) => {
      state.isLoading = false
      state.isSuccess = true
      state.data = action.payload
    })
    builder.addCase(getOneLogoFn.rejected, (state, action) => {
      state.isLoading = false
      state.isError = true
      state.message = action.payload
    })
  },
})
