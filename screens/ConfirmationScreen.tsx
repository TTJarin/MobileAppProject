import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ConfirmationScreen({ route, navigation }: any) {
  const { food } = route.params;
  const [contactNo, setContactNo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDonorContact() {
      try {
        // Fetch donor user doc by food.username (donor ID)
        const donorDocRef = doc(db, 'users', food.username);
        const donorDocSnap = await getDoc(donorDocRef);

        if (donorDocSnap.exists()) {
          const donorData = donorDocSnap.data();
          // Adjust field name here if needed
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
  }, [food.username]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
