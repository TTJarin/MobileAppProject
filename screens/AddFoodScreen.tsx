import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { FoodContext } from '../contexts/FoodContext';

export default function AddFoodScreen({ navigation }: any) {
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [fee, setFee] = useState('');
  const [location, setLocation] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [username, setUsername] = useState('');

  const { addFood } = useContext(FoodContext);

  const handleSubmit = () => {
    addFood({ foodName, quantity, fee, location, pickupTime, username });
    navigation.navigate('Home');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Food</Text>

      <TextInput style={styles.input} placeholder="Food Name" value={foodName} onChangeText={setFoodName} />
      <TextInput style={styles.input} placeholder="Quantity" value={quantity} onChangeText={setQuantity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Fee" value={fee} onChangeText={setFee} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={styles.input} placeholder="Pickup Time" value={pickupTime} onChangeText={setPickupTime} />
      <TextInput style={styles.input} placeholder="Your Username" value={username} onChangeText={setUsername} />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#999', borderRadius: 8, paddingHorizontal: 16, marginVertical: 10 },
  button: { backgroundColor: 'seagreen', paddingVertical: 14, paddingHorizontal: 50, borderRadius: 10, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});
