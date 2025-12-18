import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface UserInputFormProps {
  name: string;
  age: string;
  onNameChange: (text: string) => void;
  onAgeChange: (text: string) => void;
}

const UserInputForm: React.FC<UserInputFormProps> = ({
  name,
  age,
  onNameChange,
  onAgeChange,
}) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={onNameChange}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={age}
        keyboardType="numeric"
        onChangeText={onAgeChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 10,
    borderRadius: 5,
  },
});

export default UserInputForm;