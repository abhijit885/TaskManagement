import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProfileState {
  user: User | null;
  token: string | null;
  updatePlanList: boolean;
  updateQuestionaries: boolean;
  fcmToken: string;
  darkMode: boolean;
  rememberMeData: any;
  selectedLanguage: string;
}

const initialState: ProfileState = {
  user: null,
  token: null,
  updatePlanList: false,
  updateQuestionaries: false,
  fcmToken: '',
  darkMode: false,
  rememberMeData: null,
  selectedLanguage: 'he',
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    updatePlanList1: (state, action: PayloadAction<boolean>) => {
      state.updatePlanList = action.payload;
    },
    updateQuestionList: (state, action: PayloadAction<boolean>) => {
      state.updateQuestionaries = action.payload;
    },
    setFCMToken: (state, action: PayloadAction<any>) => {
      state.fcmToken = action.payload;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    setRememberMeCookies(state, action: PayloadAction<null | string>) {
      console.log('Set Remember Me Cookies :::::', action.payload);
      state.rememberMeData = action.payload;
    },
    setSelectedLanguauge: (state, action: PayloadAction<string>) => {
      state.selectedLanguage = action.payload;
    },
  },
});

export const {
  setProfile,
  updatePlanList1,
  setFCMToken,
  updateQuestionList,
  setDarkMode,
  setRememberMeCookies,
  setSelectedLanguauge,
} = profileSlice.actions;
export default profileSlice.reducer;
