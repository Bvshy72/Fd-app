import React, { useState, useEffect } from 'react';
import { app } from './firebase';
import { getFirestore, getDocs, collection, getDoc } from 'firebase/firestore';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const db = getFirestore(app);

const RestaurantScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'Restaurents'));
        const restaurantList = await Promise.all(querySnapshot.docs.map(async (doc) => {
          const restaurantData = { id: doc.id, ...doc.data() };

          if (restaurantData.menu) {
            const menuItems = await Promise.all(restaurantData.menu.map(async (menuRef) => {
              const menuDoc = await getDoc(menuRef);
              return menuDoc.exists() ? { id: menuDoc.id, ...menuDoc.data() } : null;
            }));
            restaurantData.menu = menuItems.filter(item => item !== null);
          }
          
          return restaurantData;
        }));
        setRestaurants(restaurantList);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const addToCart = (menuItem) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find(item => item.id === menuItem.id);
      if (itemExists) {
        const updatedCart = prevCart.map(item => {
            if (item.id === menuItem.id) {
              const newQuantity = (item.quantity || 1) + 1; // Update total price
              setTotalPrice(prevTotal => prevTotal + menuItem.price);
              return { ...item, quantity: newQuantity };
            }
            return item;
        });
        
        return updatedCart;
      }
      Alert.alert('Added to Cart', `${menuItem.name} has been added to your cart.`);
      setTotalPrice(prevTotal => prevTotal + menuItem.price);
      return [...prevCart, { ...menuItem, quantity: 1 }];
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty', 'Add items to your cart before placing an order.');
      return;
    }
    console.log('Order placed with items:', cart);
    navigation.navigate('Bill', { cart, totalPrice });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007BFF" style={styles.loading} />;
  }

  return (
    <LinearGradient colors={['#c94a4a', '#f7e7ce']} style={styles.background}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Restaurants</Text>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.restaurantCard}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              {item.menu && item.menu.length > 0 && (
                <View>
                  <Text style={styles.menuTitle}>Menu:</Text>
                  <ScrollView style={styles.menuScrollContainer} nestedScrollEnabled={true}>
                    {item.menu.map((menuItem) => (
                      <View key={menuItem.id} style={styles.menuItemContainer}>
                        <View style={styles.menuItemContent}>
                          <Text style={styles.menuItem}>{menuItem.name}</Text>
                          <Text style={styles.menuItem}>₹{menuItem.price}</Text>
                        </View>
                        <Pressable onPress={() => addToCart(menuItem)} style={styles.addToCartButton}>
                          <Text style={styles.addToCartText}>Add to Cart</Text>
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          )}
          nestedScrollEnabled={true}
        />
        <Text style={styles.totalPrice}>Total Price: ₹{totalPrice.toFixed(2)}</Text>
        {cart.length > 0 ? (
          <View style={styles.cartContainer}>
            <Text style={styles.cartTitle}>Items in Cart:</Text>
            {cart.map(item => (
              <Text key={item.id}>
                {item.name} - ₹{item.price} x {item.quantity}
              </Text>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyCartText}>Cart is empty</Text>
        )}
      </ScrollView>

      <Pressable onPress={placeOrder} style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Place Order</Text>
      </Pressable>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  restaurantCard: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#F7E7CE',
    borderRadius: 10,
    width: '85%',
    alignSelf: 'center',
    elevation: 3,
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    color: '#333',
  },
  menuScrollContainer: {
    maxHeight: 250, 
    marginBottom: 12,
  },
  menuItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 10,
    borderRadius: 5,
    elevation: 1,
  },
  menuItemContent: {
    flex: 1,
    paddingRight: 10,
  },
  menuItem: {
    fontSize: 16,
    color: '#333',
  },
  addToCartButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#FF6F61',
    borderRadius: 5,
  },
  addToCartText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  totalPrice: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  cartContainer: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#F7E7CE',
    borderRadius: 8,
    elevation: 3,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartItem: {
    fontSize: 16,
    color: '#333',
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
    marginTop: 16,
  },
  orderButton: {
    marginTop: 24,
    padding: 12,
    backgroundColor: '#FF6F61',
    borderRadius: 8,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default RestaurantScreen;
