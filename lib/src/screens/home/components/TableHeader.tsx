import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsiveWidth } from '../../../common/responsiveFontSize';

const TableHeader: React.FC = () => {
  return (
    <View style={styles.tableHeader}>
      <Text style={styles.tableHeaderText2}>Select</Text>
      <Text style={[styles.tableHeaderText, { marginLeft: responsiveWidth(-25) }]}>
        Name
      </Text>
      <Text style={styles.tableHeaderText}>Age</Text>
      <Text style={styles.tableHeaderText2}>Edit</Text>
      <Text style={styles.tableHeaderText2}>Delete</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '20%',
    textAlign: 'center',
  },
  tableHeaderText2: {
    fontWeight: 'bold',
    fontSize: 16,
    width: '15%',
    textAlign: 'center',
  },
});

export default TableHeader;