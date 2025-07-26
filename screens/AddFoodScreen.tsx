import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';     
import { Picker } from '@react-native-picker/picker';  
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useRouter } from 'expo-router'; // ✅ ADDED

export default function AddFoodScreen() {
  const router = useRouter(); // ✅ ADDED

  const [foodName, setFoodName] = useState('');
  const [quantityValue, setQuantityValue] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('packs');
  const [fee, setFee] = useState('');
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeInput, setTimeInput] = useState('');

  const handleSubmit = async () => {
    if (!foodName || !quantityValue || !fee || !location || !selectedDate || !timeInput) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const timeRegex = /^(0?[1-9]|1[0-2]):([0-5]\d) ?([AaPp][Mm])$/;
    if (!timeRegex.test(timeInput.trim())) {
      Alert.alert('Error', 'Please enter time in HH:mm AM/PM format, e.g. 2:30 PM');
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not logged in.');

      const timeParts = timeInput.trim().match(timeRegex);
      let hours = parseInt(timeParts![1], 10);
      const minutes = parseInt(timeParts![2], 10);
      const ampm = timeParts![3].toUpperCase();

      if (ampm === 'PM' && hours !== 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;

      const [year, month, day] = selectedDate.split('-').map(Number);
      const combinedDate = new Date(year, month - 1, day, hours, minutes);

      const formattedQuantity = `${quantityValue.trim()} ${quantityUnit}`;

      await addDoc(collection(db, 'foods'), {
        foodName: foodName.trim(),
        quantity: formattedQuantity,
        fee: fee.trim(),
        location: location.trim(),
        pickupTime: Timestamp.fromDate(combinedDate),
        username: user.uid,
        available: true,
        createdAt: Timestamp.now(),
      });

      Alert.alert('Success', 'Food added successfully!');
      router.replace('/home'); // ✅ CHANGED from navigation to router
    } catch (error: any) {
      console.error('Error adding food:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Add Food</Text>

      <TextInput
        style={styles.input}
        placeholder="Food Name"
        value={foodName}
        onChangeText={setFoodName}
      />

      {/* Quantity Row */}
      <View style={styles.row}>
        <TextInput
          style={styles.quantityInput}
          placeholder="Quantity value"
          value={quantityValue}
          onChangeText={setQuantityValue}
          keyboardType="numeric"
        />
        <View style={styles.unitPicker}>
          <Picker
            selectedValue={quantityUnit}
            onValueChange={(itemValue) => setQuantityUnit(itemValue)}
            mode="dropdown"
          >
            <Picker.Item label="Packs (about 500 gm)" value="packs" />
            <Picker.Item label="Plates (about 1 kg)" value="plates" />
            <Picker.Item label="Litres" value="litres" />
            <Picker.Item label="Pieces" value="pieces" />
            <Picker.Item label="Pound" value="pound" />
          </Picker>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Fee"
        value={fee}
        onChangeText={setFee}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <Text style={{ alignSelf: 'flex-start', marginBottom: 5, fontWeight: '600' }}>
        Select Pickup Date
      </Text>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: 'seagreen' },
        }}
        style={{ width: '100%', borderRadius: 8, marginBottom: 15 }}
      />

      <TextInput
        style={styles.input}
        placeholder="Pickup Time (e.g. 2:30 PM)"
        value={timeInput}
        onChangeText={setTimeInput}
        autoCapitalize="characters"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'seagreen',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  quantityInput: {
    width: '48%',
    height: 50,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  unitPicker: {
    width: '48%',
    height: 50,
    borderColor: '#999',
    borderRadius: 8,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  button: {
    backgroundColor: 'seagreen',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
