import React, { useState, useEffect } from 'react';
import { app } from './firebase';
import { getFirestore, getDocs, collection, getDoc } from 'firebase/firestore';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';

const db = getFirestore(app);

const RestaurantScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [user, setUser] = useState({ username: 'John Doe', profilePic: 'https://example.com/profile.jpg' });

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
            const newQuantity = (item.quantity || 1) + 1;
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

  const removeFromCart = (menuItem) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.id === menuItem.id);
  
      if (itemIndex !== -1) {
        const updatedCart = [...prevCart];
        const itemToRemove = updatedCart[itemIndex];
  
        if (itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1;
        } else {
          updatedCart.splice(itemIndex, 1);
        }
  
        setTotalPrice(prevTotal => prevTotal - itemToRemove.price);
  
        return updatedCart;
      }
  
      return prevCart;
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

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs the user out using Firebase auth
      navigation.navigate('Login'); // Navigate to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#FEC107" style={styles.loading} />;
  }

  return (
    <LinearGradient colors={['#FEC107', '#EBB101']} style={styles.background}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Image
            source={require('./assets/logo.jpeg')} // Use require for local images
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Hexa Eats</Text>
        </View>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.restaurantCard}>
              {/*<Text style={styles.restaurantName}>{item.name}</Text>*/}
              {item.menu && item.menu.length > 0 && (
                <View>
                  <Text style={styles.menuTitle}>Menu:</Text>
                  <FlatList
                    data={item.menu}
                    keyExtractor={(menuItem) => menuItem.id}
                    numColumns={2}
                    renderItem={({ item: menuItem }) => (
                      <View style={styles.menuItemContainer}>
                        <Image
                          source={{ uri: './assets/food.jpg' }} // Update this with actual image URL from the menuItem if available
                          style={styles.menuImage}
                          resizeMode="contain"
                        />
                        <View style={styles.menuItemContent}>
                          <Text style={styles.menuItem}>{menuItem.name}</Text>
                          <Text style={styles.menuItem}>₹{menuItem.price}</Text>
                        </View>
                        <Pressable onPress={() => addToCart(menuItem)} style={styles.addToCartButton}>
                          <Text style={styles.addToCartText}>Add to Cart</Text>
                        </Pressable>
                      </View>
                    )}
                  />
                </View>
              )}
            </View>
          )}
        />
        <Text style={styles.totalPrice}>Total Price: ₹{totalPrice.toFixed(2)}</Text>

        <View style={styles.cartContainer}>
          <Text style={styles.cartTitle}>Items in Cart:</Text>
          {cart.length > 0 ? (
            cart.map(item => (
              <View key={item.id} style={styles.cartItemContainer}>
                <Text style={styles.cartItemText}>
                  {item.name} - ₹{item.price} x {item.quantity}
                </Text>
                <View style={styles.quantityControls}>
                  <Pressable onPress={() => removeFromCart(item)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </Pressable>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <Pressable onPress={() => addToCart(item)} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyCartText}>Cart is empty</Text>
          )}
        </View>

        <Pressable onPress={placeOrder} style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Place Order</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );  
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    //justifyContent: 'center',
  },
  logo: {
    width: '10%', // Adjust the size according to your logo
    height: 80, // Adjust the size according to your logo
    //alignSelf: 'center',
    //marginBottom: 10,
  },
  title: {
    width: '45%',
    fontSize: 28,
    //marginBottom: 10,
    justifyContent: 'center',
    textAlign: 'right',
    color: '#000',
    fontWeight: 'bold',
  },
  restaurantCard: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 3,
  },
  restaurantName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  menuItemContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    padding: 8,
  },
  menuImage: {
    width: 80,
    height: 80,
    marginBottom: 8,
  },
  menuItemContent: {
    alignItems: 'center',
  },
  menuItem: {
    fontSize: 16,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#F29727',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginTop: 8,
  },
  addToCartText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  cartContainer: {
    marginTop: 20,
    backgroundColor: '#F8F8F8',
    padding: 16,
    borderRadius: 10,
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  cartItemText: {
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#F29727',
    padding: 5,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    color: '#FFF',
  },
  quantityText: {
    fontSize: 16,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  orderButton: {
    backgroundColor: '#22A699',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RestaurantScreen;
