import React, { useEffect, useState } from 'react';
import { StatusBar, ActivityIndicator, View, I18nManager, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import SplashScreen from '../screens/auth/SplashScreen';

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../redux/reduxHooks';
import { setProfile } from '../redux/slices/profileSlice';
import { rootState as RootState } from '../redux/store';
import { navigationRef, processPendingNavigation } from '../../../RootNavigation';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<any>('Splash');
  const [profileLoading, setProfileLoading] = useState(false); // Profile API
  const selectedLanguage = useAppSelector(
    (state: RootState) => state.profile.selectedLanguage,
  );
  const dispatch = useAppDispatch();

  // if (loading || profileLoading) {
  //   return (
  //     <View style={styles.loaderText}>
  //       <ActivityIndicator size="large" color="#000" />
  //     </View>
  //   );
  // }

  

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
            processPendingNavigation(); // 🔥 Process any queued navigations
          }}
        >
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="light-content"
          />
          <Stack.Navigator
            initialRouteName={initialRoute} // 👈 Dynamic initial route
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
  main: { flex: 1, backgroundColor: '#2432B1' },
});
