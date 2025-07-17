import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function AddFoodScreen({ navigation }: any) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fee, setFee] = useState('');
  const [location, setLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const handleSubmit = async () => {
    if (!foodName || !quantity || !fee || !location || !pickupTime) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in.');

      const pickupDate = new Date(pickupTime.replace(' ', 'T'));
      if (isNaN(pickupDate.getTime())) {
        Alert.alert('Error', 'Invalid pickup time format. Use YYYY-MM-DD HH:MM');
        return;
      }

      await addDoc(collection(db, 'foods'), {
        foodName: foodName.trim(),
        quantity: quantity.trim(),
        fee: fee.trim(),
        location: location.trim(),
        pickupTime: Timestamp.fromDate(pickupDate),
        username: user.uid,
        available: true,
        createdAt: Timestamp.now(),
      });

      Alert.alert('Success', 'Food added successfully!');
      navigation.navigate('Home');
    } catch (error: any) {
      console.error('Error adding food:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Food</Text>
      <TextInput style={styles.input} placeholder="Food Name" value={foodName} onChangeText={setFoodName} />
      <TextInput style={styles.input} placeholder="Quantity" value={quantity} onChangeText={setQuantity} />
      <TextInput style={styles.input} placeholder="Fee" value={fee} onChangeText={setFee} />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Pickup Time (YYYY-MM-DD HH:MM)" value={pickupTime} onChangeText={setPickupTime} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: 'seagreen' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 16, marginVertical: 10 },
  button: { backgroundColor: 'seagreen', paddingVertical: 14, paddingHorizontal: 50, borderRadius: 10, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
