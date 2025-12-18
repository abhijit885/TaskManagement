import React from 'react';
import { View } from 'react-native';
import CustomTextInput from './CustomTextInput';
import { UserInputFormProps } from '../../../types/task';

const UserInputForm: React.FC<UserInputFormProps> = ({
  name,
  age,
  onNameChange,
  onAgeChange,
}) => {
  return (
    <View>
      <CustomTextInput
        placeholder="Name"
        value={name}
        onChangeText={onNameChange}
      />
      <CustomTextInput
        placeholder="Age"
        value={age}
        onChangeText={onAgeChange}
        keyboardType="numeric"
      />
    </View>
  );
};

export default UserInputForm;