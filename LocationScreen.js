import { useState, useEffect } from 'react';
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LocationScreen = ({ route, navigation }) => {
  const { cart, totalPrice } = route.params; // Receive cart and total price
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [disabledSlots, setDisabledSlots] = useState([]);
  const [currentHour, setCurrentHour] = useState(null);
  const [currentMinutes, setCurrentMinutes] = useState(null);

  useEffect(() => {
    const currentHour = new Date().getHours();
    const currentMinutes = new Date().getMinutes();
    
    setCurrentHour(currentHour);
    setCurrentMinutes(currentMinutes);

    // Disable slots based on current time
    const slotsToDisable = [];
    if (currentHour > 18 || (currentHour === 18 && currentMinutes > 0)) {
      slotsToDisable.push('6'); // Disable 6 PM if it's past 6 PM
    }
    if (currentHour > 19) {
      slotsToDisable.push('7'); // Disable 7 PM if it's past 7 PM
    }
    setDisabledSlots(slotsToDisable);
  }, []);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleConfirmSelection = () => {
    navigation.navigate('Orders', {
      cart,
      totalPrice,
      location: selectedLocation,
      time: selectedTime,
    });
  };

  return (
    <LinearGradient colors={['#800000', '#B22222']} style={styles.background}>
      <View style={styles.container}>

        {/* Location Selection */}
        <Text style={styles.title}>Select Your Location</Text>
        <View style={styles.buttonContainer}>
          <Pressable
            onPress={() => handleLocationSelect('AU Main Gate')}
            style={[styles.button, selectedLocation === 'AU Main Gate' ? styles.selectedButton : null]}
          >
            <Text style={styles.buttonText}>AU Main Gate</Text>
          </Pressable>
          <Pressable
            onPress={() => handleLocationSelect('AU Kottur Gate')}
            style={[styles.button, selectedLocation === 'AU Kottur Gate' ? styles.selectedButton : null]}
          >
            <Text style={styles.buttonText}>AU Kottur Gate</Text>
          </Pressable>
        </View>

        {/* Time Slot Selection */}
        <Text style={styles.title}>Select Your Time Slot</Text>
        <View style={styles.buttonContainer}>
          {['6', '7', '8'].map((hour) => (
            <Pressable
              key={hour}
              onPress={() => handleTimeSelect(hour)}
              style={[
                styles.button, 
                selectedTime === hour ? styles.selectedButton : null,
                disabledSlots.includes(hour) ? styles.disabledButton : null // Apply disabled styles
              ]}
              disabled={disabledSlots.includes(hour)} // Disable based on the current time
            >
              <Text
                style={[
                  styles.buttonText, 
                  disabledSlots.includes(hour) ? styles.disabledButtonText : null // Apply disabled text styles
                ]}
              >
                {hour} PM
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Confirm Selection Button */}
        <Pressable
          onPress={handleConfirmSelection}
          style={[styles.confirmButton, { marginTop: 20 }]}
          disabled={!selectedLocation || !selectedTime}
        >
          <Text style={styles.buttonText}>Confirm Selection</Text>
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
    justifyContent: 'center', // Center content vertically
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#FFF', // Changed to white for better visibility against the gradient
  },
  buttonContainer: {
    flexDirection: 'row', // Arrange buttons in a row
    justifyContent: 'space-around', // Distribute buttons evenly
    marginBottom: 20,
  },
  button: {
    padding: 12,
    backgroundColor: '#2E8B57', // Using Sea Green for buttons
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8,
    flex: 1, // Make each button take equal width
    marginHorizontal: 5, // Add some space between buttons
    elevation: 2, // Add elevation for a shadow effect
  },
  confirmButton: {
    padding: 12,
    backgroundColor: '#2E8B57', // Using Sea Green for confirm button
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 8, // Make each button take equal width
    marginHorizontal: 5, // Add some space between buttons
    elevation: 2, // Add elevation for a shadow effect
  },
  selectedButton: {
    backgroundColor: '#EE4B2B', // Change color when selected (Red-Orange)
  },
  disabledButton: {
    backgroundColor: '#333', // Disabled button color
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold', // Bold text for readability
  },
  disabledButtonText: {
    color: '#aaa', // Disabled text color
  },
});

export default LocationScreen;
