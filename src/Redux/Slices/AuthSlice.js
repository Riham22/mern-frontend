import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { connectSocket, getSocket } from '../../utils/socketClient';


// const front ='اففحسmern-backend-production-4d08.up.railway.app';
// const myLink =`https://mern-backend-l6sx.onrender.com`;

const myLink ='https://mern-backend-production-4d08.up.railway.app';
// `https://mern-backend-bx9x.onrender.com`

export const loginUser = createAsyncThunk(
  "/login",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${myLink}/login`, userData, {
        withCredentials: true,
      });

      if (!response.data?.user || !response.data?.token) {
        return rejectWithValue(response.data?.message || "Invalid username or password");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login error");
    }
  }
);



export const registerUser = createAsyncThunk(
  "/register",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.post(`${myLink}/register`, userData, {
        withCredentials: true,
      });

      if (!response.data?.user || !response.data?.token) {
        return rejectWithValue(response.data?.message || "Signup failed");
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      dispatch(setUser({
        user: response.data.user,
        token: response.data.token,
      }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Signup error");
    }
  }
);





export const forgotPassword = createAsyncThunk(
  '/forgot',
  async (username, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${myLink}/forgot`, { username }, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'reset',
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${front}/reset/${token}`, { newPassword }, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.response?.data?.message || 'Failed to reset password');
    }
  }
);
export const logoutUser = createAsyncThunk(
  'logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${myLink}/logout`, null, { withCredentials: true });
      console.log('Logged Out Successfully');
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
export const loadUser = createAsyncThunk(
  'verify',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${myLink}/home`, {
        withCredentials: true,
      });
      if (!res.data.status) {
        return rejectWithValue("User not authenticated");
      }
      
      if (res.data.status) {
        console.log( {username: res.data.user });
        
        return  res.data.user; 
        
      } else {
        return rejectWithValue("User not authenticated");
      }
      

    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


const initialState = {
  user: localStorage.getItem("user") || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
  message: null,
};


const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
        const socket = connectSocket(action.payload.token);
  socket.emit("user_logged_in", action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });


      builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token); 
        const socket = connectSocket(action.payload.token);
  socket.emit("user_registered", action.payload.user);

      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

      builder
      .addCase(loadUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });

    builder
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload?.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });

    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.message = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message;
      });


      builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user"); 

      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        localStorage.removeItem("user");
        const socket = getSocket();
        if (socket) {
          socket.emit("user_logged_out");
          socket.disconnect(); 
        }
      });
  },
});

export const { clearErrors, setUser, logOut } = AuthSlice.actions;

export default AuthSlice.reducer;
