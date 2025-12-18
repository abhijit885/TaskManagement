import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View, I18nManager, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { setProfile } from '../redux/slices/profileSlice';
import { rootState as RootState } from '../redux/store';
import { navigationRef, processPendingNavigation } from '../../../RootNavigation';
import HomeScreen from '../screens/home/HomeScreen';
import { signOut } from '../redux/slices/authSlice';
import { useThemeContext } from '../theme/ThemeContext';
import Colors from '../theme/colors';

const Stack = createStackNavigator();
const MainStack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<any>('Splash');
  const [profileLoading, setProfileLoading] = useState(false); // Profile API
  const selectedLanguage = useAppSelector(
    (state: RootState) => state.profile.selectedLanguage,
  );
  const dispatch = useAppDispatch();
  const { setFontSizeOption, toggleTheme, theme, colors } = useThemeContext();
  const isDark = theme === 'dark';
  console.log("theme>>>>>",theme);
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          dispatch(signOut());
        },
      },
    ]);
  };

  // const handleThemeToggle = () => {
  //   const currentDarkMode = useAppSelector(
  //     (state: RootState) => state.profile?.darkMode,
  //   );
  //   //dispatch(setProfile({ ...useAppSelector((state: RootState) => state.profile), darkMode: !currentDarkMode }));
  // };

  const HeaderRightComponent = () => (
    <View style={{ flexDirection: 'row', marginRight: 15, gap: 30 }}>
      <TouchableOpacity onPress={()=>{
         toggleTheme()
      }}>
        <MaterialIcons name="brightness-4" size={34} color={theme !== 'dark' ? Colors.secondary : Colors.primary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <MaterialIcons name="logout" size={34} color={theme === 'dark' ? Colors.primary : Colors.secondary} />
      </TouchableOpacity>
    </View>
  );

  // if (loading || profileLoading) {
  //   return (
  //     <View style={styles.loaderText}>
  //       <ActivityIndicator size="large" color="#000" />
  //     </View>
  //   );
  // }

  const MainStackSet = () => {

  return (
    <MainStack.Navigator
      initialRouteName={"Home"}
      screenOptions={{
        headerShown: true,
        headerTintColor: '#ffffff',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: theme !== 'dark' ? Colors.secondary : Colors.primary,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerLeft: () => null,
        headerRight: () => null,

      }}
      >
      <MainStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          title: 'Home',
          headerLeft: () => null,
          headerRight: () => <HeaderRightComponent />,
          
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerStyle: {
            backgroundColor: theme === 'dark' ? Colors.secondary : Colors.primary,
          },
          headerTintColor: theme === 'dark' ? Colors.primary : Colors.secondary,
        }}
      />

    </MainStack.Navigator>
  );
};

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStackSet />
    </NavigationContainer>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({
  loaderText: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  main: { flex: 1, backgroundColor: '#2432B1' },
});
