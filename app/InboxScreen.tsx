import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import EmailService from '../services/emailService';

const InboxScreen = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmails = async () => {
      try {
        const messages = await EmailService.fetchEmails();
        setEmails(messages);
      } catch (error) {
        console.error('Failed to load emails:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading inbox...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Inbox</Text>
      <FlatList
        data={emails}
        keyExtractor={(item) => item.uid.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12, padding: 8, borderBottomWidth: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.envelope.subject}</Text>
            <Text>{item.envelope.from[0].address}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default InboxScreen;
