import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

const BillScreen = ({ route, navigation }) => {
  const { cart, totalPrice } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bill</Text>
      {cart.map(item => (
  <Text key={item.id}>
    {item.name} - ₹{item.price} x {item.quantity || 1} {/* Display quantity */}
  </Text>
))}

      <Text style={styles.totalPrice}>Total: ₹{totalPrice.toFixed(2)}</Text>
      <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Restaurants</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  cartItem: {
    fontSize: 18,
    marginVertical: 4,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BillScreen;
