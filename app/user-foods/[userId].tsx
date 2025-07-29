// UserFoodsScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
} from 'react-native';
import { db, auth } from '../../firebaseConfig';
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDoc,
  Timestamp,
} from 'firebase/firestore';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function UserFoodsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;

  const [userFoods, setUserFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState('');
  const [userName, setUserName] = useState('');
  const [quantitiesToConfirm, setQuantitiesToConfirm] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setCurrentUid(user.uid);
      console.log("Logged-in UID:", user.uid);
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      console.warn("No userId provided to UserFoodsScreen");
      return;
    }

    console.log("Viewing foods from user ID:", userId);

    const now = Timestamp.now();

    const q = query(
      collection(db, 'foods'),
      where('username', '==', userId),
      where('pickupTime', '>', now)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const foods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched", foods.length, "foods from Firestore");
      setUserFoods(foods);
      setLoading(false);
    });

    const fetchUserName = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        } else {
          console.warn("User document not found");
        }
      } catch (err) {
        console.error("Failed to fetch username", err);
      }
    };

    fetchUserName();
    return unsubscribe;
  }, [userId]);

  const parseQuantity = (qtyStr: string = '0 unit') => {
    const parts = qtyStr.trim().split(' ');
    const num = parseInt(parts[0], 10);
    const unit = parts.slice(1).join(' ');
    return { num: isNaN(num) ? 0 : num, unit };
  };

  const formatQuantity = (num: number, unit: string) => `${num} ${unit}`;

  const handleConfirm = async (food: any) => {
    if (food.username === currentUid) {
      Alert.alert('Error', 'You cannot confirm your own food.');
      return;
    }

    if (!food.available) {
      Alert.alert('Already Confirmed', 'This food is already marked unavailable.');
      return;
    }

    const qtyStr = quantitiesToConfirm[food.id];
    const qtyNum = parseInt(qtyStr, 10);

    if (!qtyStr || isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Invalid Input', 'Enter a valid quantity.');
      return;
    }

    const { num: totalQty, unit } = parseQuantity(food.quantity);

    if (qtyNum > totalQty) {
      Alert.alert('Invalid Quantity', `You cannot confirm more than ${totalQty}`);
      return;
    }

    try {
      const newQty = totalQty - qtyNum;

      await updateDoc(doc(db, 'foods', food.id), {
        quantity: formatQuantity(newQty, unit),
        available: newQty > 0,
        confirmedBy: auth.currentUser?.uid,
      });

      // Clear input
      setQuantitiesToConfirm(prev => ({ ...prev, [food.id]: '' }));

      // Navigate always to confirmation screen
      router.push({
        pathname: '/confirmation',
        params: {
          foodId: food.id,
          status: newQty > 0 ? 'partial' : 'full',
        },
      });

    } catch (error) {
      console.error("Confirmation error:", error);
      Alert.alert('Error', 'Failed to confirm food.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="seagreen" />
        <Text style={{ marginTop: 10 }}>Loading food data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>
        {userName ? `${userName}'s Foods` : 'User Foods'}
      </Text>

      <Text style={{ textAlign: 'center', color: 'gray', marginBottom: 10 }}>
        {`Total Foods: ${userFoods.length}`}
      </Text>

      {userFoods.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No foods available from this user.
        </Text>
      ) : (
        userFoods.map(food => {
          if (!food || !food.foodName || !food.quantity) {
            console.warn("Skipping invalid food:", food);
            return null;
          }

          let pickupTimeFormatted = 'N/A';
          try {
            if (food.pickupTime?.toDate) {
              pickupTimeFormatted = food.pickupTime.toDate().toLocaleString();
            }
          } catch (e) {
            console.warn("Invalid pickupTime:", e);
          }

          const { num: totalQty } = parseQuantity(food.quantity);

          return (
            <View key={food.id} style={styles.card}>
              <Text style={styles.label}>Food: {food.foodName}</Text>
              <Text>Quantity: {food.quantity}</Text>
              <Text>Fee: {food.fee} per unit</Text>
              <Text>Pickup Time: {pickupTimeFormatted}</Text>
              <Text>Location: {food.location || 'N/A'}</Text>

              {food.available === false || totalQty === 0 ? (
                <Text style={styles.statusRed}>Already Confirmed</Text>
              ) : food.username === currentUid ? (
                <Text style={styles.statusOrange}>You cannot confirm your own food</Text>
              ) : (
                <>
                  <Text style={{ marginTop: 10 }}>Enter quantity to confirm:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={`Max ${totalQty}`}
                    keyboardType="number-pad"
                    value={quantitiesToConfirm[food.id] || ''}
                    onChangeText={text =>
                      setQuantitiesToConfirm(prev => ({ ...prev, [food.id]: text }))
                    }
                  />
                  <TouchableOpacity style={styles.button} onPress={() => handleConfirm(food)}>
                    <Text style={styles.buttonText}>Confirm</Text>
                  </TouchableOpacity>
                </>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'seagreen',
  },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: { fontSize: 18, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16,
    marginTop: 6,
  },
  button: {
    backgroundColor: 'seagreen',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  statusRed: { marginTop: 10, color: 'crimson', fontWeight: '600' },
  statusOrange: { marginTop: 10, color: 'orange', fontWeight: '600' },
});
