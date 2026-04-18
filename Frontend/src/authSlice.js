import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

// Register Thunk
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            console.log(userData);
            const response = await axiosClient.post('/user/register', userData);
            return response.data; // Usually { success: true }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Registration failed");
        }
    }
);

// Verify OTP Thunk
export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (otpData, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/verifyOtp', otpData);
            if (response.data.success) {
                return response.data;
            }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Invalid OTP");
        }
    }
);
// resend-otp Thunk
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async (emailId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/user/resend-otp", { emailId });
      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to resend OTP"
      );
    }
  }
);


// Create Async Thunk for Login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await axiosClient.post('/user/login', credentials);
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong"
            );
        }
    }
);
// Logout

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post('/user/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);



//  create Asynnc thunk for getProfile
export const getProfile = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get('/user/getProfile');
    //   console.log(response.data);
      return response.data.user; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);   

// update-profile
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch("/user/updateProfile", userData);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

// reset-password-request
export const resetPasswordRequest = createAsyncThunk(
  "auth/resetPasswordRequest",
  async (emailId, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/user/reset-password-request", {
        emailId,
      });

      return res.data; // success + message + emailId
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to send reset OTP"
      );
    }
  }
);

// reset-password-confirm
export const resetPasswordConfirm = createAsyncThunk(
  "auth/resetPasswordConfirm",
  async ({ emailId, otp, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/user/reset-password-confirm", {
        emailId,
        otp,
        newPassword,
      });

      return res.data; // success + message
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to reset password"
      );
    }
  }
);
// updatePassword
export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async ({ oldPassword, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosClient.post("/user/update-password", {
        oldPassword,
        newPassword,
        confirmPassword,
      });

      return res.data.message;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Password update failed"
      );
    }
  }
);


const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        profile: null,
        isAuthenticated: false,
        isOtpSent: false, 
        loading: true,
        error: null,
        resetEmail: null,
        resetOtpSent: false,
        resetSuccess: false,
        resetMessage: null,
        passwordMessage: null,
        resendMessage: null,


    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        resetOtpStep: (state) => {
            state.isOtpSent = false;
        },
        clearResetState: (state) => {
            state.resetEmail = null;
            state.resetOtpSent = false;
            state.resetSuccess = false;
            state.resetMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register Cases
            .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(registerUser.fulfilled, (state) => { 
                state.loading = false; 
                state.isOtpSent = true; 
            })
            .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // Login Cases
            .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = !!action.payload;;
                state.user = action.payload.user;
            })
            .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // OTP Verification Cases
            .addCase(verifyOtp.pending, (state) => { state.loading = true; })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.isAuthenticated = !!action.payload;;
            })
            
            .addCase(verifyOtp.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

            // getProfile
            .addCase(getProfile.pending, (state) => {
            state.loading = true;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload;
            state.isAuthenticated = !!action.payload;;
            })
            .addCase(getProfile.rejected, (state) => {
            state.loading = false;
            state.profile = null;
            state.isAuthenticated = false;
            })
            // logout
            .addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            })
            .addCase(logoutUser.rejected, (state, action) => {
            state.error = action.payload;
            })
            // Reset-Password-Request
            .addCase(resetPasswordRequest.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(resetPasswordRequest.fulfilled, (state, action) => {
            state.loading = false;
            state.resetOtpSent = true;
            state.resetEmail = action.payload.emailId;
            state.resetMessage = action.payload.message;
            })
            .addCase(resetPasswordRequest.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            })
            // Reset-Password-confirm
            .addCase(resetPasswordConfirm.pending, (state) => {
            state.loading = true;
            state.error = null;
            })
            .addCase(resetPasswordConfirm.fulfilled, (state, action) => {
            state.loading = false;
            state.resetSuccess = true;
            state.resetMessage = action.payload.message;
            })
            .addCase(resetPasswordConfirm.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            })
            // updateUserProfile
            .addCase(updateUserProfile.pending, (state) => {
            state.loading = true;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            })
            //update-Password
            .addCase(updatePassword.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(updatePassword.fulfilled, (state, action) => {
              state.loading = false;
              state.passwordMessage = action.payload;
            })
            .addCase(updatePassword.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })
            // resend-otp for registration
            .addCase(resendOtp.pending, (state) => {
              state.loading = true;
              state.error = null;
            })
            .addCase(resendOtp.fulfilled, (state, action) => {
              state.loading = false;
              state.resendMessage = action.payload;
            })
            .addCase(resendOtp.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            });




    }
});

export const { clearError, resetOtpStep,clearResetState } = authSlice.actions;
export default authSlice.reducer;

