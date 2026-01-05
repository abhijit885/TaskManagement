import { Appearance, LogBox, PermissionsAndroid, Platform, View, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from './lib/src/theme/ThemeContext';
import AppNavigator from './lib/src/navigation/AppNavigator';
import notifee, { EventType } from '@notifee/react-native';
import NetInfo from '@react-native-community/netinfo';
import { fetchToken } from './lib/src/redux/slices/authSlice';
import { useEffect, useState, useCallback } from 'react';
import MainNavigator from './lib/src/navigation/MainNavigator';
import messaging from '@react-native-firebase/messaging';
import React from 'react';
// import { FIREBASE_API_KEY } from 'react-native-dotenv';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onDisplayLocalNotification } from './lib/src/common/notifeeService';

function App() {
  const [localToken, setLocalToken] = React.useState<any>(null);
  const navigationRef = React.createRef<any>();
  const [, setNetworkConnected] = useState(true);
  const dispatch = useDispatch();
  const verifyToken = useSelector<any>(state => state.user);
  console.log('verifyToken in App.tsx', verifyToken);
  const getToken = useCallback(async () => {
    var fetchToken2 = await dispatch(fetchToken());
    console.log('fetchToken2 in App.tsx', fetchToken2?.payload);
    setLocalToken(fetchToken2?.payload);
  }, [dispatch]);

  const requestUserPermission = useCallback(async () => {
    // const authorizationStatus = await messaging().requestPermission();
    const authorizationStatus = await messaging().requestPermission({
      sound: true,
      announcement: true,
      alert: true,
      //provisional: true,
      //providesAppNotificationSettings: true
    });

    checkToken();
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      console.log('User has notification permissions enabled.');
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  }, []);

  useEffect(() => {
    getToken();
    requestUserPermission();
    //console.log('FIREBASE_API_KEY>>>>', FIREBASE_API_KEY);
  }, [getToken, requestUserPermission]);

  const checkToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('FCM token', fcmToken, Platform.OS);
      await AsyncStorage.setItem('fcmToken', fcmToken);
    }
  };

  const navigationFunction = async (remoteMessage: any) => {
    console.log('remoteMessage', remoteMessage);
    if (verifyToken) {
      navigationRef.current?.navigate('Home');
    }
  };

  useEffect(() => {
    Appearance.setColorScheme('light');
    LogBox.ignoreAllLogs();
    //Settings.setAdvertiserTrackingEnabled(true);
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
    } else {
      requestUserPermission();
    }
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable != false) {
        setNetworkConnected(true);
      } else {
        setNetworkConnected(false);
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data) {
          navigationFunction(remoteMessage);
        }
      });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      if (remoteMessage?.data) {
        navigationFunction(remoteMessage);
      }
    });
    const unsubscribe_onNotificationOpenedApp =
      messaging().onNotificationOpenedApp(remoteMessage => {
        if (remoteMessage?.data) {
          navigationFunction(remoteMessage);
        }
      });
    const unsubscribe_notify = messaging().onMessage(async remoteMessage => {
      console.log('remoteMessage', remoteMessage);
      onDisplayLocalNotification(
        remoteMessage?.notification?.title || '',
        remoteMessage?.notification?.body || '',
      );
    });
    const unsubscribe_notifee_foreground = notifee.onForegroundEvent(
      ({ type, detail }) => {
        console.log('remoteMessage', detail);
        if (type === EventType.PRESS && detail?.notification?.data) {
          navigationFunction(detail?.notification);
        }
      },
    );
    return () => {
      unsubscribe();
      unsubscribe_onNotificationOpenedApp();
      unsubscribe_notifee_foreground();
      unsubscribe_notify();
    };
  }, [localToken, navigationFunction]);

  // For E2E testing, use a simplified view
  if (__DEV__ && process.env.DETOX === 'true') {
    return (
      <ThemeProvider>
        <View testID="app-root" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text testID="welcome-text">App Ready for E2E Testing</Text>
          {localToken ? <MainNavigator /> : <AppNavigator />}
          <Toast />
        </View>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <View testID="app-root" style={{ flex: 1 }}>
        {localToken ? <MainNavigator /> : <AppNavigator />}
        <Toast />
      </View>
    </ThemeProvider>
  );
}

export default App;
