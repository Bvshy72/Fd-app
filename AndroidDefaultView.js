import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';

const AndroidDefaultView = ({ user, onLogout }) => {
  return (
    <View style={styles.sidebar}>
      <Image source={{ uri: user.profilePic }} style={styles.profileImage} />
      <Text style={styles.username}>{user.username}</Text>
      <Pressable onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: '20%', // Adjust width as necessary
    backgroundColor: '#FFF',
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOpacity: 0.75,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, // Circular profile pic
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default AndroidDefaultView;
