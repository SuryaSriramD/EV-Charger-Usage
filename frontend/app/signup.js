import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Use your computer's IP address if testing on a physical device
const API_URL = Platform.OS === 'web' ? 'http://localhost:3001' : 'http://192.168.1.101:3001';

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    setError('');
    setIsLoading(true);

    if (!validateForm()) {
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
          username: formData.email,
          password: formData.password,
          userData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        }),
      });

      const data = await response.json();
      console.log('Signup response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store the user data temporarily
      if (data.user) {
        await AsyncStorage.setItem('tempUser', JSON.stringify(data.user));
      }

      Alert.alert(
        'Success', 
        'Account created successfully! Please check your email for verification link before logging in.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Clear the form
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: '',
                address: '',
                city: '',
                state: '',
                zipCode: ''
              });
              // Navigate to login
              router.replace('/login');
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

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Create Account</Text>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, error && styles.inputError]}
            placeholder="First Name *"
            value={formData.firstName}
            onChangeText={(text) => handleInputChange('firstName', text)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, error && styles.inputError]}
            placeholder="Last Name *"
            value={formData.lastName}
            onChangeText={(text) => handleInputChange('lastName', text)}
          />
        </View>

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Email *"
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Phone Number"
          value={formData.phone}
          onChangeText={(text) => handleInputChange('phone', text)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Address"
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput, error && styles.inputError]}
            placeholder="City"
            value={formData.city}
            onChangeText={(text) => handleInputChange('city', text)}
          />
          <TextInput
            style={[styles.input, styles.halfInput, error && styles.inputError]}
            placeholder="State"
            value={formData.state}
            onChangeText={(text) => handleInputChange('state', text)}
          />
        </View>

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="ZIP Code"
          value={formData.zipCode}
          onChangeText={(text) => handleInputChange('zipCode', text)}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Password *"
          value={formData.password}
          onChangeText={(text) => handleInputChange('password', text)}
          secureTextEntry
        />

        <TextInput
          style={[styles.input, error && styles.inputError]}
          placeholder="Confirm Password *"
          value={formData.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          secureTextEntry
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity 
          style={[styles.signupBtn, isLoading && styles.signupBtnDisabled]} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          <Text style={styles.signupText}>
            {isLoading ? 'Please wait...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchBtn} 
          onPress={() => router.replace('/login')}
          disabled={isLoading}
        >
          <Text style={styles.switchText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fafbfc", 
    paddingHorizontal: 24
  },
  back: { 
    position: 'absolute', 
    top: 50, 
    left: 24, 
    zIndex: 1 
  },
  backText: { 
    fontSize: 28, 
    color: "#384254" 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "bold", 
    marginTop: 100,
    marginBottom: 24, 
    textAlign: "center", 
    color: "#222" 
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  input: { 
    backgroundColor: "#eaeef4", 
    borderRadius: 16, 
    fontSize: 16, 
    padding: 16, 
    marginBottom: 16 
  },
  halfInput: {
    flex: 1
  },
  inputError: { 
    borderColor: '#ff4444', 
    borderWidth: 1 
  },
  errorText: { 
    color: '#ff4444', 
    marginBottom: 16, 
    textAlign: 'center' 
  },
  signupBtn: { 
    backgroundColor: "#316fea", 
    borderRadius: 30, 
    padding: 16, 
    alignItems: "center", 
    marginTop: 10,
    marginBottom: 20
  },
  signupBtnDisabled: { 
    backgroundColor: "#a0b4e0" 
  },
  signupText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  switchBtn: { 
    marginTop: 10, 
    marginBottom: 30,
    alignItems: 'center' 
  },
  switchText: { 
    color: "#316fea", 
    fontSize: 16 
  }
});
