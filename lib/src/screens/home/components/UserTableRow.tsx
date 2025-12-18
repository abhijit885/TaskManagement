import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../../theme/colors';
import { truncateText } from '../../../common/commonFunction';

interface UserTableRowProps {
  item: any;
  onCheckboxChange: (itemId: string, newState: boolean) => void;
  onEdit: (item: any) => void;
  onDelete: (itemId: string) => void;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  item,
  onCheckboxChange,
  onEdit,
  onDelete,
}) => {
  return (
    <View
      style={[
        styles.tableRow,
        { backgroundColor: item.isChecked ? '#D3F9D8' : '#E3ECF8' },
      ]}
    >
      <View style={styles.checkBoxContainer}>
        <CheckBox
          value={item.isChecked}
          onValueChange={() => onCheckboxChange(item.id, !item.isChecked)}
          onCheckColor={Colors.blue}
          lineWidth={2}
          boxType="square"
          style={styles.checkboxStyle}
        />
      </View>
      <View style={styles.userNameStyle}>
        <Text style={styles.tableCell}>{truncateText(item?.name, 5)}</Text>
      </View>
      <Text style={styles.width10Pix}>{item?.age}</Text>
      <TouchableOpacity onPress={() => onEdit(item)} style={styles.width10Pix}>
        <MaterialIcons name="edit" size={30} color="#092E75" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item?.id)} style={styles.width10Pix}>
        <MaterialIcons name="delete" size={30} color="#092E75" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  checkBoxContainer: { width: '20%', alignItems: 'center' },
  userNameStyle: { width: '20%', marginLeft: -30 },
  width10Pix: { width: '10%' },
  tableCell: { fontSize: 14 },
  checkboxStyle: {
    marginRight: 5,
    marginLeft: -4,
    borderColor: 'red',
  },
});

export default UserTableRow;