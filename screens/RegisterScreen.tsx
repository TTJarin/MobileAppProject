import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNo, setContactNo] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!name || !username || !email || !password || !contactNo) {
      setErrorMessage('Please fill in all the fields.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name,
        username,
        email,
        contactNo,
      });

      setSuccessMessage('Account created successfully! Redirecting to Login...');

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email address.');
      } else if (error.code === 'auth/weak-password') {
        setErrorMessage('Password must be at least 6 characters long.');
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Contact Number" value={contactNo} onChangeText={setContactNo} keyboardType="phone-pad" />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <Button title="Register" onPress={handleRegister} />
    </ScrollView>
  );
};

export default RegisterScreen;

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
    marginBottom: 30,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  successText: {
    color: 'seagreen',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});
