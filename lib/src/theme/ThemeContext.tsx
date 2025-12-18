import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode } from '../redux/slices/profileSlice';
type Theme = 'light' | 'dark';
type FontSizeOption = 'small' | 'medium' | 'large';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  blue: string;
}

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
  colors: ThemeColors;
  fontSizeOption: FontSizeOption;
  setFontSizeOption: (option: FontSizeOption) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const colorScheme = Appearance.getColorScheme() as Theme;
  const [theme, setTheme] = useState<Theme>(colorScheme || 'light');
  const dispatch = useDispatch();
  const reduxDarkMode = useSelector((state: any) => state.profile?.darkMode);
  const [fontSizeOption, setFontSizeOptionState] =
    useState<FontSizeOption>('medium');

  useEffect(() => {
    (async () => {
      const savedSize = await AsyncStorage.getItem('fontSizeOption');
      console.log("ThemeProvider font savedSize :::",savedSize)
      console.log("savedSize",savedSize)
      if (
        savedSize === 'small' ||
        savedSize === 'medium' ||
        savedSize === 'large'
      ) {
        setFontSizeOptionState(savedSize);
      }
    })();
  }, []);

  const setFontSizeOption = async (option: FontSizeOption) => {
    setFontSizeOptionState(option);
    await AsyncStorage.setItem('fontSizeOption', option);
  };
  const toggleTheme = () => {
    console.log("theme",theme);
    setTheme(prev => {
      console.log("prev",prev);
      const next = prev === 'light' ? 'dark' : 'light';
      try {
         dispatch(setDarkMode(next === 'dark'));
      } catch (e) {
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof reduxDarkMode === 'boolean') {
      setTheme(reduxDarkMode ? 'dark' : 'light');
    }
  }, [reduxDarkMode]);

  const colors: { light: ThemeColors; dark: ThemeColors } = {
    light: {
    secondary: "#092E75",
     primary: "#A2BFE3", 
      background: '#ffffff',
      blue: '#fff',
    },
    dark: {
      primary: "#092E75",
      secondary: "#A2BFE3", 
      background: '#000000',
      blue: '#6E7FFF',
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        colors: colors[theme],
        fontSizeOption,
        setFontSizeOption,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error('useThemeContext must be used within a ThemeProvider');
  return context;
};
