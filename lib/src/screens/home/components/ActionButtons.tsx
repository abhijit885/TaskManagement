import React, { useMemo } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeContext } from '../../../theme/ThemeContext';
import Colors from '../../../theme/colors';

interface ActionButtonsProps {
  isEditing: boolean;
  onSubmit: () => void;
  onClear: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isEditing,
  onSubmit,
  onClear,
}) => {
  const { theme } = useThemeContext();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.buttonLogin} onPress={onSubmit}>
        <Text style={styles.buttonTextLogin}>
          {isEditing ? 'Update User' : 'Add User'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLogin} onPress={onClear}>
        <Text style={styles.buttonTextLogin}>Clear All</Text>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (theme: string) =>
  StyleSheet.create({
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    buttonLogin: {
      backgroundColor: theme !== 'dark' ? Colors.primary : Colors.secondary,
      padding: 10,
      borderRadius: 5,
      width: '48%',
    },
    buttonTextLogin: {
      color: theme !== 'dark' ? Colors.secondary : Colors.primary,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default ActionButtons;