// ConfirmationScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore'; // removed updateDoc import
import { db } from '../firebaseConfig'; // removed auth import

export default function ConfirmationScreen() {
  const { foodId } = useLocalSearchParams();
  const router = useRouter();

  const [parsedFood, setParsedFood] = useState<any>(null);
  const [contactNo, setContactNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFoodAndDonor() {
      if (!foodId || typeof foodId !== 'string') return;

      try {
        const foodSnap = await getDoc(doc(db, 'foods', foodId));
        if (!foodSnap.exists()) {
          Alert.alert('Error', 'Food not found.');
          return;
        }

        const foodData = foodSnap.data();
        setParsedFood({ id: foodSnap.id, ...foodData });

        const donorSnap = await getDoc(doc(db, 'users', foodData.username));
        if (donorSnap.exists()) {
          const donorData = donorSnap.data();
          const phone = donorData.contactNo || donorData.phone || donorData.phoneNumber || 'N/A';
          setContactNo(phone);
        } else {
          setContactNo('N/A');
        }
      } catch (e) {
        console.error('Error fetching food or donor:', e);
        setContactNo('N/A');
      } finally {
        setLoading(false);
      }
    }

    fetchFoodAndDonor();
  }, [foodId]);

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

        {/* Removed Confirm Food button */}

        <TouchableOpacity
          style={[styles.button, { backgroundColor: 'gray', marginTop: 30 }]}
          onPress={() => router.push('/home')}
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
