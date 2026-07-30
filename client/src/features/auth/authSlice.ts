// TODO: createSlice({ name: 'auth', ... })，state: { user, token, isAuthenticated }
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: { id: string; userName: string; role: string } | null;
  token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{user: AuthState['user'], token: string}>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        }
    }
})

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;