import React, { useState } from 'react';
  import { StyleSheet, Text, View } from 'react-native';
  import { Dropdown } from 'react-native-element-dropdown';
  import AntDesign from '@expo/vector-icons/AntDesign';

  const data = [
    { label: '10 KM', value: '10' },
    { label: '21 KM', value: '21' },
    { label: '42 KM', value: '42' },
    { label: '75 KM', value: '75' },
  ];

  
  const DropdownComponent = ({ onSelect }) => {
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    const renderLabel = () => {
      if (value || isFocus) {
        return (
          <Text style={[styles.label, isFocus && { color: 'blue' }]}>
            Participant Route 
          </Text>
        );
      }
      return null;
    };

    return (
      <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select item' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
            onSelect && onSelect(item.value);
        }}
        renderSelectedItem={() => (
            <View style={styles.selectedItem}>
              <Text style={styles.selectedItemText}>{value ? data.find(item => item.value === value)?.label : ''}</Text>
            </View>
        )}
        />
      </View>
    );
  };

  export default DropdownComponent;

  const styles = StyleSheet.create({
    container: {
    //   backgroundColor: 'white',
      padding: 16,
      width: "109%",
    },
    dropdown: {
      width: "100%",
      backgroundColor: 'white',
    //   height: 50,
      borderColor: 'gray',
    //   paddingTop:20,
    //   marginTop: 20,
      borderWidth: 0.5,
      borderRadius: 10,
      paddingHorizontal: 30,
      paddingBottom: 10, 
      paddingTop: 10,
    },
    icon: {
      width: "100%",
    //   marginRight: 5,
    //   marginBottom: 20,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      borderRadius: 20,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
  });