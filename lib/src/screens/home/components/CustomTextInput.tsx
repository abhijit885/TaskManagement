import React, { useMemo } from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';

interface CustomTextInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  editable?: boolean;
  customStyle?: object;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  editable = true,
  customStyle,
  ...props
}) => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TextInput
      style={[styles.input, customStyle]}
      placeholder={placeholder}
      placeholderTextColor={theme === 'dark' ? '#999' : '#ccc'}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      editable={editable}
      {...props}
    />
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    input: {
      height: 50,
      borderColor: theme === 'dark' ? '#555' : '#ccc',
      borderWidth: 1,
      marginBottom: 12,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 5,
      fontSize: 16,
      color: '#000',
      backgroundColor: '#fff',
    },
  });

export default CustomTextInput;