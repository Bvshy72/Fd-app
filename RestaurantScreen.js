import React, { useState, useEffect } from 'react';
import { app } from './firebase';
import { getFirestore, getDocs, collection, getDoc } from 'firebase/firestore';
import { View, Text, FlatList, StyleSheet, Pressable, Alert, ActivityIndicator, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from 'firebase/auth';
import { auth } from './firebase'; // Replace this with your Firebase auth instance

const db = getFirestore(app);

const RestaurantScreen = ({ navigation }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Replace these with actual user profile details from your auth system
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
      const updatedCart = prevCart.filter(item => item.id !== menuItem.id);
      const removedItem = prevCart.find(item => item.id === menuItem.id);

      if (removedItem) {
        setTotalPrice(prevTotal => prevTotal - (removedItem.price * (removedItem.quantity || 1)));
        return updatedCart;
      }
      return prevCart; // Return unchanged cart if item not found
    });
  };

  const placeOrder = () => {
    if (cart.length === 0) {
      Alert.alert('Cart is empty', 'Add items to your cart before placing an order.');
      return;
    }
    console.log('Order placed with items:', cart);
    navigation.navigate('Location', { cart, totalPrice });
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
    return <ActivityIndicator size="large" color="#40e0d0" style={styles.loading} />; // Changed loading color to Bright Turquoise
  }

  return (
    <LinearGradient colors={['#800000', '#B22222']} style={styles.background}>
      <View style={styles.sidebar}>
        <Image
          source={{ uri: user.profilePic }}
          style={styles.profileImage}
        />
        <Text style={styles.username}>{user.username}</Text>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </View>
      
      <View style={styles.contentContainer}>
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
                    <FlatList
                      data={item.menu}
                      keyExtractor={(menuItem) => menuItem.id}
                      numColumns={2} // Display 2 items per row
                      renderItem={({ item: menuItem }) => (
                        <View style={styles.menuItemContainer}>
                          <Image
                            source={{ uri: './assets/images/food.jpg' }} // Update this with actual image URL from the menuItem if available
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
            nestedScrollEnabled={true}
          />
          <Text style={styles.totalPrice}>Total Price: ₹{totalPrice.toFixed(2)}</Text>
          {cart.length > 0 ? (
            <View style={styles.cartContainer}>
              <Text style={styles.cartTitle}>Items in Cart:</Text>
              {cart.map(item => (
                <View key={item.id} style={styles.cartItemContainer}>
                  <Text>
                    {item.name} - ₹{item.price} x {item.quantity}
                  </Text>
                  <Pressable onPress={() => removeFromCart(item)} style={styles.removeFromCartButton}>
                    <Text style={styles.removeFromCartText}>Remove</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyCartText}>Cart is empty</Text>
          )}
        </ScrollView>

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
    flexDirection: 'row',
  },
  sidebar: {
    width: '15%',
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
  contentContainer: {
    flex: 1, // Fill the remaining space
    padding: 16,
  },
  container: {
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    marginBottom: 24,
    textAlign: 'center',
    color: '#FFF',
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  menuItemContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: '#FFF',
    borderRadius: 8,
    elevation: 2,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuImage: {
    width: 300,
    height: 200,
    borderRadius: 8,
    marginBottom: 5,
  },
  menuItemContent: {
    alignItems: 'center',
  },
  menuItem: {
    fontWeight: 'bold',
  },
  addToCartButton: {
    marginTop: 5,
    padding: 5,
    backgroundColor: '#2E8B57',
    borderRadius: 5,
  },
  addToCartText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#FFF',
    textAlign: 'center',
  },
  cartContainer: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 8,
    backgroundColor: '#FFF',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  removeFromCartButton: {
    backgroundColor: '#EE4B2B',
    padding: 5,
    borderRadius: 5,
  },
  removeFromCartText: {
    color: '#FFF',
  },
  emptyCartText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFF',
  },
  orderButton: {
    backgroundColor: '#2E8B57',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  orderButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RestaurantScreen;
