import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import HttpError from "constants/HttpError";
import ajaxRequest, { Methods } from "helpers/ajaxRequest";
import { RootState } from "reduxStore";

// Define the shape of the auth state
interface AuthState {
  accessToken: string;
  expiresAt: string;
  error: string;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
}

const initialState: AuthState = {
  accessToken: "",
  expiresAt: "",
  isSuccess: false,
  isLoading: false,
  isError: false,
  error: "",
};

type LoginSuccessResponseType = {
  status: number;
  data: { accessToken: string; expiresAt: string };
};

export const login = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await ajaxRequest("api/user/login", Methods.POST, {
        email,
        password,
      });
      return response as LoginSuccessResponseType;
    } catch (error) {
      const errorMessage = (error as HttpError).message;
      return rejectWithValue(errorMessage);
    }
  }
);

const auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isSuccess = false;
        state.isLoading = true;
        state.isError = false;
        state.error = "";
      })
      .addCase(
        login.fulfilled,
        (state, { payload }: PayloadAction<LoginSuccessResponseType>) => {
          state.isLoading = false;
          const { accessToken, expiresAt } = payload.data;
          state.accessToken = accessToken;
          state.expiresAt = expiresAt;
          state.isSuccess = true;
          state.error = "";
          state.isError = false;
        }
      )
      .addCase(login.rejected, (state, { payload }) => {
        state.isSuccess = false;
        state.isLoading = false;
        state.isError = true;
        state.error = payload as string;
        state.accessToken = "";
        state.expiresAt = "";
      });
  },
});

// Selectors to access the auth state
export const selectAuth = (state: RootState) => state.auth;

export default auth.reducer;
export const { resetAuth } = auth.actions;
