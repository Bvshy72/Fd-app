import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import { app } from './firebase';
import { getFirestore, getDocs, collection } from 'firebase/firestore';


const db = getFirestore(app);

const RestaurantScreen = () => {
  const [Restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Restaurants'));
        const restaurantList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRestaurants(restaurantList);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>; // Show loading text
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>
      <FlatList
        data={Restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <View style={styles.restaurantCard}>
              <Text>{item.name}</Text>
              <Text>{item.desc}</Text>
              <Text>{item.menu}</Text>
            </View>
          )}
      />
    <View style={styles.buttonContainer}>
        <Button title="Back" onPress={() => navigation.goBack()} /> {/* Go Back */}
        <Button title="Choose" onPress={() => alert('Restaurant chosen!')} /> {/* Choose action */}
      </View>
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
    restaurantCard: {
      padding: 16,
      marginVertical: 8,
      backgroundColor: '#fff',
      borderRadius: 8,
      elevation: 2,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      padding: 16,
    },
});

export default RestaurantScreen;