// screens/ProfileScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const [userData, setUserData] = useState<{ name: string; email: string; phoneNumber: string } | null>(null);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('User data from Firestore:', data);

            setUserData({
              name: data.name || 'N/A',
              email: data.email || currentUser.email || 'N/A',
              phoneNumber: data.phoneNumber || 'N/A',
            });
          } else {
            Alert.alert('Error', 'No user data found');
          }
        } catch (error) {
          Alert.alert('Error', 'Failed to load user data');
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Image source={require('../../assets/profile-user.png')} style={styles.avatar} />
        <Text style={styles.name}>{userData?.name || 'Loading...'}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Email Address</Text>
          <Text style={styles.value}>{userData?.email || 'Loading...'}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Phone Number</Text>
          <Text style={styles.value}>{userData?.phoneNumber || 'Loading...'}</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 60,
    backgroundColor: '#f2f6fc',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderColor: '#ccc',
    borderWidth: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 30,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#f0f4fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: '#222',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e53935',
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
