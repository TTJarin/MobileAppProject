import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { RequestContext } from '../contexts/RequestContext';

export default function UserFoodsScreen({ route, navigation }: any) {
  const { username } = route.params;
  const { addRequest } = useContext(RequestContext);
  const [userFoods, setUserFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'foods'), where('username', '==', username));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const foods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserFoods(foods);
      setLoading(false);
    });

    return unsubscribe;
  }, [username]);

  const handleConfirm = (food: any) => {
    addRequest(food.foodName, food.username, 'CurrentUser');
    navigation.navigate('Confirmation', { food });  // ✅ pass full food object including contactNo
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
      <Text style={styles.title}>{`${username}'s Foods`}</Text>

      {userFoods.map((food) => (
        <View key={food.id} style={styles.card}>
          <Text style={styles.label}>Food: {food.foodName}</Text>
          <Text>Quantity: {food.quantity}</Text>
          <Text>Fee: {food.fee}</Text>
          <Text>Pickup Time: {food.pickupTime}</Text>
          <Text>Location: {food.location}</Text>

          <TouchableOpacity style={styles.button} onPress={() => handleConfirm(food)}>
            <Text style={styles.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      ))}

      {userFoods.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No foods added by {username}.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: 'seagreen' },
  card: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 30 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  button: { backgroundColor: 'seagreen', paddingVertical: 10, borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
});
