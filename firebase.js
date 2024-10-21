import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDa9-n8jdVIfNVka7c5fMpXhxdNBXnXUHw",
    authDomain: "ldnl-4f89b.firebaseapp.com",
    projectId: "ldnl-4f89b",
    storageBucket: "ldnl-4f89b.appspot.com",
    messagingSenderId: "450568722969",
    appId: "1:450568722969:web:2f37bd0acc219ae0d76888",
    measurementId: "G-KYEP0L6ERS"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Check if the environment is React Native
let auth;
if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // We are in React Native
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;

    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
} else {
    // Web or Node.js environment
    auth = getAuth(app);
}

export { app, auth };