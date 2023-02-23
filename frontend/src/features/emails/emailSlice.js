import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import emailService from "./emailService";

const initialState = {
  allEmails: [],
  emailsArr: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

// GET All Emails
export const getAll = createAsyncThunk("emails/getAll", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await emailService.getAll(token);
  } catch (error) {
    const message = error.response.data.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// GET All Members for a specific group
export const getSpecificEmail = createAsyncThunk(
  "emails/getSpecificEmail",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await emailService.getSpecificEmail(id, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create new email
export const createEmail = createAsyncThunk(
  "emails/create",
  async (emailData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await emailService.createEmail(emailData, token);
    } catch (error) {
      const message = error.response.data.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update/Edit email
export const editEmail = createAsyncThunk(
  "emails/edit",
  async (emailData, thunkAPI) => {
    const { id } = emailData;

    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await emailService.editEmail(id, emailData, token);
      console.log("response", response);
      return response;
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// delete email
export const deleteEmail = createAsyncThunk(
  "emails/delete",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await emailService.deleteEmail(id, token);
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const sendEmail = createAsyncThunk(
  "emails/send",
  async (emailData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await emailService.sendEmail(emailData, token);
    } catch (error) {
      const message =
        error.response.data.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const emailSlice = createSlice({
  name: "email",
  initialState,
  // this will delete everything in the traits array
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder

      //Get All emails
      .addCase(getAll.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAll.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.allEmails = action.payload;
      })
      .addCase(getAll.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.allEmails = [];
      })

      //Get All members for a specific group
      .addCase(getSpecificEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSpecificEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = "";
        state.emailsArr = action.payload;
      })
      .addCase(getSpecificEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
        state.emailsArr = [];
      })

      // create email
      .addCase(createEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.emailsArr.push(action.payload);
      })
      .addCase(createEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update / Edit
      .addCase(editEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(editEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //Delete
      .addCase(deleteEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //Send Email
      .addCase(sendEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = emailSlice.actions;

export default emailSlice.reducer;
