import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export const storeUserSession = async (user: string) => {
  await AsyncStorage.setItem('@user_session', user);
};

export const getUserSession = async () => {
  return await AsyncStorage.getItem('@user_session');
};

export const clearUserSession = async () => {
  await AsyncStorage.removeItem('@user_session');
};
  //Using this function we can show success or error toast message on the app
  export const showToast = (type: string, text1: string, text2?: string) => {
    if (text2) {
      Toast.show({
        type: type,
        text1: text1,
        text2: text2,
      });
    } else {
      Toast.show({
        type: type,
        text1: text1,
      });
    }
  };