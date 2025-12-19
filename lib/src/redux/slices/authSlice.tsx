import AsyncStorage from '@react-native-async-storage/async-storage';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as Keychain from 'react-native-keychain';
import { auth } from '../../firebase/config';
import Toast from 'react-native-toast-message';

interface Initial {
  loginToken: any;
  globalLoading: boolean;
}

const initialState: Initial = {
  loginToken: '',
  globalLoading: false,
};

export const fetchToken: any = createAsyncThunk(
  'FetchToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = await Keychain.getGenericPassword({
        service: 'accessToken',
      });
      if (token) {
        console.log('token.password from fetch Token function', token.password);
        const accessToken = token.password;
        return accessToken;
      } else {
        const res = null;
        return res;
      }
    } catch (e: any) {
      return rejectWithValue('Unable To Fetch Token');
    }
  },
);

export const signInUser: any = createAsyncThunk(
  'SignInUser',
  async (body: any, { rejectWithValue }) => {
    console.log('LOGIN BODY >>>> ', body);
    try {
      const result = await auth().signInWithEmailAndPassword(
        body.email,
        body.password,
      );
      console.log('User Login Result:', result?.user?.uid);
      Keychain.setGenericPassword('AccessToken', result?.user?.uid, {
        service: 'accessToken',
      });
      await AsyncStorage.setItem('loginKey', result?.user?.uid);
      const verifyEd = result?.user?.uid;
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
        visibilityTime: 2000,
      });
      return verifyEd;
    } catch (error: any) {
      console.log('LOGIN ERROR >>>> ', error);
      Toast.show({
        type: 'error',
        text1: 'Invalid Credential',
        text2: 'Please check your email and password',
        visibilityTime: 3000,
      });
      return rejectWithValue('Invalid credentials');
    }
  },
);

export const signUpUser: any = createAsyncThunk(
  'SignUpUser',
  async (body: any, { rejectWithValue, dispatch }) => {
    console.log('SIGNUP BODY >>>> ', body);
    try {
      const userSignup = await auth().createUserWithEmailAndPassword(
        body.email,
        body.password,
      );
      console.log('User SignUp Result:', userSignup?.user?.uid);
      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Please login with your credentials',
        visibilityTime: 2000,
      });

      return userSignup;
    } catch (error: any) {
      console.log('SIGNUP ERROR >>>> ', error);
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error?.message || 'Please try again',
        visibilityTime: 3000,
      });
      return rejectWithValue(error?.message || 'Signup failed');
    }
  },
);

export const signOut: any = createAsyncThunk(
  'SignOut',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await Keychain.resetGenericPassword({ service: 'accessToken' });
      Toast.show({
        type: 'success',
        text1: 'Logout Successfully',
      });
    } catch (e) {
      console.log('LogOut Remove AccessToken error !!!...', e);
      return rejectWithValue('Unable To Logout');
    }
  },
);

const authSlice = createSlice({
  name: 'userAuth',
  initialState: initialState,
  reducers: {},
  extraReducers: builder => {
    //LOG_IN
    builder.addCase(signInUser.pending, (state, _) => {
      state.globalLoading = true;
      console.log('Login pending...');
    });
    builder.addCase(signInUser.fulfilled, (state, action) => {
      state.globalLoading = false;
      state.loginToken = action.payload;
      Keychain.setGenericPassword('AccessToken', action.payload, {
        service: 'accessToken',
      });
    });
    builder.addCase(signInUser.rejected, (state, _) => {
      state.globalLoading = false;
      console.log('Login Rejected...');
    });
    //LOG_OUT
    builder.addCase(signOut.pending, (state, _) => {
      state.globalLoading = true;
    });
    builder.addCase(signOut.fulfilled, (state, _) => {
      state.globalLoading = false;
      Keychain.resetGenericPassword({ service: 'accessToken' });
      state.loginToken = null;
      AsyncStorage.removeItem('LANG');
    });
    builder.addCase(signOut.rejected, (state, _) => {
      state.globalLoading = false;
    });
    //REGISTER
    builder.addCase(signUpUser.pending, (state, _) => {
      state.globalLoading = true;
    });
    builder.addCase(signUpUser.fulfilled, (state, _) => {
      state.globalLoading = false;
    });
    builder.addCase(signUpUser.rejected, (state, _) => {
      state.globalLoading = false;
    });
  },
});

export default authSlice.reducer;
