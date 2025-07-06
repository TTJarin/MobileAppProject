import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { RequestContext } from '../contexts/RequestContext';

export default function RequestListScreen() {
  const { requests, updateRequestStatus } = useContext(RequestContext);

  const myUsername = 'DonorUsername'; // replace with logged-in username later
  const myRequests = requests.filter(req => req.donorUsername === myUsername);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Requests for You</Text>

      {myRequests.length === 0 ? (
        <Text>No requests yet.</Text>
      ) : (
        myRequests.map((req) => (
          <View key={req.id} style={styles.card}>
            <Text style={styles.requestText}>Food: {req.foodName}</Text>
            <Text>From: {req.requestedBy}</Text>
            <Text>Status: {req.status}</Text>

            {req.status === 'pending' && (
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => updateRequestStatus(req.id, 'accepted')}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => updateRequestStatus(req.id, 'declined')}
                >
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, marginBottom: 15 },
  requestText: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  acceptButton: { backgroundColor: 'seagreen', padding: 10, borderRadius: 6, flex: 1, marginRight: 5 },
  declineButton: { backgroundColor: '#ff5c5c', padding: 10, borderRadius: 6, flex: 1, marginLeft: 5 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
});
