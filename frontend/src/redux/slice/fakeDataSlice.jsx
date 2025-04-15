import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { faker } from '@faker-js/faker';

const generateFakeDataAPI = async (options) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const generatedData = {};
      if (options.name) generatedData.name = faker.person.fullName();
      if (options.email) generatedData.email = faker.internet.email();
      if (options.phone) generatedData.phone = faker.phone.number('+91##########');
      if (options.pan) {
        const letters = faker.string.alpha({ length: 5, casing: 'upper' });
        const digits = faker.number.int({ min: 1000, max: 9999 }).toString();
        const lastLetter = faker.string.alpha({ length: 1, casing: 'upper' });
        generatedData.pan = letters + digits + lastLetter;
      }
      if (options.aadhar) { // Changed from options.addhar
        let aadhaar = '';
        for (let i = 0; i < 3; i++) {
          const part = faker.number.int({ min: 0, max: 9999 }).toString().padStart(4, '0');
          aadhaar += part + ' ';
        }
        generatedData.aadhar = aadhaar.trim(); // Changed key to 'aadhar'
      }
      if (options.address) generatedData.address = faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.state() + ' ' + faker.location.zipCode();
      resolve(generatedData);
    }, 500); // Simulate network latency
  });
};

const saveFakeDataAPI = async (data, getState) => {
  try {
    const accessToken = getState().auth.accessToken;
    const response = await api.post('/api/fack-data', data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      const error = response.data;
      throw new Error(error.message || 'Failed to save data');
    }

    return response.data.savedData;
  } catch (error) {
    console.error('Error saving data to backend:', error);
    throw error;
  }
};

const deleteFakeDataAPI = async (id, getState) => {
  try {
    const accessToken = getState().auth.accessToken;
    const response = await api.delete(`/api/fack-data/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      const error = response.data;
      throw new Error(error.message || 'Failed to delete data');
    }

    return id;
  } catch (error) {
    console.error('Error deleting data from backend:', error);
    throw error;
  }
};

// --- Code for fetching data ---
const fetchFakeDataAPI = async (getState) => {
  try {
    const accessToken = getState().auth.accessToken;
    const response = await api.get('/api/fack-data/saved', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.status !== 200) {
      const error = response.data;
      throw new Error(error.message || 'Failed to fetch saved data');
    }

    return response.data.savedData;
  } catch (error) {
    console.error('Error fetching saved data:', error);
    throw error;
  }
};

export const fetchFakeDataAsync = createAsyncThunk(
  'fakeData/fetchSaved',
  async (_, { getState }) => {
    const response = await fetchFakeDataAPI(getState);
    return response;
  }
);

export const generateFakeDataAsync = createAsyncThunk(
  'fakeData/generate',
  async (options) => {
    const response = await generateFakeDataAPI(options);
    return response;
  }
);

export const saveFakeDataAsync = createAsyncThunk(
  'fakeData/save',
  async (data, { getState }) => {
    const response = await saveFakeDataAPI(data, getState);
    return response;
  }
);

export const deleteFakeDataAsync = createAsyncThunk(
  'fakeData/delete',
  async (id, { getState }) => {
    await deleteFakeDataAPI(id, getState);
    return id;
  }
);

const initialState = {
  generatedData: null,
  savedData: [],
  generationOptions: {
    name: true,
    email: true,
    phone: true,
    pan: false,
    aadhar: false,
    address: false,
  },
  generateStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  generateError: null,
  saveStatus: 'idle',
  saveError: null,
  deleteStatus: 'idle',
  deleteError: null,
  fetchStatus: 'idle', // For fetching saved data
  fetchError: null,
};

export const fakeDataSlice = createSlice({
  name: 'fakeData',
  initialState,
  reducers: {
    setGenerationOption: (state, action) => {
      state.generationOptions[action.payload.name] = action.payload.checked;
    },
    // You might want a reducer to update the savedData when the component mounts
    // to fetch existing saved data from the backend
    setSavedData: (state, action) => {
      state.savedData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateFakeDataAsync.pending, (state) => {
        state.generateStatus = 'loading';
        state.generatedData = null;
        state.generateError = null;
      })
      .addCase(generateFakeDataAsync.fulfilled, (state, action) => {
        state.generateStatus = 'succeeded';
        state.generatedData = action.payload;
      })
      .addCase(generateFakeDataAsync.rejected, (state, action) => {
        state.generateStatus = 'failed';
        state.generateError = action.error.message;
        state.generatedData = null;
      })
      .addCase(saveFakeDataAsync.pending, (state) => {
        state.saveStatus = 'loading';
        state.saveError = null;
      })
      .addCase(saveFakeDataAsync.fulfilled, (state, action) => {
        state.saveStatus = 'succeeded';
        // Assuming the backend returns the saved data object with an 'id' field
        state.savedData.push({ ...action.payload, id: action.payload._id }); // Use _id if your MongoDB uses it
        state.generatedData = null; // Clear generated data after saving
      })
      .addCase(saveFakeDataAsync.rejected, (state, action) => {
        state.saveStatus = 'failed';
        state.saveError = action.error.message;
      })
      .addCase(deleteFakeDataAsync.pending, (state, action) => {
        state.deleteStatus = 'loading';
        state.deleteError = null;
      })
      .addCase(deleteFakeDataAsync.fulfilled, (state, action) => {
        state.deleteStatus = 'succeeded';
        state.savedData = state.savedData.filter((item) => item._id !== action.payload); // Use _id for MongoDB
      })
      .addCase(deleteFakeDataAsync.rejected, (state, action) => {
        state.deleteStatus = 'failed';
        state.deleteError = action.error.message;
      })
      // --- Extra reducers for fetching data ---
      .addCase(fetchFakeDataAsync.pending, (state) => {
        state.fetchStatus = 'loading';
        state.fetchError = null;
      })
      .addCase(fetchFakeDataAsync.fulfilled, (state, action) => {
        state.fetchStatus = 'succeeded';
        state.savedData = action.payload.map(item => ({ ...item, id: item._id })); // Assuming backend returns array of saved data with _id
      })
      .addCase(fetchFakeDataAsync.rejected, (state, action) => {
        state.fetchStatus = 'failed';
        state.fetchError = action.error.message;
      });
      // --- End of fetch data extra reducers ---
  },
});

export const { setGenerationOption, setSavedData } = fakeDataSlice.actions;

export const selectGeneratedData = (state) => state.fakeData.generatedData;
export const selectSavedData = (state) => state.fakeData.savedData;
export const selectGenerationOptions = (state) => state.fakeData.generationOptions;
export const selectGenerateStatus = (state) => state.fakeData.generateStatus;
export const selectGenerateError = (state) => state.fakeData.generateError;
export const selectSaveStatus = (state) => state.fakeData.saveStatus;
export const selectSaveError = (state) => state.fakeData.saveError;
export const selectDeleteStatus = (state) => state.fakeData.deleteStatus;
export const selectDeleteError = (state) => state.fakeData.deleteError;
export const selectFetchStatus = (state) => state.fakeData.fetchStatus; // For fetching
export const selectFetchError = (state) => state.fakeData.fetchError;   // For fetching

export default fakeDataSlice.reducer;