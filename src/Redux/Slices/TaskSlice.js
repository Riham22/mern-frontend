import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const BASE_URL = 'https://mern-backend-l6sx.onrender.com'; 
const BASE_URL ='mern-backend-production-4d08.up.railway.app';
//  'https://mern-backend-bx9x.onrender.com'; 


export const addTask = createAsyncThunk('add', async (task, thunkAPI) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, task);
    return response.data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

export const fetchTasks = createAsyncThunk('tasks', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

export const updateTask = createAsyncThunk('edit', async ({ id, updatedData }, thunkAPI) => {
  try {
    const response = await axios.put(`${BASE_URL}/edit/${id}`, updatedData);
    return response.data.task;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update task');
  }
});

export const deleteTask = createAsyncThunk('delete', async (taskId, thunkAPI) => {
  try {
    const response = await axios.delete(`${BASE_URL}/delete/${taskId}`);
    return response.data.id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Something went wrong');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    removeTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(addTask.pending, (state) => { state.status = 'loading'; })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks.push(action.payload);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(fetchTasks.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
 
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      });
  }
});

export const { removeTask } = taskSlice.actions;
export default taskSlice.reducer;
