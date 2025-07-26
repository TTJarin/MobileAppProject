// app/confirmation.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function ConfirmationScreen() {
  const { food } = useLocalSearchParams();
  const router = useRouter();

  // Parse food from string param safely
  const parsedFood = typeof food === 'string' ? JSON.parse(food) : null;

  const [contactNo, setContactNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    async function fetchDonorContact() {
      if (!parsedFood?.username) {
        setContactNo('N/A');
        setLoading(false);
        return;
      }

      try {
        const donorDocRef = doc(db, 'users', parsedFood.username);
        const donorDocSnap = await getDoc(donorDocRef);

        if (donorDocSnap.exists()) {
          const donorData = donorDocSnap.data();
          const phone = donorData.contactNo || donorData.phone || donorData.phoneNumber || 'N/A';
          setContactNo(phone);
        } else {
          setContactNo('N/A');
        }
      } catch (error) {
        console.error('Error fetching donor contact:', error);
        setContactNo('N/A');
      } finally {
        setLoading(false);
      }
    }

    fetchDonorContact();
  }, [parsedFood]);

  async function confirmFood() {
    if (!parsedFood?.id || !parsedFood?.username || !parsedFood?.quantity) {
      Alert.alert('Error', 'Invalid food data. Cannot confirm.');
      return;
    }

    setConfirming(true);

    try {
      const foodDocRef = doc(db, 'foods', parsedFood.id);

      // Required fields for Firestore rule validation
      await updateDoc(foodDocRef, {
        available: false,
        quantity: parsedFood.quantity,
        username: parsedFood.username,
        confirmedBy: auth.currentUser?.uid || null,
      });

      Alert.alert('Success', 'Food confirmed successfully!');
      router.push('/home');
    } catch (error) {
      console.error('Error confirming food:', error);
      Alert.alert('Error', 'Failed to confirm food. Please try again.');
    } finally {
      setConfirming(false);
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.card}>
        <Ionicons name="checkmark-circle" size={70} color="seagreen" />
        <Text style={styles.title}>Perfect!</Text>
        <Text style={styles.message}>Thank you for confirming the food request.</Text>
        <Text style={styles.subMessage}>
          Please contact the below number to pick up the food at the specific time and location.
        </Text>
        <Text style={styles.contactMessage}>Contact No: {contactNo}</Text>

        <TouchableOpacity
          style={[styles.button, confirming && { opacity: 0.7 }]}
          onPress={confirmFood}
          disabled={confirming}
        >
          <Text style={styles.buttonText}>{confirming ? 'Confirming...' : 'Confirm Food'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'gray', marginTop: 10 }]}
          onPress={() => router.push('/home')}
          disabled={confirming}
        >
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
  subMessage: { fontSize: 14, textAlign: 'center', color: '#555' },
  contactMessage: { fontSize: 16, textAlign: 'center', color: '#222', marginTop: 10 },
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
