import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/ThemeContext';

// User data with vehicles and subscriptions
const USER_DATA = {
  'sriram.d': {
    vehicle: {
      model: 'Tesla Model 3',
      year: '2023',
      batteryCapacity: '75 kWh'
    },
    subscription: {
      plan: 'Premium',
      status: 'Active',
      nextBilling: 'March 1, 2027'
    }
  },
  'john.doe': {
    vehicle: {
      model: 'Nissan Leaf',
      year: '2022',
      batteryCapacity: '62 kWh'
    },
    subscription: {
      plan: 'Basic',
      status: 'Active',
      nextBilling: 'February 15, 2026'
    }
  },
  'jane.smith': {
    vehicle: {
      model: 'Ford Mustang Mach-E',
      year: '2023',
      batteryCapacity: '88 kWh'
    },
    subscription: {
      plan: 'Premium Plus',
      status: 'Active',
      nextBilling: 'April 1, 2025'
    }
  },
  'admin': {
    vehicle: {
      model: 'BMW i4',
      year: '2023',
      batteryCapacity: '83.9 kWh'
    },
    subscription: {
      plan: 'Enterprise',
      status: 'Active',
      nextBilling: 'December 31, 2024'
    }
  }
};

export default function AccountScreen() {
  const router = useRouter();
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState(null);
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: isDarkMode,
    autoConnect: true
  });

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    setPreferences(prev => ({
      ...prev,
      darkMode: isDarkMode
    }));
  }, [isDarkMode]);

  const loadUserData = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        setUsername(currentUser);
        const data = USER_DATA[currentUser] || {
          vehicle: {
            model: 'Not Set',
            year: 'N/A',
            batteryCapacity: 'N/A'
          },
          subscription: {
            plan: 'Basic',
            status: 'Inactive',
            nextBilling: 'N/A'
          }
        };
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const togglePreference = (key) => {
    if (key === 'darkMode') {
      toggleTheme();
    } else {
      setPreferences(prev => ({
        ...prev,
        [key]: !prev[key]
      }));
    }
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.removeItem('currentUser');
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const PreferenceItem = ({ icon, title, value, onToggle }) => (
    <View style={[styles.preferenceItem, { borderBottomColor: theme.border }]}>
      <View style={styles.preferenceInfo}>
        <Ionicons name={icon} size={24} color={theme.primary} />
        <Text style={[styles.preferenceTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <TouchableOpacity
        style={[styles.toggle, { backgroundColor: theme.toggleBackground }, value && { backgroundColor: theme.toggleActive }]}
        onPress={onToggle}
      >
        <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
      </TouchableOpacity>
    </View>
  );

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

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Profile Header */}
      <View style={[styles.profileHeader, { backgroundColor: theme.headerBackground, borderBottomColor: theme.border }]}>
        <Image
          source={{ uri: `https://ui-avatars.com/api/?name=${username}&background=4c669f&color=fff` }}
          style={styles.profileImage}
        />
        <Text style={[styles.userName, { color: theme.text }]}>{username}</Text>
        <Text style={[styles.memberSince, { color: theme.textTertiary }]}>
          Member since {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </Text>
      </View>

      {/* Subscription Card */}
      {userData && (
        <View style={styles.section}>
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.cardHeader}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <Text style={[styles.cardTitle, { color: theme.text }]}>{userData.subscription.plan} Subscription</Text>
            </View>
            <View style={styles.subscriptionInfo}>
              <Text style={[styles.subscriptionStatus, { color: theme.success }]}>
                Status: {userData.subscription.status}
              </Text>
              <Text style={[styles.subscriptionNext, { color: theme.textSecondary }]}>
                Next billing: {userData.subscription.nextBilling}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Vehicle Information */}
      {userData && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Vehicle Information</Text>
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <MenuItem
              icon="car"
              title="Vehicle Model"
              value={userData.vehicle.model}
            />
            <MenuItem
              icon="calendar"
              title="Year"
              value={userData.vehicle.year}
            />
            <MenuItem
              icon="battery-charging"
              title="Battery Capacity"
              value={userData.vehicle.batteryCapacity}
            />
          </View>
        </View>
      )}

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
          <PreferenceItem
            icon="notifications"
            title="Push Notifications"
            value={preferences.notifications}
            onToggle={() => togglePreference('notifications')}
          />
          <PreferenceItem
            icon="moon"
            title="Dark Mode"
            value={preferences.darkMode}
            onToggle={() => togglePreference('darkMode')}
          />
          <PreferenceItem
            icon="flash"
            title="Auto-Connect"
            value={preferences.autoConnect}
            onToggle={() => togglePreference('autoConnect')}
          />
        </View>
      </View>

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
});
