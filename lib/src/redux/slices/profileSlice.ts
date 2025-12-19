import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProfileState {
  user: User | null;
  token: string | null;
  fcmToken: string;
  darkMode: boolean;
}

const initialState: ProfileState = {
  user: null,
  token: null,
  fcmToken: '',
  darkMode: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setFCMToken: (state, action: PayloadAction<any>) => {
      state.fcmToken = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

export const {
  setProfile,
  setFCMToken,
  setDarkMode,
} = profileSlice.actions;
export default profileSlice.reducer;
