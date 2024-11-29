import { View, Text, ActivityIndicator, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import SearchBar from '@/components/sicad_components/SearchBar';

// Pull array of folders
// FlatList it displaying name, referencing folderID
// Push folderID into new stack page
// Page is basically an inbox copy except with search param only for inside specified folderID 

const FoldersPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [folders, setFolders] = useState([]);
    const [isLoading, setLoading] = useState(true);
    
    const getFolders = async () => {
        try {
          const response = await fetch("http://127.0.0.1:5000/nylas/get_folders");
          const json = await response.json();
          setFolders(json[0]);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Set loading to false once done
        }
      };

    useEffect(() => {
    getFolders();
    }, []);

    if (isLoading) {
        // Show a loading spinner while data is being fetched
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        );
    }

    const renderFolder = ({ item }: any) => {
      const folderID = item.id;

       return (
        <TouchableOpacity
          style={styles.folderBlock}
          onPress={() => {router.push({
            // @ts-ignore
            pathname: `/sicad_version/${folderID}`,
            // @ts-ignore
            params: {
                folderID: folderID,
            }
        })}}
        >
          <Text style={styles.folderText}>{item.name}</Text>
        </TouchableOpacity>
      )
    };

    return (
    <SafeAreaView>
      <ScrollView>
      <SearchBar
        placeholder="Search folders..."
        onSearch={(query: any) => setSearchQuery(query)}
      />

      <Text style={[styles.pageName, {marginLeft: 16, marginBottom: 4}]}>FOLDERS</Text>

        <FlatList
            data={folders}
            renderItem={renderFolder}
            // @ts-ignore
            keyExtractor={item => item.id}
          />
      </ScrollView>
    </SafeAreaView>
    )
}

export default FoldersPage

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
      padding: 10,
    },
    folderBlock: {
      backgroundColor: '#ffffff',
      padding: 15,
      marginVertical: 5,
      borderRadius: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
      justifyContent: 'center',
    },
    folderText: {
      fontSize: 16,
      fontWeight: '500',
      color: '#333',
    },
    pageName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
  });