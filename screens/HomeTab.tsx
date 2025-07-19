import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeTab({ navigation }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Plate2People</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddFood')}>
          <Text style={styles.buttonText}>Add Food</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewFood')}>
          <Text style={styles.buttonText}>View Food</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: 'seagreen', paddingVertical: 40, alignItems: 'center' },
  headerText: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  button: {
    backgroundColor: 'seagreen',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginVertical: 12,
    minWidth: 220,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600', textAlign: 'center' },
});
