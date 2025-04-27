// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import api from '../../services/api';

// const initialState = {
//     user: JSON.parse(localStorage.getItem('user')) || null,
//     accessToken: localStorage.getItem('accessToken') || null,
//     refreshToken: localStorage.getItem('refreshToken') || null,
//     isLoading: false,
//     error: null,
// };

// export const loginUser = createAsyncThunk(
//     'auth/loginUser',
//     async (credentials, { rejectWithValue }) => {
//         try {
//             const response = await api.post('/api/auth/login', credentials,{
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });

//             localStorage.setItem('accessToken', response.data.accessToken);
//             localStorage.setItem('refreshToken', response.data.refreshToken);
//             localStorage.setItem('user', JSON.stringify(response.data.user));
//             return response.data;
//         } catch (error) {
//             console.log(error)
//             return rejectWithValue(error.response?.data?.message || 'Login failed.');
//         }
//     }
// );

// export const logoutUser = createAsyncThunk(
//     'auth/logoutUser',
//     async (_, { getState, dispatch, rejectWithValue }) => {
//         try {
//             const { accessToken, refreshToken } = getState().auth;

//             const logoutAttempt = async (token) => {
//                 try {
//                     const response = await api.get('/api/auth/logout', {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                         },
//                     });
//                     localStorage.removeItem('accessToken');
//                     localStorage.removeItem('refreshToken');
//                     localStorage.removeItem('user');
//                     return response.data;
//                 } catch (error) {
//                     if (error.response?.status === 401 || error.response?.status === 403) {
//                         if (refreshToken) {
//                             try {
//                                 const refreshResponse = await api.post('/api/auth/refresh', { refreshToken });
//                                 const newAccessToken = refreshResponse.data.accessToken;
//                                 const newRefreshToken = refreshResponse.data.refreshToken;
//                                 localStorage.setItem('accessToken', newAccessToken);
//                                 localStorage.setItem('refreshToken', newRefreshToken);
//                                 dispatch(updateTokens({ accessToken: newAccessToken, refreshToken: newRefreshToken }));
//                                 // Retry logout with the new access token
//                                 return await logoutAttempt(newAccessToken);
//                             } catch (refreshError) {
//                                 console.error("Refresh token failed:", refreshError);
//                                 localStorage.removeItem('accessToken');
//                                 localStorage.removeItem('refreshToken');
//                                 localStorage.removeItem('user');
//                                 throw new Error('Logout failed: Refresh token invalid.');
//                             }
//                         } else {
//                             localStorage.removeItem('accessToken');
//                             localStorage.removeItem('refreshToken');
//                             localStorage.removeItem('user');
//                             throw new Error('Logout failed: No refresh token available.');
//                         }
//                     }
//                     throw error; // Re-throw other errors
//                 }
//             };

//             return await logoutAttempt(accessToken);

//         } catch (error) {
//             return rejectWithValue(error.message || 'Logout failed.');
//         }
//     }
// );

// export const getUserInfo = createAsyncThunk(
//     'auth/getUserInfo',
//     async (_, { getState, rejectWithValue }) => {
//         try {
//             const { accessToken } = getState().auth;
//             const response = await api.get('/api/auth/me', {
//                 headers: {
//                     Authorization: `Bearer ${accessToken}`,
//                 },
//             });
//             localStorage.setItem('user', JSON.stringify(response.data.data));
//             return response.data;
//         } catch (error) {
//             console.log(error)
//             return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info.');
//         }
//     }
// );

// const authSlice = createSlice({
//     name: 'auth',
//     initialState,
//     reducers: {
//         updateTokens: (state, action) => {
//             state.accessToken = action.payload.accessToken;
//             state.refreshToken = action.payload.refreshToken;
//         },
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(loginUser.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(loginUser.fulfilled, (state, action) => {
//                 console.log(action.payload)
//                 state.isLoading = false;
//                 state.user = action.payload.user;
//                 state.accessToken = action.payload.accessToken;
//                 state.refreshToken = action.payload.refreshToken;
//             })
//             .addCase(loginUser.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             })
//             .addCase(logoutUser.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(logoutUser.fulfilled, (state) => {
//                 state.isLoading = false;
//                 state.user = null;
//                 state.accessToken = null;
//                 state.refreshToken = null;
//             })
//             .addCase(logoutUser.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             })
//             .addCase(getUserInfo.pending, (state) => {
//                 state.isLoading = true;
//                 state.error = null;
//             })
//             .addCase(getUserInfo.fulfilled, (state, action) => {
//                 state.isLoading = false;
//                 state.user = action.payload.data;
//             })
//             .addCase(getUserInfo.rejected, (state, action) => {
//                 state.isLoading = false;
//                 state.error = action.payload;
//             });
//     },
// });

// export const { updateTokens } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api'; // Maan rahe hain ki api service configured hai

const initialState = {
    user: JSON.parse(localStorage.getItem('user')) || null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    isLoading: false,
    error: null,
};

// Helper function: Local storage aur state ko clear karne ke liye
const clearAuthData = (state) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    state.isLoading = false;
    state.user = null;
    state.accessToken = null;
    state.refreshToken = null;
    state.error = null; // Logout par purane errors clear karein
};

// --- Async Thunks ---

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await api.post('/api/auth/login', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Success par local storage set karein
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return response.data; // Yeh fulfilled action ka payload banega
        } catch (error) {
            console.error("Login API Error:", error.response?.data || error.message);
            // Error ko rejectWithValue ke saath bhejein taaki rejected reducer handle kar sake
            return rejectWithValue(error.response?.data?.message || 'Login failed.');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (_, { getState, rejectWithValue }) => {
        const { accessToken } = getState().auth;

        // Agar client-side par token pehle se hi nahi hai, toh logout ki zaroorat nahi
        if (!accessToken) {
            console.log("Client already logged out (no access token found).");
            // Ek success jaisa message return karein taki fulfilled reducer state clear kar de
            return { message: "Already logged out locally." };
        }

        try {
            // Backend logout API call karne ki koshish karein
            console.log("Attempting backend logout...");
            const response = await api.get('/api/auth/logout', {
                headers: {
                    // Token bhejein, bhale hi expired ho (backend handle karega)
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log("Backend logout successful:", response.data.message);
            return response.data; // Success message payload banega
        } catch (error) {
            // API call fail ho sakti hai (401, 403, network error, etc.)
            console.error("Logout API call failed:", error.response?.data?.message || error.message);
            // **IMPORTANT:** API fail hone ke bawajood, hum client-side logout pura karna chahte hain.
            // Hum rejectWithValue nahi karenge taaki fulfilled reducer state clear kar sake.
            // Hum ek custom message return kar sakte hain jo indicate kare ki client logout hua.
            return { message: "Client-side logout completed after API attempt (API might have failed)." };
            // Alternative (agar rejected mein clear karna hai):
            // return rejectWithValue(error.response?.data?.message || 'Logout API failed, clearing client state.');
        }
        // LocalStorage clearing ab reducers mein hogi.
    }
);

export const getUserInfo = createAsyncThunk(
    'auth/getUserInfo',
    async (_, { getState, rejectWithValue }) => {
        const { accessToken } = getState().auth;

        if (!accessToken) {
            return rejectWithValue('No access token found for getUserInfo.');
        }

        try {
            const response = await api.get('/api/auth/me', {
                headers: {
                    // Template literal sahi karein
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            // User info update karein local storage mein bhi
            localStorage.setItem('user', JSON.stringify(response.data.data));
            return response.data; // data payload banega
        } catch (error) {
            console.error("Get User Info API Error:", error.response?.data || error.message);
            // Agar user info fetch fail ho (e.g., token expired), toh shayad logout karna chahiye?
            // Abhi ke liye sirf error reject kar rahe hain.
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user info.');
        }
    }
);

// --- Slice Definition ---

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Yeh reducer background token refresh ke liye kaam aa sakta hai
        updateTokens: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        // Explicit client-side logout ke liye (agar zaroorat pade)
        forceLogout: (state) => {
            clearAuthData(state);
        },
    },
    extraReducers: (builder) => {
        builder
            // Login Reducers
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.refreshToken = action.payload.refreshToken;
                state.error = null; // Clear previous errors on successful login
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Error message from rejectWithValue
                // Login fail hone par state clear karna accha hai
                state.user = null;
                state.accessToken = null;
                state.refreshToken = null;
            })
            // Logout Reducers
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true; // Optional: Loading state during logout
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                // API call successful ho ya na ho (hamare thunk ke logic se),
                // hum client state clear karenge jab thunk resolve hoga.
                clearAuthData(state);
                console.log("Redux state cleared on logout fulfilled. Message:", action.payload.message);
            })
            .addCase(logoutUser.rejected, (state, action) => {
                // Yeh tabhi run hoga agar humne thunk mein rejectWithValue use kiya hota.
                // Current logic mein yeh use nahi ho raha, par safety ke liye clear kar dete hain.
                console.error("Logout rejected in reducer:", action.payload);
                clearAuthData(state);
                state.isLoading = false; // Loading state hatayein
                state.error = action.payload; // Error set karein
            })
            // Get User Info Reducers
            .addCase(getUserInfo.pending, (state) => {
                state.isLoading = true; // Consider if separate loading state is needed
                state.error = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.data; // Update user info
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload; // Error message
                // Optional: Agar user info fetch fail ho (token invalid), toh logout kar dein
                // clearAuthData(state);
                // console.log("getUserInfo failed, forcing local logout due to error:", action.payload);
            });
    },
});

export const { updateTokens, forceLogout } = authSlice.actions;
export default authSlice.reducer;
