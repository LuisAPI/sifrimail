import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Requires Expo or react-native-vector-icons

const SearchBar = ({ placeholder = 'Search...', onSearch }: any) => {
  const [searchText, setSearchText] = useState('');

  const handleClear = () => {
    setSearchText('');
    if (onSearch) onSearch(''); // Notify parent of cleared search
  };

  const handleChangeText = (text: any) => {
    setSearchText(text);
    if (onSearch) onSearch(text); // Notify parent of updated search
  };

  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={20} color="#777" style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={searchText}
        onChangeText={handleChangeText}
      />
      {searchText ? (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color="#777" />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 16,
      borderWidth: 1, // Add a border
      borderColor: '#ccc', // Border color
      paddingHorizontal: 10,
      paddingVertical: 16,
      marginVertical: 10,
      marginHorizontal: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    icon: {
      marginRight: 5,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    clearButton: {
      marginLeft: 5,
    },
  });

export default SearchBar;
