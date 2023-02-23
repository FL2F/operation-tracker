import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import groupService from "./groupService";

const initialState = {
  groupsArr: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// GET All Traits for the group
export const getAllGroups = createAsyncThunk(
  "groups/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await groupService.getAllGroups(token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const groupSlice = createSlice({
  name: "group",
  initialState,
  // this will delete everything in the traits array
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      //Get All members for group
      .addCase(getAllGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.groupsArr = action.payload;
      })
      .addCase(getAllGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.groupsArr = [];
      });
  },
});

export const { reset } = groupSlice.actions;

export default groupSlice.reducer;
