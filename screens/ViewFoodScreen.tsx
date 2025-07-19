import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, onSnapshot, getDoc, doc } from 'firebase/firestore';

interface FoodItem {
  id: string;
  pickupTime: any;
  username: string;
  foodName: string;
  quantity: string;
  fee: string;
  location: string;
  available: boolean;
}

export default function ViewFoodScreen({ navigation }: any) {
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [userNamesMap, setUserNamesMap] = useState<{ [username: string]: string }>({});
  const [loading, setLoading] = useState(true);

  const currentUserEmail = auth.currentUser?.email || '';
  const currentUsername = currentUserEmail.split('@')[0];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'foods'), async (snapshot) => {
      const now = new Date();

      const allFoods = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as FoodItem[];

      const validFoods = allFoods.filter((food) => {
        const time = food.pickupTime;
        let pickupDate: Date;

        if (time?.toDate && typeof time.toDate === 'function') {
          pickupDate = time.toDate();
        } else {
          pickupDate = new Date(time);
        }

        return pickupDate > now && !isNaN(pickupDate.getTime()) && food.username !== currentUsername;
      });

      const usernames = Array.from(new Set(validFoods.map((food) => food.username)));
      const namesMap: { [username: string]: string } = {};

      await Promise.all(
        usernames.map(async (username) => {
          const userDoc = await getDoc(doc(db, 'users', username));
          if (userDoc.exists()) {
            namesMap[username] = userDoc.data().name;
          } else {
            namesMap[username] = username;
          }
        })
      );

      setUserNamesMap(namesMap);
      setFoodList(validFoods);
      setLoading(false);
    });

    return unsubscribe;
  }, [currentUsername]);

  const uniqueUsernames = Array.from(new Set(foodList.map((item) => item.username)));

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="seagreen" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Food Providers</Text>

      {uniqueUsernames.length === 0 ? (
        <Text style={styles.noData}>No food items available.</Text>
      ) : (
        uniqueUsernames.map((username) => (
          <TouchableOpacity
            key={username}
            style={styles.card}
            onPress={() => navigation.navigate('UserFoods', { userId: username })} // ✅ Fixed here
          >
            <Text style={styles.usernameText}>{userNamesMap[username] || username}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: 'seagreen' },
  noData: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  card: { backgroundColor: '#f0f0f0', padding: 15, borderRadius: 8, marginBottom: 15 },
  usernameText: { fontSize: 20, fontWeight: '600', color: 'seagreen' },
});
