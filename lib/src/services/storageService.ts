import AsyncStorage from '@react-native-async-storage/async-storage';

export const setSession = async (user: string): Promise<void> => {
  await AsyncStorage.setItem('user', user);
};

export const getSession = async (): Promise<string | null> => {
  return await AsyncStorage.getItem('user');
};

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem('user');
};
