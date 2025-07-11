import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export default function ViewFoodScreen({ navigation }: any) {
  const [foodList, setFoodList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'foods'), (snapshot) => {
      const foods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setFoodList(foods);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const uniqueUsernames = [...new Set(foodList.map(item => item.username))];

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="seagreen" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Food Donors</Text>

      {uniqueUsernames.length === 0 ? (
        <Text style={styles.noData}>No food items available.</Text>
      ) : (
        uniqueUsernames.map((username) => (
          <TouchableOpacity
            key={username}
            style={styles.card}
            onPress={() => navigation.navigate('UserFoods', { username })}
          >
            <Text style={styles.usernameText}>👤 {username}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: 'seagreen' },
  noData: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15 },
  usernameText: { fontSize: 20, fontWeight: '600', color: 'seagreen' },
});
