import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { rootState as RootState } from '../redux/store';
import { navigationRef } from '../../../RootNavigation';
import HomeScreen from '../screens/home/HomeScreen';
import { signOut } from '../redux/slices/authSlice';
import { useThemeContext } from '../theme/ThemeContext';
import Colors from '../theme/colors';
import OfflineIndicator from '../components/OfflineIndicator';

const MainStack = createStackNavigator();

const MainNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { toggleTheme, theme } = useThemeContext();
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
    <View style={{ flex: 1 }}>
      <OfflineIndicator />
      <NavigationContainer ref={navigationRef}>
        <MainStackSet />
      </NavigationContainer>
    </View>
  );
};

export default MainNavigator;
