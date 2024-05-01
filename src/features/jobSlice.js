import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params, { rejectWithValue }) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify(params);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
    };

    const response = await fetch('https://api.weekday.technology/adhoc/getSampleJdJSON', requestOptions);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const result = await response.json();
    return result;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    isLoading: false,
    error: null,
    hasMore: true,
  },
  reducers: {},
  extraReducers: {
    [fetchJobs.pending]: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    [fetchJobs.fulfilled]: (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.jobs = [...state.jobs, ...action.payload.jobs];
      state.hasMore = action.payload.jobs.length > 0;
    },
    [fetchJobs.rejected]: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export default jobsSlice.reducer;
