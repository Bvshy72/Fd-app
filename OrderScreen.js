import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';

const OrderScreen = ({ route, navigation }) => {
  const { cart, totalPrice, location, time } = route.params;
   // Get user from Auth context
  const db = getFirestore();

  const handlePlaceOrder = async () => {

    try {
      await addDoc(collection(db, 'o'), {
        order: cart,
        cost:totalPrice,
        loc:location,
        t:time,
        createdAt: new Date(),
      });
      Alert.alert('Success', 'Your order has been placed successfully!');
      
    } catch (error) {
      console.error('Error placing order:', error.message);
      Alert.alert('Error', 'Could not place order. Please try again.');
    }
  };

  return (
    <LinearGradient colors={['#FEC107', '#EBB101']} style={styles.background}>
      <View style={styles.container}>
        <ScrollView style={styles.cartList}>
          <Text style={styles.title}>Final Order Summary</Text>

          {/* Location and Time Section */}
          <View style={styles.summaryBox}>
            <Text style={styles.label}>Selected Location:</Text>
            <Text style={styles.value}>{location}</Text>
            
            <Text style={styles.label}>Selected Time:</Text>
            <Text style={styles.value}>{time}</Text>
          </View>

          {/* Items Section */}
          <View style={styles.cartSection}>
            <Text style={styles.subtitle}>Items in Cart:</Text>
            <View style={styles.divider} />
            
            {cart.map((item, index) => (
              <View key={index} style={styles.cartItem}>
                <View>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>

          {/* GST, Delivery Fee, and Total Price Section */}
          <View style={styles.totalBox}>
            <Text style={styles.totalText}>Subtotal</Text>
            <Text style={styles.totalPrice}>₹{totalPrice}</Text>
          </View>

        </ScrollView>

        <View style={styles.divider} />

        {/* Final Total */}
        <View style={styles.finalTotalBox}>
          <Text style={styles.finalTotalText}>Total Amount</Text>
          <Text style={styles.finalTotalPrice}>₹{totalPrice}</Text>
        </View>

        {/* Go Back Button */}
        <Pressable onPress={handlePlaceOrder} style={styles.button}>
          <Text style={styles.buttonText}>Place Order</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF', // Changed to white for better contrast
  },
  subtitle: {
    color: '#FFF'
  },
  summaryBox: {
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FFF', // Changed to white
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  value: {
    fontSize: 18,
    marginBottom: 12,
    color: '#333',
  },
  cartSection: {
    flex: 1,
    marginBottom: 20,
  },
  cartList: {
    paddingVertical: 10,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    color: '#FFF',
  },
  itemQuantity: {
    fontSize: 16,
    color: '#f7e7ce',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  totalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF', // Changed to white
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalPrice: {
    fontSize: 18,
    color: '#333',
  },
  finalTotalBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFF', // Changed to white
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  finalTotalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  finalTotalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    padding: 12,
    backgroundColor: '#2E8B57', // Changed to red-orange for the button
    borderRadius: 5,
    alignItems: 'center',
    elevation: 2,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFF', // Changed to white for better contrast
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderScreen;
