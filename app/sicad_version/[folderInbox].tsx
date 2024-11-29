import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import EmailPreview from '@/components/sicad_components/EmailPreview';
import SearchBar from '@/components/sicad_components/SearchBar';

const FolderInboxPage = () => {
    const {folderID} = useLocalSearchParams<{folderID: string}>()

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setLoading] = useState(true); // Tracks loading state
    const [data, setData] = useState([]);
    const [pageToken, setPageToken] = useState('');

    const [loadScroll, setLoadScroll] = useState(false);

    const getData = async () => {
      if (loadScroll) return;
      setLoadScroll(true);
      
        try {
          const response = await fetch(`http://127.0.0.1:5000/nylas/recent-threads?page=${pageToken}&folderID=${folderID}`);
          const json = await response.json();
          setData((prevData): any => [...prevData, ...json[0]]); // Set the fetched data
          setPageToken(json[2]);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Set loading to false once done
          setLoadScroll(false);
        }
      };

    useEffect(() => {
      setLoading(true);
      setData([]);
      setPageToken('');
      getData();

    }, [folderID]);

    const renderEmailPreview = ({ item }: any) => {
        return (
            <EmailPreview
                item={item}
                // isStarred={isStarred}
                // onStarPress={() => setIsStarred(!isStarred)}
            />
        )
    }

    if (isLoading) {
        // Show a loading spinner while data is being fetched
        return (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        );
    }

    return (
    <SafeAreaProvider>
        <ScrollView>
            <SearchBar
                placeholder="Search for emails..."
                onSearch={(query: any) => setSearchQuery(query)}
            />

            <Text style={[styles.folderName, {marginLeft: 16, marginBottom: 4}]}>{folderID}</Text>

            <FlatList
                data={data}
                renderItem={renderEmailPreview}
                // @ts-ignore
                keyExtractor={item => item.id}
                onEndReached={getData}
            />
        </ScrollView>
        {loadScroll && <ActivityIndicator/>}
    </SafeAreaProvider>
    )
}

export default FolderInboxPage

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    folderName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
  });