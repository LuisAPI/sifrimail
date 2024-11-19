import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Simulate auth check
    setTimeout(() => {
      setIsLoggedIn(true); // Set this based on actual login check
    }, 2000); // Simulate loading time
  }, []);

  if (!isLoggedIn) {
    return (
      <View>
        <Text>Loading...</Text>
        <Text>Redirecting to login...</Text>
      </View>
    );
  }

  // Redirect to the app/tabs route once logged in
  return null; // Expo Router will automatically take care of routing to `/app/(tabs)/index.tsx`
}
