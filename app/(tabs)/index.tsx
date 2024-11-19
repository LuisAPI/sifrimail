import { Image, StyleSheet, Platform, Button, View, Text } from 'react-native';
import { useEffect, useState } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

import { Link } from 'expo-router';
import EmailService from '../services/emailService'; // Import the email service

export default function HomeScreen() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch emails on component mount
  useEffect(() => {
    const loadEmails = async () => {
      try {
        const messages = await EmailService.fetchEmails();
        setEmails(messages); // Store fetched emails in state
      } catch (error) {
        console.error('Failed to load emails:', error);
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    loadEmails();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* Display the inbox */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Inbox</ThemedText>
        {loading ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text>Loading inbox...</Text>
          </View>
        ) : (
          <View style={{ marginBottom: 12 }}>
            {emails.length > 0 ? (
              emails.map((email, index) => (
                <View key={index} style={{ marginBottom: 12, padding: 8, borderBottomWidth: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>{email.envelope.subject}</Text>
                  <Text>{email.envelope.from[0].address}</Text>
                </View>
              ))
            ) : (
              <Text>No emails found</Text>
            )}
          </View>
        )}
      </ThemedView>

      {/* Keep the developer link to the playground accessible but hidden */}
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">
          <Link href="../playgroundInbox">Click to move to Playground</Link>
        </ThemedText>
      </ThemedView>

      {/* Optional: You can add a button to toggle the inbox view */}
      <ThemedView style={styles.stepContainer}>
        <Button
          title="Go to Playground"
          onPress={() => {
            // This is just for developer testing
            console.log("Navigating to Playground");
          }}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
