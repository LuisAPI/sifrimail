import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';

import { Text, View } from '@/components/Themed';

const Inbox = ({ grantId }: { grantId: string }) => { // Pass grant_id as a prop
  const [emails, setEmails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackGrantId = Constants.expoConfig?.extra?.grantId; // Fallback from app.config.js

  const actualGrantId = grantId || fallbackGrantId; // Use the provided or fallback grant ID

  const fetchAndClassifyEmails = async () => {
    if (!actualGrantId) {
      setError('No valid grant ID available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = Constants.expoConfig?.extra?.apiUrl; // Access API_URL safely

      // Fetch and classify emails using the API_URL
      const emailResponse = await axios.get(`${API_URL}/nylas/recent-emails`, {
        headers: {
          Authorization: `Bearer ${actualGrantId}`, // Include grant_id
        },
      });

      const fetchedEmails = emailResponse.data;

      // Classify emails
      const classificationResponse = await axios.post(
        `${API_URL}/classify-emails`,
        {
          emails: fetchedEmails.map((email: any) => email.snippet), // Pass only snippets to classify
        },
        {
          headers: {
            Authorization: `Bearer ${actualGrantId}`, // Include grant_id for the classifier too, if needed
          },
        }
      );
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
  }, [actualGrantId]);

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailCard: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '90%',
  },
  emailSubject: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  emailBody: {
    color: '#555',
    marginVertical: 5,
  },
  emailClassification: {
    fontStyle: 'italic',
    color: '#007AFF',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
});