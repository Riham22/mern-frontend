import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from './Slices/AuthSlice';
import taskReducer from './Slices/TaskSlice';
import notificationReducer from './Slices/NotificationSlice'

const store = configureStore({
    reducer: {
        auth: AuthReducer,
        tasks: taskReducer, 
        notifications: notificationReducer,

    },
  });
  export default store;
