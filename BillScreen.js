import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BillScreen = ({ route, navigation }) => {
  const { cart, totalPrice } = route.params;

  return (
    <LinearGradient colors={['#c94a4a', '#f7e7ce']} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Bill</Text>
        <ScrollView contentContainerStyle={styles.scrollView}>
          {cart.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>
                ₹{item.price} x {item.quantity || 1}
              </Text>
            </View>
          ))}
          <Text style={styles.totalPrice}>Total: ₹{totalPrice.toFixed(2)}</Text>
        </ScrollView>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Restaurants</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Full screen coverage for the gradient background
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between', // Space between title/content and button
  },
  scrollView: {
    flexGrow: 1, // Allow scrolling when content exceeds screen height
    paddingBottom: 16, // Additional padding for better spacing
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  cartItem: {
    backgroundColor: '#333', // White background for each item
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000', // Add a subtle shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Elevation for Android
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF', // Primary color for item name
  },
  itemDetails: {
    fontSize: 16,
    color: '#f7e7ce', // Darker color for details
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#333',
  },
  backButton: {
    padding: 12,
    backgroundColor: '#FF6F61', // Button color
    borderRadius: 5,
    alignItems: 'center',
    elevation: 1, // Shadow effect for the button
    marginBottom: 1, // Add bottom margin for spacing from the edge
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BillScreen;
