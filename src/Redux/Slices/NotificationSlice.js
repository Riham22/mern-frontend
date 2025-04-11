import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (notification) => {
    return notification; 
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    status: 'idle',
  },
  reducers: {
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNotification.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications.push(action.payload);
      })
      .addCase(addNotification.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
