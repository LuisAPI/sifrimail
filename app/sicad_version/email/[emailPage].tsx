import { View, Text, SafeAreaView, FlatList, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native'
import EmailItem from '@/components/sicad_components/EmailItem'

// Takes a ThreadID from previous stack and runs it

const EmailPage = () => {
    const {threadID} = useLocalSearchParams<{threadID: string}>()

    const [thread, setThread] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const getData = async () => {
        setLoading(true);

        try {
          const response = await fetch(`http://127.0.0.1:5000/nylas/get-thread?id=${threadID}`);
          const json = await response.json();
          setThread(json[0].message_ids)
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false); // Set loading to false once done
        }
      };

    useEffect(() => {
        getData();
    }, [threadID]);

    const renderBlockEmail = ({messageID}: any) => {
        return <EmailItem messageID={messageID} />
    }

    const renderTest = ({item}: any) => {
        return (
            <Text>{item}</Text>
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
      <ScrollView>
          <FlatList
                  data={thread.map(item => ({ messageID: item }))}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => renderBlockEmail(item)}
              />
      </ScrollView>
  )
}

export default EmailPage

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });