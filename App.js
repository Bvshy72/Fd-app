import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './LoginScreen';
import RestaurantScreen from './RestaurantScreen';
import LocationScreen from './LocationScreen'; 
import OrderScreen from './OrderScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Restaurants" component={RestaurantScreen} />
        <Stack.Screen name="Location" component={LocationScreen} />
        <Stack.Screen name="Orders" component={OrderScreen} />    
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
