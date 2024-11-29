import React, { useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const API_URL = Constants.expoConfig?.extra?.apiUrl;
      const authUrl = `${API_URL}/nylas/auth`;

      // Redirect to Nylas OAuth page (OAuthHandler will handle the callback)
      window.open(authUrl, '_blank');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SiFriMail</Text>
      <Button title="Login with Nylas" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
