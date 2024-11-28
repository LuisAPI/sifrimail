import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

const Inbox = () => {
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAndClassifyEmails = async () => {
    setLoading(true);
    setError(null);

    try {
      const API_URL = Constants.manifest.extra.apiUrl; // Access the API_URL from app.config.js

      // Fetch and classify emails using the API_URL
      const emailResponse = await axios.get(`${API_URL}/nylas/recent-emails`);
      const fetchedEmails = emailResponse.data;

      const classificationResponse = await axios.post(`${API_URL}/classify-emails`, {
        emails: fetchedEmails,
      });
      const classifiedEmails = classificationResponse.data.predictions;

      const emailsWithClassification = fetchedEmails.map((email: any, index: number) => ({
        ...email,
        classification: classifiedEmails[index],
      }));

      setEmails(emailsWithClassification);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndClassifyEmails();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={emails}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.emailCard}>
              <Text style={styles.emailSubject}>{item.subject}</Text>
              <Text style={styles.emailBody}>{item.body}</Text>
              <Text style={styles.emailClassification}>Classification: {item.classification}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Inbox;

/*
export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>aaaaa</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
