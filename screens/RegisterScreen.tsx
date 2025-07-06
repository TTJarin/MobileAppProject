import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState(''); // new state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNo, setContactNo] = useState('');

  const handleRegister = () => {
    // You can later add validation or Firebase registration here
    navigation.navigate('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contactNo}
        onChangeText={setContactNo}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, 
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30
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
  button: {
    backgroundColor: 'seagreen',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
    marginTop: 20,
    minWidth: 200
  },
  buttonText: {
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600', 
    textAlign: 'center'
  },
});
