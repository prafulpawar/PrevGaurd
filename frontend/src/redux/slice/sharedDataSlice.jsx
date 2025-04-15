// sharedDataSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Assuming this is your Axios instance

const initialState = {
  apps: [],
  loading: false,
  error: null,
  adding: false,
  addingError: null,
  updating: false,
  updatingError: null,
  deleting: false,
  deletingError: null,
};

// Async Thunk for fetching shared data
export const fetchSharedData = createAsyncThunk(
  'sharedData/fetchSharedData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/data'); // Adjust the API endpoint if necessary
      return response.data.data; // Assuming your API returns data in this structure
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for adding shared data
export const addSharedData = createAsyncThunk(
  'sharedData/addSharedData',
  async (newAppData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post('/api/data', newAppData); // Adjust the API endpoint
      dispatch(fetchSharedData()); // Refetch data after successful add
      return response.data.savedUser; // Assuming your API returns the saved user data (optional for UI update if refetching)
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for updating shared data
export const updateSharedData = createAsyncThunk(
  'sharedData/updateSharedData',
  async ({ id, updatedData }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put(`/api/data/${id}`, updatedData); // Adjust the API endpoint
      dispatch(fetchSharedData()); // Refetch data after successful update
      return response.data.updatedData; // Assuming your API returns the updated data
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async Thunk for deleting shared data
export const deleteSharedData = createAsyncThunk(
  'sharedData/deleteSharedData',
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await api.delete(`/api/data/${id}`); // Adjust the API endpoint
      dispatch(fetchSharedData()); // Refetch data after successful delete
      return id; // Return the ID of the deleted item (optional for UI update if refetching)
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sharedDataSlice = createSlice({
  name: 'sharedData',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAddingError: (state) => {
      state.addingError = null;
    },
    clearUpdatingError: (state) => {
      state.updatingError = null;
    },
    clearDeletingError: (state) => {
      state.deletingError = null;
    },
    // You can add more synchronous reducers as needed for your slice
    // For example, to directly update a part of the state without an API call:
    // updateAppName: (state, action) => {
    //   state.currentApp.name = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder
      // Cases for fetchSharedData
      .addCase(fetchSharedData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSharedData.fulfilled, (state, action) => {
        state.loading = false;
        state.apps = action.payload;
      })
      .addCase(fetchSharedData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cases for addSharedData
      .addCase(addSharedData.pending, (state) => {
        state.adding = true;
        state.addingError = null;
      })
      .addCase(addSharedData.fulfilled, (state) => {
        state.adding = false;
      })
      .addCase(addSharedData.rejected, (state, action) => {
        state.adding = false;
        state.addingError = action.payload;
      })
      // Cases for updateSharedData
      .addCase(updateSharedData.pending, (state) => {
        state.updating = true;
        state.updatingError = null;
      })
      .addCase(updateSharedData.fulfilled, (state) => {
        state.updating = false;
      })
      .addCase(updateSharedData.rejected, (state, action) => {
        state.updating = false;
        state.updatingError = action.payload;
      })
      // Cases for deleteSharedData
      .addCase(deleteSharedData.pending, (state) => {
        state.deleting = true;
        state.deletingError = null;
      })
      .addCase(deleteSharedData.fulfilled, (state) => {
        state.deleting = false;
      })
      .addCase(deleteSharedData.rejected, (state, action) => {
        state.deleting = false;
        state.deletingError = action.payload;
      });
  },
});

// Export async thunks (only from slice.actions)
export const {
 
  clearError,
  clearAddingError,
  clearUpdatingError,
  clearDeletingError,
} = sharedDataSlice.actions;

// Export selectors
export const selectApps = (state) => state.sharedData.apps;
export const selectLoading = (state) => state.sharedData.loading;
export const selectError = (state) => state.sharedData.error;
export const selectIsAdding = (state) => state.sharedData.adding;
export const selectAddError = (state) => state.sharedData.addingError;
export const selectIsUpdating = (state) => state.sharedData.updating;
export const selectUpdateError = (state) => state.sharedData.updatingError;
export const selectIsDeleting = (state) => state.sharedData.deleting;
export const selectDeleteError = (state) => state.sharedData.deletingError;

// Export the reducer
export default sharedDataSlice.reducer;