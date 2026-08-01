import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  role: 'patient' | 'doctor' | null;
  name: string | null;
  email: string | null;
  specialization: string | null;
}

const initialState: AuthState = {
  role: null,
  name: null,
  email: null,
  specialization: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserCredentials: (
      state,
      action: PayloadAction<{
        role: 'patient' | 'doctor';
        name: string;
        email:string;
        specialization?: string;
      }>
    ) => {
      state.role = action.payload.role;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.specialization = action.payload.specialization || null;
    },
    logout: (state) => {
      state.role = null;
      state.name = null;
      state.specialization = null;
    },
  },
});

export const { setUserCredentials, logout } = authSlice.actions;
export default authSlice.reducer;