import React from 'react';
import {StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen'; // Adjust the import path as needed
import RestaurantScreen from './RestaurantScreen'; // Adjust the import path as needed

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
       
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Restaurants" component={RestaurantScreen} options={{ title: 'Restaurants' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;