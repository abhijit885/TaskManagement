import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/auth/SplashScreen';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { rootState as RootState } from '../redux/store';
import {
  navigationRef,
  processPendingNavigation,
} from '../../../RootNavigation';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={styles.main}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <NavigationContainer
          ref={navigationRef}
          onReady={() => {
            console.log('✅ Navigation is ready');
            processPendingNavigation();
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({
  loaderText: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  main: { flex: 1, backgroundColor: '#ffffff' },
});
