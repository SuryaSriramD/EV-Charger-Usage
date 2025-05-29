import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/ThemeContext';

const API_URL = Platform.OS === 'web' ? 'http://localhost:3001' : 'http://192.168.1.101:3001';

export default function AccountScreen() {
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: isDarkMode,
    autoConnect: true
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug] = useState('');

  const MenuItem = ({ icon, title, value, onPress }) => (
    <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border }]} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <Ionicons name={icon} size={24} color={theme.primary} />
        <Text style={[styles.menuItemTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <View style={styles.menuItemRight}>
        {value && <Text style={[styles.menuItemValue, { color: theme.textSecondary }]}>{value}</Text>}
        <Ionicons name="chevron-forward" size={24} color={theme.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        setDebug(`AsyncStorage user: ${userData}`);
        if (!userData) {
          setDebug(prev => prev + '\nNo user data in AsyncStorage');
          return;
        }
        const user = JSON.parse(userData);
        setDebug(prev => prev + `\nFetching: ${API_URL}/user/${user.id}`);
        const res = await fetch(`${API_URL}/user/${user.id}`);
        const data = await res.json();
        setDebug(prev => prev + `\nResponse: ${JSON.stringify(data)}`);
        if (data && data.id) {
          setProfile(data);
        } else {
          setProfile(null);
        }
      } catch (err) {
        setDebug(prev => prev + `\nError: ${err.message}`);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} />;
  }

  if (!profile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.error}>Could not load profile.</Text>
        <Text style={{ color: 'gray', marginTop: 20, fontSize: 12 }}>{debug}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}> 
      <View style={[styles.profileHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}> 
        <View style={styles.avatar}> 
          <Text style={styles.avatarText}> 
            {profile.first_name?.[0]?.toUpperCase()}{profile.last_name?.[0]?.toUpperCase()} 
          </Text> 
        </View> 
        <Text style={styles.fullName}>{profile.first_name} {profile.last_name}</Text>
      </View>
      {/* Vehicle Information */}
      {(profile.vehicle_model || profile.vehicle_year || profile.vehicle_battery_capacity) && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Vehicle Information</Text>
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}> 
            {profile.vehicle_model && (
              <Text style={styles.vehicleField}><Text style={styles.vehicleLabel}>Model:</Text> {profile.vehicle_model}</Text>
            )}
            {profile.vehicle_year && (
              <Text style={styles.vehicleField}><Text style={styles.vehicleLabel}>Year:</Text> {profile.vehicle_year}</Text>
            )}
            {profile.vehicle_battery_capacity && (
              <Text style={styles.vehicleField}><Text style={styles.vehicleLabel}>Battery Capacity:</Text> {profile.vehicle_battery_capacity}</Text>
            )}
          </View>
        </View>
      )}

      

      {/* Account Actions */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <MenuItem
            icon="person"
            title="Edit Profile"
          />
          <MenuItem
            icon="help-circle"
            title="Help & Support"
          />
          <MenuItem
            icon="log-out"
            title="Sign Out"
            onPress={handleSignOut}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#316fea',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  fullName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
  },
  subscriptionInfo: {
    marginTop: 10,
  },
  subscriptionStatus: {
    fontSize: 16,
    marginBottom: 4,
  },
  subscriptionNext: {
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemTitle: {
    fontSize: 16,
    marginLeft: 12,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontSize: 14,
    marginRight: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  preferenceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceTitle: {
    fontSize: 16,
    marginLeft: 12,
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  toggleKnobActive: {
    transform: [{ translateX: 22 }],
  },
  vehicleField: {
    fontSize: 16,
    marginBottom: 4,
  },
  vehicleLabel: {
    fontWeight: 'bold',
  },
});
