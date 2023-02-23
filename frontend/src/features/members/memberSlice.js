import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import memberService from "./memberService";

const initialState = {
  allMembers: [],
  membersArr: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// GET All Members
export const getAll = createAsyncThunk(
  "members/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await memberService.getAll(token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// GET All Members for a specific group
export const getMembers = createAsyncThunk(
  "members/getSpecificMembers",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await memberService.getMembers(id, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update/Edit member
export const editMember = createAsyncThunk(
  "members/edit",
  async (memberData, thunkAPI) => {
    const { id } = memberData;

    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await memberService.editMember(id, memberData, token);
      console.log("response", response);
      return response;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const memberSlice = createSlice({
  name: "member",
  initialState,
  // this will delete everything in the traits array
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      //Get All members
      .addCase(getAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.allMembers = action.payload;
      })
      .addCase(getAll.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.allMembers = [];
      })

      //Get All members for a specific group --- this is reserved for admin users
      .addCase(getMembers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMembers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.membersArr = action.payload;
      })
      .addCase(getMembers.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.membersArr = [];
      })
      // Update / Edit
      .addCase(editMember.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editMember.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(editMember.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = memberSlice.actions;

export default memberSlice.reducer;
