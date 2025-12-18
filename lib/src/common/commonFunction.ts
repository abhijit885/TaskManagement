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
export const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};