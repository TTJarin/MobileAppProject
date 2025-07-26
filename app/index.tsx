// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!loading) {
      if (user && user.emailVerified) {
        router.replace('/(tabs)'); // if using tab layout
      } else {
        router.replace('/welcome');
      }
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
