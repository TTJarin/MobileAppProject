import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmationScreen({ route, navigation }: any) {
  const food = route?.params?.food;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Ionicons name="checkmark-circle" size={70} color="seagreen" />

        <Text style={styles.title}>Perfect!</Text>

        <Text style={styles.message}>
          Thank you for Confirming{'\n'}the food request.
        </Text>

        <Text style={styles.subMessage}>
          Please contact to the given number to  pickup{'\n'} the food at the specifictime and location.
        </Text>

        <Text style={styles.subMessage}>
          Contact No: {food?.contactNo || 'Not available'}
        </Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'seagreen', padding: 20, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20 },
  card: {
    backgroundColor: '#fff',
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  title: { fontSize: 28, fontWeight: 'bold', marginTop: 20, color: '#333' },
  message: { fontSize: 18, fontWeight: '600', textAlign: 'center', marginVertical: 15, color: '#333' },
  subMessage: { fontSize: 14, textAlign: 'center', color: '#555', marginTop: 10 },
  button: {
    backgroundColor: 'seagreen',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginTop: 30,
    minWidth: 200,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});
