import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfig';

export default function DashboardScreen() {
  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (!currentUser) return;

    const foodRef = collection(db, 'foods');

    const q = query(
      foodRef,
      where('allUids', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFoodItems(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="seagreen" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Dashboard</Text>
      {foodItems.length === 0 ? (
        <Text style={styles.noItemsText}>No food items added or confirmed yet.</Text>
      ) : (
        <FlatList
          data={foodItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.foodName}>{item.foodName}</Text>
              <Text>Quantity: {item.quantity}</Text>
              <Text>Location: {item.location}</Text>
              <Text>Status: {item.isAvailable ? 'Available' : 'Not Available'}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: 'seagreen', textAlign: 'center' },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  foodName: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },
  noItemsText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: 'gray' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
