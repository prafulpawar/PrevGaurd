


import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api'; 


const initialState = {
    vaultId: null,
    
    vaultState: 'unknown',
    folders: [], 
    
    itemsByFolderId: {},
    currentItem: null, 
    decryptedContent: null, 
    status: 'idle',
    currentOperation: null,
    error: null, 
};


const getToken = (getState) => getState().auth?.accessToken;


export const checkVaultStatusThunk = createAsyncThunk(
    'vault/checkStatus',
    async (_, { rejectWithValue, getState }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No auth token found');
        try {
            const response = await api.get('/api/vault/data', { headers: { Authorization: `Bearer ${token}` } });
            
            return { exists: true, data: response.data };
        } catch (error) {
            if (error.response?.status === 404) {
                
                return { exists: false };
            }
          
            const message = error.response?.data?.message || error.message || 'Failed to check vault status';
            return rejectWithValue(message);
        }
    }
);

export const registerVaultThunk = createAsyncThunk(
    'vault/register',
    async (data, { rejectWithValue, getState }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No auth token found');
        try {
            const response = await api.post('/api/vault/register', data, { headers: { Authorization: `Bearer ${token}` } });
            return response.data; 
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Vault registration failed';
            return rejectWithValue(message);
        }
    }
);

export const loginVaultThunk = createAsyncThunk(
    'vault/login',
    async (data, { rejectWithValue, getState }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No auth token found');
        try {
           
            const response = await api.post('/api/vault/login', data, { headers: { Authorization: `Bearer ${token}` } });
            return response.data; // Expects { message }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Vault login failed';
            return rejectWithValue(message);
        }
    }
);

export const fetchVaultDataThunk = createAsyncThunk(
    'vault/fetchData',
    async (_, { rejectWithValue, getState }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No auth token found');
        try {
            const response = await api.get('/api/vault/data', { headers: { Authorization: `Bearer ${token}` } });
            return response.data; 
        } catch (error) {
             if (error.response?.status === 404) {
                 return rejectWithValue('Vault not found. Needs registration.');
             }
            const message = error.response?.data?.message || error.message || 'Failed to fetch vault data';
            return rejectWithValue(message);
        }
    }
);

export const addFolderThunk = createAsyncThunk(
    'vault/addFolder',
    async (data, { rejectWithValue, getState }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No auth token found');
        try {
            const response = await api.post('/api/vault/folder', data, { headers: { Authorization: `Bearer ${token}` } });
            return response.data; 
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add folder';
            return rejectWithValue(message);
        }
    }
);

export const addItemThunk = createAsyncThunk(
    'vault/addItem',
    async ({ folderId, itemData }, { rejectWithValue, getState }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No auth token found');
        try {
            const response = await api.post(`/api/vault/item/${folderId}`, itemData, { headers: { Authorization: `Bearer ${token}` } });
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to add item';
            return rejectWithValue(message);
        }
    }
);

export const decryptItemThunk = createAsyncThunk(
    'vault/decryptItem',
    async ({ itemId, vaultPassword }, { rejectWithValue, getState }) => {
        const token = getToken(getState);
        if (!token) return rejectWithValue('No auth token found');
        try {
            const response = await api.post(`/api/vault/item/decrypt/${itemId}`, { vaultPassword }, { headers: { Authorization: `Bearer ${token}` } });
            return response.data; // Expects { decryptedContent }
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Failed to decrypt item';
            return rejectWithValue(message);
        }
    }
);


const vaultSlice = createSlice({
    name: "vaultData",
    initialState,
 
    reducers: {
     
        resetVaultState: (state) => {
            state.vaultId = null;
            state.vaultState = 'locked'; 
            state.folders = [];
            state.itemsByFolderId = {};
            state.currentItem = null;
            state.decryptedContent = null;
            state.status = 'idle';
            state.error = null;
            state.currentOperation = null;
        },
       
        clearDecryption: (state) => {
            state.decryptedContent = null;
            state.currentItem = null; 
            state.error = null;
           
            if (state.currentOperation === 'decryptItem') {
                 state.status = 'idle';
                 state.currentOperation = null;
            }
        },
       
        setVaultUiState: (state, action) => {
           
            const validStates = ['unknown', 'needs_register', 'needs_login', 'logged_in', 'locked'];
            if (validStates.includes(action.payload)) {
                state.vaultState = action.payload;
                
                state.error = null;
                state.status = 'idle';
                state.currentOperation = null;
            }
        },
        
         setCurrentItem: (state, action) => {
            state.currentItem = action.payload; 
            state.decryptedContent = null;
             state.error = null;
             state.status = 'idle';
             state.currentOperation = null;
        },
    },
   
    extraReducers: (builder) => {
      
        const handlePending = (state, action) => {
            state.status = 'loading';
            state.error = null;
         
            state.currentOperation = action.type.split('/')[1];
           
            if (state.currentOperation !== 'decryptItem') {
                 state.decryptedContent = null;
            }
        };

      
        const handleRejected = (state, action) => {
            state.status = 'failed';
         
            state.error = action.payload || 'An unknown error occurred';
            state.currentOperation = action.type.split('/')[1];
            
            if (state.currentOperation === 'decryptItem') {
                state.decryptedContent = null;
            }
        };

        builder
          
            .addCase(checkVaultStatusThunk.pending, handlePending)
            .addCase(checkVaultStatusThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOperation = 'checkStatus';
                if (action.payload.exists) {
                    state.vaultState = 'needs_login'; 
                } else {
                    state.vaultState = 'needs_register';
                }
                state.error = null; 
            })
            .addCase(checkVaultStatusThunk.rejected, handleRejected)

          
            .addCase(registerVaultThunk.pending, handlePending)
            .addCase(registerVaultThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOperation = 'register';
                state.vaultState = 'needs_login'; 
                state.vaultId = action.payload.vaultId; 
                state.error = null;
            })
            .addCase(registerVaultThunk.rejected, handleRejected)

           
            .addCase(loginVaultThunk.pending, handlePending)
            .addCase(loginVaultThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOperation = 'login';
              
                state.error = null;
            })
            .addCase(loginVaultThunk.rejected, handleRejected)

           
            .addCase(fetchVaultDataThunk.pending, handlePending)
            .addCase(fetchVaultDataThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOperation = 'fetchData';
                state.vaultState = 'logged_in'; 
                state.vaultId = action.payload.vaultId;
                state.folders = action.payload.folders;
               
                state.itemsByFolderId = {};
                action.payload.folders.forEach(folder => {
                    state.itemsByFolderId[folder._id] = folder.items || [];
                });
                state.error = null;
            })
            .addCase(fetchVaultDataThunk.rejected, (state, action) => {
               
                handleRejected(state, action);
              
                if (action.payload === 'Vault not found. Needs registration.') {
                    state.vaultState = 'needs_register'; 
                } else {
                  
                    state.vaultState = 'needs_login';
                }
                
                state.folders = [];
                state.itemsByFolderId = {};
                state.vaultId = null;
            })

        
            .addCase(addFolderThunk.pending, handlePending)
            .addCase(addFolderThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOperation = 'addFolder';
                state.folders.push(action.payload.folder);
               
                state.itemsByFolderId[action.payload.folder._id] = [];
                state.error = null;
            })
            .addCase(addFolderThunk.rejected, handleRejected)

            
            .addCase(addItemThunk.pending, handlePending)
            .addCase(addItemThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOperation = 'addItem';
                const { folderId, item } = action.payload;

              
                if (!state.itemsByFolderId[folderId]) {
                    state.itemsByFolderId[folderId] = []; 
                }
                state.itemsByFolderId[folderId].push(item);

               
                const folderIndex = state.folders.findIndex(f => f._id === folderId);
                if (folderIndex !== -1) {
                    if (!state.folders[folderIndex].items) {
                        state.folders[folderIndex].items = []; 
                    }
                    state.folders[folderIndex].items.push(item);
                }
                state.error = null;
            })
            .addCase(addItemThunk.rejected, handleRejected)

          
            .addCase(decryptItemThunk.pending, handlePending)
            .addCase(decryptItemThunk.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.currentOperation = 'decryptItem';
                state.decryptedContent = action.payload.decryptedContent;
                state.error = null;
            })
            .addCase(decryptItemThunk.rejected, handleRejected);

           
    }
});


export const {
    resetVaultState,
    clearDecryption,
    setVaultUiState,
    setCurrentItem
} = vaultSlice.actions;


export const selectVaultState = (state) => state.vaultData.vaultState;
export const selectVaultStatus = (state) => state.vaultData.status;
export const selectVaultError = (state) => state.vaultData.error;
export const selectCurrentOperation = (state) => state.vaultData.currentOperation;
export const selectFolders = (state) => state.vaultData.folders;

export const selectItemsForFolder = (folderId) => (state) => state.vaultData.itemsByFolderId[folderId] || [];
export const selectCurrentItem = (state) => state.vaultData.currentItem;
export const selectDecryptedContent = (state) => state.vaultData.decryptedContent;
export const selectVaultId = (state) => state.vaultData.vaultId;


export default vaultSlice.reducer;