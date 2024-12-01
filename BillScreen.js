import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BillScreen = ({ route, navigation }) => {
  const { cart, totalPrice } = route.params;

  // Calculate GST and total including delivery fee
  //const gst = (totalPrice * 0.05).toFixed(2); // 5% GST
  //const deliveryFee = 10; // Fixed delivery fee
  //const finalTotal = (totalPrice + parseFloat(gst) + deliveryFee).toFixed(2);

  return (
    <LinearGradient colors={['#FEC107', '#EBB101']} style={styles.background}>
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
          <Text style={styles.totalPrice}>Subtotal: ₹{totalPrice.toFixed(2)}</Text>
          <Text style={styles.totalPrice}>Total: ₹{totalPrice}</Text>
        </ScrollView>
        <Pressable onPress={() => navigation.navigate('Location', { cart, totalPrice })} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Choose Location</Text>
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
    color: '#FFF', // Changed to white for better contrast
  },
  cartItem: {
    backgroundColor: '#FFF', // White background for each item
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
    color: '#333', // Primary color for item name
  },
  itemDetails: {
    fontSize: 16,
    color: '#555', // Darker color for details
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 15,
    textAlign: 'center',
    color: '#FFF', // Dark gray for total prices
  },
  nextButton: {
    padding: 12,
    backgroundColor: '#2E8B57', // Red-Orange for the button
    borderRadius: 5,
    alignItems: 'center',
    elevation: 1, // Shadow effect for the button
    marginBottom: 1, // Add bottom margin for spacing from the edge
  },
  nextButtonText: {
    color: '#FFF', // White text for better contrast
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BillScreen;
