import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { auth, db } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDoc, setDoc, doc } from 'firebase/firestore';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter email and password.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email verified
      if (!user.emailVerified) {
        setErrorMessage('Please verify your email before logging in.');
        await auth.signOut();
        return;
      }

      // Check if user document exists
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const defaultUsername = email.split('@')[0];
        await setDoc(userRef, {
          username: defaultUsername,
          email: user.email,
        });
      }

      setSuccessMessage('Logged in successfully! Redirecting to Home...');

      setTimeout(() => {
        navigation.navigate('Home');
      }, 2000);

    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('No account found with that email.');
      } else if (error.code === 'auth/wrong-password') {
        setErrorMessage('Incorrect password.');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email format.');
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

      <Button title="Login" onPress={handleLogin} color="seagreen" />

      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.registerContainer}>
        <Text style={styles.registerText}>{`Don't`} have an account? <Text style={styles.registerLink}>Register</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    color: 'seagreen',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  successText: {
    color: 'seagreen',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#444',
    fontSize: 16,
  },
  registerLink: {
    color: 'seagreen',
    fontWeight: 'bold',
  },
});
