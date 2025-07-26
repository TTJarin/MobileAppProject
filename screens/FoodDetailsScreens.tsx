import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function FoodDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const foodId = Array.isArray(id) ? id[0] : id;

  const [food, setFood] = useState<any>(null);
  const [requestedQty, setRequestedQty] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!foodId) return;

    const fetchFood = async () => {
      try {
        const foodDoc = await getDoc(doc(db, 'foods', foodId));
        if (foodDoc.exists()) {
          setFood({ id: foodDoc.id, ...foodDoc.data() });
        } else {
          Alert.alert('Error', 'Food not found');
          router.back();
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch food details');
        router.back();
      }
    };

    fetchFood();
  }, [foodId]);

  if (!food) {
    return (
      <View style={styles.center}>
        <Text>Loading food details...</Text>
      </View>
    );
  }

  const parseQuantity = (qtyStr: string) => {
    const parts = qtyStr.split(' ');
    const num = parseInt(parts[0], 10);
    const unit = parts.slice(1).join(' ');
    return { num, unit };
  };

  const formatQuantity = (num: number, unit: string) => {
    return `${num} ${unit}`;
  };

  const { num: totalQty, unit: qtyUnit } = parseQuantity(food.quantity);

  const pickupTimeFormatted =
    food.pickupTime?.toDate ? food.pickupTime.toDate().toLocaleString() : 'N/A';

  const handleConfirm = async () => {
    const qtyNum = parseInt(requestedQty, 10);

    if (isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Invalid quantity', 'Please enter a valid quantity to confirm.');
      return;
    }

    if (qtyNum > totalQty) {
      Alert.alert('Invalid quantity', `You cannot confirm more than ${totalQty}.`);
      return;
    }

    setLoading(true);

    try {
      const newQty = totalQty - qtyNum;

      if (newQty > 0) {
        await updateDoc(doc(db, 'foods', food.id), {
          quantity: formatQuantity(newQty, qtyUnit),
        });
      } else {
        await updateDoc(doc(db, 'foods', food.id), {
          quantity: formatQuantity(0, qtyUnit),
          available: false,
        });
      }

      Alert.alert('Success', 'Food confirmed successfully!');

      // Navigate to ConfirmationScreen, passing food as JSON string
      router.push({
        pathname: '/confirmation',
        params: { food: JSON.stringify({...food, id:foodId}) },
      });
    } catch (error: any) {
      Alert.alert('Error', 'Failed to confirm food.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>Food Details</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Donor Username: {food.username}</Text>
        <Text style={styles.label}>Food Name: {food.foodName}</Text>
        <Text style={styles.label}>Quantity: {food.quantity}</Text>
        <Text style={styles.label}>Fee: {food.fee}</Text>
        <Text style={styles.label}>Location: {food.location}</Text>
        <Text style={styles.label}>Pickup Time: {pickupTimeFormatted}</Text>
      </View>

      {totalQty > 0 && food.available !== false ? (
        <>
          <Text style={[styles.label, { marginTop: 10 }]}>Enter quantity to confirm:</Text>
          <TextInput
            style={styles.input}
            placeholder={`Max ${totalQty}`}
            keyboardType="number-pad"
            value={requestedQty}
            onChangeText={setRequestedQty}
          />
          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.7 }]}
            disabled={loading}
            onPress={handleConfirm}
          >
            <Text style={styles.buttonText}>{loading ? 'Confirming...' : 'Confirm Request'}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={[styles.confirmedText, { marginTop: 20 }]}>Already Confirmed</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  label: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 50,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: 'seagreen',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
  confirmedText: { color: 'crimson', fontSize: 20, fontWeight: '700', textAlign: 'center' },
});
