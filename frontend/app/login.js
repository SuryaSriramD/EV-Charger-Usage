import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's IP address if testing on a physical device
// Replace 192.168.1.100 with your actual IP address
const API_URL = Platform.OS === 'web' ? 'http://localhost:3001' : 'http://192.168.1.101:3001';

// Predefined user profiles
const USERS = [
  { username: 'sriram.d', password: 'sriram123' },
  { username: 'john.doe', password: 'john123' },
  { username: 'jane.smith', password: 'jane123' },
  { username: 'admin', password: 'admin123' }
];

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('All fields are required');
      Alert.alert('Error', 'Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting signup to:', `${API_URL}/signup`);
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      Alert.alert(
        'Success', 
        'Account created successfully! Please check your email for verification link before logging in.',
        [
          {
            text: 'OK',
            onPress: () => {
              setIsSignUp(false);
              setEmail('');
              setPassword('');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
    
    if (!email || !password) {
      setError('All fields are required');
      Alert.alert('Error', 'Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting login to:', `${API_URL}/login`);
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store both user and session data
      await AsyncStorage.setItem('currentUser', JSON.stringify(data.user));
      await AsyncStorage.setItem('user', JSON.stringify(data.user));
      await AsyncStorage.setItem('session', JSON.stringify(data.session));
      if (data.profile) {
        await AsyncStorage.setItem('userProfile', JSON.stringify(data.profile));
      }

      Alert.alert('Success', `Welcome back, ${email}!`);
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>

      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError('');
        }}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError('');
        }}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <TouchableOpacity>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.loginBtn, isLoading && styles.loginBtnDisabled]} 
        onPress={isSignUp ? handleSignUp : handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.loginText}>
          {isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Login')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchBtn} 
        onPress={() => router.replace('/signup')}
        disabled={isLoading}
      >
        <Text style={styles.switchText}>
          Don't have an account? Sign Up
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafbfc", paddingHorizontal: 24, justifyContent: "center" },
  back: { position: 'absolute', top: 50, left: 24, zIndex: 1 },
  backText: { fontSize: 28, color: "#384254" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center", color: "#222" },
  input: { backgroundColor: "#eaeef4", borderRadius: 16, fontSize: 16, padding: 16, marginBottom: 16 },
  inputError: { borderColor: '#ff4444', borderWidth: 1 },
  errorText: { color: '#ff4444', marginBottom: 16, textAlign: 'center' },
  forgotText: { color: "#5c6e91", alignSelf: "flex-end", marginBottom: 24 },
  loginBtn: { backgroundColor: "#316fea", borderRadius: 30, padding: 16, alignItems: "center", marginTop: 10 },
  loginBtnDisabled: { backgroundColor: "#a0b4e0" },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: "#316fea", fontSize: 16 }
});

