import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const OAuthHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const url = window.location.href;
      const code = new URL(url).searchParams.get('code'); // Extract the 'code' from the query string

      if (!code) {
        console.error('Authorization code missing in callback URL');
        return;
      }

      try {
        const API_URL = Constants.expoConfig?.extra?.apiUrl;

        // Call your backend to exchange the code for a grant_id
        const response = await axios.get(`${API_URL}/oauth/exchange`, {
          params: { code },
        });

        const grantId = response.data.grant_id;

        if (grantId) {
          // Store grant_id in secure storage (e.g., AsyncStorage or SecureStore)
          await SecureStore.setItemAsync('grant_id', grantId);

          // Navigate to the Inbox or Home screen
          router.replace('/');
        }
      } catch (err) {
        console.error('Failed to exchange authorization code for token:', err);
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <Text style={styles.text}>Completing Authentication...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    color: '#555',
  },
});

export default OAuthHandler;
