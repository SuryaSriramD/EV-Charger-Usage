import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [localUsers, setLocalUsers] = useState([]);

  // Load local users when component mounts
  useEffect(() => {
    loadLocalUsers();
  }, []);

  const loadLocalUsers = async () => {
    try {
      const users = await AsyncStorage.getItem('localUsers');
      if (users) {
        setLocalUsers(JSON.parse(users));
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const saveUser = async (newUser) => {
    try {
      const updatedUsers = [...localUsers, newUser];
      await AsyncStorage.setItem('localUsers', JSON.stringify(updatedUsers));
      setLocalUsers(updatedUsers);
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  };

  const handleSignUp = async () => {
    setError('');

    // Validate inputs
    if (!email || !password) {
      setError('All fields are required');
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Check if username already exists
    const existingUser = [...USERS, ...localUsers].find(u => u.username === email);
    if (existingUser) {
      setError('Username already exists');
      Alert.alert('Error', 'This username is already taken');
      return;
    }

    // Create new user
    const newUser = {
      username: email,
      password: password
    };

    // Save user locally
    const success = await saveUser(newUser);
    if (success) {
      Alert.alert('Success', 'Account created successfully! Please login.');
      setIsSignUp(false);
      setEmail('');
      setPassword('');
    } else {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    }
  };

  const handleLogin = async () => {
    setError('');
    
    // Find user by username (check both predefined and local users)
    const user = [...USERS, ...localUsers].find(u => u.username === email);
    
    if (!user) {
      setError('Invalid username');
      Alert.alert('Error', 'Invalid username');
      return;
    }

    if (user.password !== password) {
      setError('Invalid password');
      Alert.alert('Error', 'Invalid password');
      return;
    }

    // Store the logged-in username
    try {
      await AsyncStorage.setItem('currentUser', user.username);
    } catch (error) {
      console.error('Error storing current user:', error);
    }

    // Successful login
    Alert.alert('Success', `Welcome back, ${user.username}!`);
    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Login'}</Text>

      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholder="Username"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError('');
        }}
        autoCapitalize="none"
        autoCorrect={false}
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
        style={styles.loginBtn} 
        onPress={isSignUp ? handleSignUp : handleLogin}
      >
        <Text style={styles.loginText}>{isSignUp ? 'Sign Up' : 'Login'}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.switchBtn} 
        onPress={() => {
          setIsSignUp(!isSignUp);
          setError('');
          setEmail('');
          setPassword('');
        }}
      >
        <Text style={styles.switchText}>
          {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
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
  loginText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: "#316fea", fontSize: 16 }
});

