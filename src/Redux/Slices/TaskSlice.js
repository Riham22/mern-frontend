import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const BASE_URL = 'https://mern-backend-l6sx.onrender.com'; 
const BASE_URL = 'https://mern-backend-production-4d08.up.railway.app';
//  'https://mern-backend-bx9x.onrender.com'; 


export const addTask = createAsyncThunk('add-task', async (task, thunkAPI) => {
  try {
    console.log("🚀 Sending task payload:", task); 
    const response = await axios.post(`${BASE_URL}/add`, task, { withCredentials: true });
    console.log("📦 FULL addTask response:", response.data); 
    if (!response.data.task) {
      throw new Error("⚠️ Task not returned from server. Got instead: " + JSON.stringify(response.data));
    }
    return response.data.task;
    
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

export const fetchTasks = createAsyncThunk('get-tasks', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`, { withCredentials: true });
    
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

export const updateTask = createAsyncThunk('edit', async ({ id, updatedData }, thunkAPI) => {
  try {
    const response = await axios.put(`${BASE_URL}/edit/${id}`, updatedData, { withCredentials: true });
    return response.data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('delete', async (taskId, thunkAPI) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${taskId}`, { withCredentials: true });
    return response.data.id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});


export const fetchUsers = createAsyncThunk(
  "tasks/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      });
      console.log("🎯 Users API Response:", response.data);

      return response.data.users;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    users: [],  
    status: 'idle',
    error: null,
  },
  reducers: {
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
    updateTaskFromSocket: (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex(task => task._id === updatedTask._id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    },
  },
  
  extraReducers: (builder) => {
    builder

      .addCase(addTask.pending, (state) => { state.status = 'loading'; })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const newTask = action.payload;
        if (Array.isArray(state.tasks)) {
          state.tasks.push(newTask);
        } else {
          state.tasks = [newTask];
        }
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Failed to add task";
        console.error("🟥 addTask failed with:", action.payload);
      });

    builder
      .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';

        if (Array.isArray(action.payload)) {
          state.tasks = action.payload;
        } else {
          state.tasks = [];
          console.warn('⚠️ fetchTasks returned unexpected data:', action.payload);
        }
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
    builder
    .addCase(updateTask.fulfilled, (state, action) => {
      const updatedTask = action.payload;
      const index = state.tasks.findIndex(task => task._id === updatedTask._id);
      if (index !== -1) {
        state.tasks[index] = updatedTask;
      }
    })
    builder
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      });

      builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload; // تخزين المستخدمين المسترجعين
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || "Failed to fetch users";
      });
  }
});

export const { removeTask } = taskSlice.actions;
export default taskSlice.reducer;
