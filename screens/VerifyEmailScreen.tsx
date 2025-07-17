import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyEmailScreen({ navigation }: any) {
  const [isSending, setIsSending] = useState(false);

  const resendEmail = async () => {
    setIsSending(true);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        Alert.alert('Verification email sent', 'Please check your inbox.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
    setIsSending(false);
  };

  const checkVerificationStatus = async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      if (auth.currentUser.emailVerified) {
        Alert.alert('Success', 'Email verified! You can now log in.');
        navigation.navigate('Login');
      } else {
        Alert.alert('Not verified yet', 'Please click the verification link sent to your email.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.text}>
        A verification email has been sent to your email address. Please click the link to verify your account.
      </Text>

      <TouchableOpacity
        style={[styles.button, isSending && { backgroundColor: '#999' }]}
        onPress={resendEmail}
        disabled={isSending}
      >
        <Text style={styles.buttonText}>
          {isSending ? 'Sending...' : 'Resend Verification Email'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={checkVerificationStatus}>
        <Text style={styles.buttonText}>Check Verification Status</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          auth.signOut();
          navigation.navigate('Login');
        }}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: 'seagreen' },
  text: { fontSize: 16, marginBottom: 30, textAlign: 'center', color: '#444' },
  button: {
    backgroundColor: 'seagreen',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
  linkContainer: { alignItems: 'center' },
  linkText: { color: 'seagreen', fontSize: 16, fontWeight: '600' },
});
