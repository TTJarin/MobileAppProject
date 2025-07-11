import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { RequestContext } from '../contexts/RequestContext';

export default function FoodDetailsScreen({ route, navigation }: any) {
  const { food } = route.params;
  const { addRequest } = useContext(RequestContext);

  const handleConfirm = () => {
    addRequest(food.foodName, food.username, 'CurrentUser'); // replace 'CurrentUser' dynamically later
    navigation.navigate('Confirmation');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Food Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Donor Username: {food.username}</Text>
        <Text style={styles.label}>Food Name: {food.foodName}</Text>
        <Text style={styles.label}>Quantity: {food.quantity}</Text>
        <Text style={styles.label}>Fee: {food.fee}</Text>
        <Text style={styles.label}>Location: {food.location}</Text>
        <Text style={styles.label}>Pickup Time: {food.pickupTime}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: { backgroundColor: '#f9f9f9', padding: 20, borderRadius: 10, marginBottom: 30 },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  button: { backgroundColor: 'seagreen', paddingVertical: 14, borderRadius: 10, marginTop: 20 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});
