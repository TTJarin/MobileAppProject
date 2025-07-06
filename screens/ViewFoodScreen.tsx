import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FoodContext } from '../contexts/FoodContext';

export default function ViewFoodScreen({ navigation }: any) {
  const { foodList } = useContext(FoodContext);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Food Donors</Text>

      {foodList.length === 0 ? (
        <Text style={styles.noData}>No food items available.</Text>
      ) : (
        foodList.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigation.navigate('FoodDetails', { food: item })}
          >
            <Text style={styles.usernameText}>👤 {item.username}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'seagreen',
  },
  noData: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'seagreen',
  },
});
