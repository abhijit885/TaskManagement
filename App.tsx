/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from './lib/src/theme/ThemeContext';
import store from './lib/src/redux/store';
import AppNavigator from './lib/src/navigation/AppNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef, processPendingNavigation } from './RootNavigation';
import { createStackNavigator } from '@react-navigation/stack';
import { fetchToken } from './lib/src/redux/slices/authSlice';
import { useEffect } from 'react';
import MainNavigator from './lib/src/navigation/MainNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { FIREBASE_API_KEY } from 'react-native-dotenv';

// function AppContent() {

// }

function App() {
  const [localToken, setLocalToken] = React.useState<any>(null);
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createStackNavigator();
  const dispatch = useDispatch();
  const verifyToken = useSelector<any>(state => state.user);
  console.log("verifyToken in App.tsx", verifyToken);
  const getToken = async () => {
   var fetchToken2 = await dispatch(fetchToken())
   console.log("fetchToken2 in App.tsx", fetchToken2?.payload);
   setLocalToken(fetchToken2?.payload);
  };
  useEffect(() => {
    getToken();
    console.log("FIREBASE_API_KEY>>>>",FIREBASE_API_KEY);  // Access the Firebase API Key

  }, [verifyToken]);

  return (
    <ThemeProvider>
      {localToken ? <MainNavigator /> : <AppNavigator />}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
