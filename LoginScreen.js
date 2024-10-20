import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient
import { app } from './firebase';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from '@firebase/auth';

const auth = getAuth(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate('Restaurants');
      }
    });

    return () => unsubscribe();
  }, [navigation]);

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('Restaurants');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigation.navigate('Restaurants');
      }
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Authentication error:', error.message);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider); // Keep this for web
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = credential.user;
      
      // Use the user information as needed
      navigation.navigate('Restaurants');
    } catch (error) {
      setErrorMessage(error.message);
      console.error('Google Login Error:', error.message);
    }
  };

  return (
    <LinearGradient colors={['#800000', '#B22222']} style={styles.loginPage}> {/* Gradient Background */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Username"
            autoCapitalize="none"
          />
          
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />

          <TouchableOpacity onPress={handleAuthentication} style={styles.loginButton}>
            <LinearGradient 
              colors={['#333', '#EE4B2B']} // Gradient for the login button
              style={styles.loginButton}
              start={{ x: 0, y: 0 }} // Adjust the start point
              end={{ x: 1, y: 1 }} // Adjust the end point
            >
              <Text style={styles.loginButtonText}>{isLogin ? 'Login' : 'Sign Up'}</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity onPress={handleGoogleLogin} style={styles.googleLogin}>
            <Image
              source={{ uri: 'https://cdn.builder.io/api/v1/image/assets/TEMP/6625f1be10c7723ef5c42467e8d44e574bbc1fe10535e5216acec39dbb50ee6b?placeholderIfAbsent=true&apiKey=abaf13c23e4240b0b2fb2730a546b236' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleLoginText}>Login using Google</Text>
          </TouchableOpacity>

          <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  loginPage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  input: {
    borderRadius: 15,
    backgroundColor: '#f7e7ce',
    width: 1500,
    maxWidth: 250,
    color: '#333',
    padding: 10,
    marginTop: 15,
  },
  loginButton: {
    borderRadius: 15,
    alignSelf: 'stretch',
    paddingTop: 10,
    width: '100%',
    height: 40,
  },
  loginButtonText: {
    color: '#FFF',
    paddingLeft: 110,
  },
  divider: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    gap: 7,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  googleLogin: {
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 27,
  },
  googleIcon: {
    width: 23,
    height: 23,
  },
  googleLoginText: {
    color: '#000',
    marginLeft: 10,
  },
  toggleText: {
    color: '#FF6347',
    marginTop: 16,
    textAlign: 'center',
  },
  error: {
    color: '#ff0000',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default LoginScreen;
