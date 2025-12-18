import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
  useEffect,
} from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode } from '../redux/slices/profileSlice';
// import { setDarkMode } from '../redux/slices/profileSlice';
type Theme = 'light' | 'dark';
type FontSizeOption = 'small' | 'medium' | 'large';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  error: string;
  warning: string;
  success: string;
  border: string;
  placeholder: string;
  buttonBorder: string;
  toolbarBg: string;
  inputBg: string;
  checkBoxBorder: string;
  blue: string;
  drakBlue: string;
  circleBorder: string;
  circleText: string;
  drakBg: string;
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
  //const [fontSizeOption, setFontSizeOption] = useState<FontSizeOption>('medium');
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
    await AsyncStorage.setItem('fontSizeOption', option); // persist choice
  };
  const toggleTheme = () => {
    console.log("theme",theme);
    setTheme(prev => {
      console.log("prev",prev);
      const next = prev === 'light' ? 'dark' : 'light';
      // keep redux in sync
      try {
         dispatch(setDarkMode(next === 'dark'));
      } catch (e) {
        // ignore if dispatch not available
      }
      return next;
    });
  };

  // if redux has an explicit preference, use it to initialize theme
  useEffect(() => {
    if (typeof reduxDarkMode === 'boolean') {
      setTheme(reduxDarkMode ? 'dark' : 'light');
    }
  }, [reduxDarkMode]);

  const colors: { light: ThemeColors; dark: ThemeColors } = {
    light: {
    secondary: "#092E75",       // main theme color
     primary: "#A2BFE3", 
      background: '#ffffff',
      text: '#000000',
      error: '#e74c3c',
      warning: '#f39c12',
      success: '#27ae60',
      border: '#6B6D8380',
      placeholder: '#00000066',
      buttonBorder: '#00000033',
      toolbarBg: '#EDEDED',
      inputBg: '#0000001A',
      checkBoxBorder: '#0000004D',
      blue: '#fff',
      drakBlue: '#1A226E',
      circleBorder: '#00000033',
      circleText: '#736A6A',
      drakBg: '#F5F5F5',
    },
    dark: {
       primary: "#092E75",       // main theme color
    secondary: "#A2BFE3", 
      background: '#000000',
      text: '#FFFFFF',
      error: '#FF6B6B',
      warning: '#FFB84D',
      success: '#51CF66',
      border: '#FFFFFF33',
      placeholder: '#FFFFFFCC',
      buttonBorder: '#FFFFFF33',
      toolbarBg: '#2A2A2A',
      inputBg: '#FFFFFF26',
      checkBoxBorder: '#FFFFFF4D',
      blue: '#6E7FFF',
      drakBlue: '#5A7FFF',
      circleBorder: '#FFFFFF33',
      circleText: '#A8A8A8',
      drakBg: '#000000',
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
