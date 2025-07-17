import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore';

export default function UserFoodsScreen({ route, navigation }: any) {
  const { username } = route.params;
  const [userFoods, setUserFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState('');
  const [userName, setUserName] = useState(username);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) setCurrentUid(user.uid);
  }, []);

  useEffect(() => {
    if (!username) return;

    const q = query(collection(db, 'foods'), where('username', '==', username));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const foods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserFoods(foods);
      setLoading(false);
    });

    const fetchName = async () => {
      const userDoc = await getDoc(doc(db, 'users', username));
      if (userDoc.exists()) setUserName(userDoc.data().name);
    };
    fetchName();

    return unsubscribe;
  }, [username]);

  const handleConfirm = async (food: any) => {
    if (food.username === currentUid) {
      Alert.alert('Error', 'You cannot confirm your own food.');
      return;
    }

    if (!food.available) {
      Alert.alert('Info', 'This food is already confirmed.');
      return;
    }

    try {
      await updateDoc(doc(db, 'foods', food.id), { available: false });
      // Navigate to Confirmation screen with food data
      navigation.navigate('Confirmation', { food });
    } catch (error) {
      Alert.alert('Error', 'Failed to confirm food.');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="seagreen" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{`${userName}'s`} Foods</Text>

      {userFoods.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No foods available from this user.</Text>
      ) : (
        userFoods.map(food => {
          const pickupTimeFormatted = food.pickupTime?.toDate ? food.pickupTime.toDate().toLocaleString() : 'N/A';

          return (
            <View key={food.id} style={styles.card}>
              <Text style={styles.label}>Food: {food.foodName}</Text>
              <Text>Quantity: {food.quantity}</Text>
              <Text>Fee: {food.fee}</Text>
              <Text>Pickup Time: {pickupTimeFormatted}</Text>
              <Text>Location: {food.location}</Text>

              {food.available === false ? (
                <Text style={{ marginTop: 10, color: 'crimson', fontWeight: '600' }}>Already Confirmed</Text>
              ) : food.username === currentUid ? (
                <Text style={{ marginTop: 10, color: 'orange', fontWeight: '600' }}>You cannot confirm your own food</Text>
              ) : (
                <TouchableOpacity style={styles.button} onPress={() => handleConfirm(food)}>
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: 'seagreen' },
  card: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 20 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  button: { backgroundColor: 'seagreen', paddingVertical: 10, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
