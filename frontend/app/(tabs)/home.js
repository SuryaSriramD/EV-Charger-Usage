import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../../constants/ThemeContext';

// Mock data for the dashboard
const MOCK_DATA = {
  batteryStatus: {
    level: 75,
    estimatedRange: 240,
    timeToFull: '45 min'
  },
  recentSessions: [
    {
      id: 1,
      location: "MG Road Charging Hub",
      date: "2024-03-15",
      duration: "45 min",
      energy: "25 kWh",
      cost: "₹375"
    },
    {
      id: 2,
      location: "Phoenix MarketCity",
      date: "2024-03-14",
      duration: "30 min",
      energy: "20 kWh",
      cost: "₹360"
    },
    {
      id: 3,
      location: "Cubbon Park Station",
      date: "2024-03-13",
      duration: "60 min",
      energy: "35 kWh",
      cost: "₹420"
    }
  ],
  favoriteStations: [
    {
      id: 1,
      name: "MG Road Charging Hub",
      distance: "0.5 km",
      available: true,
      type: "Level 2",
      price: "₹15/kWh"
    },
    {
      id: 2,
      name: "Phoenix MarketCity",
      distance: "1.2 km",
      available: false,
      type: "DC Fast",
      price: "₹18/kWh"
    },
    {
      id: 3,
      name: "Cubbon Park Station",
      distance: "1.5 km",
      available: true,
      type: "Level 2",
      price: "₹12/kWh"
    }
  ],
  quickStats: {
    totalSessions: 1250,
    totalEnergy: "1,850 kWh",
    totalCost: "₹450.75",
    avgSessionDuration: "45 min"
  }
};

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();
  const { theme } = useTheme();

  const StatCard = ({ title, value, icon, color }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
    </View>
  );

  const BatteryStatus = () => (
    <View style={styles.batteryCard}>
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.batteryGradient}
      >
        <View style={styles.batteryHeader}>
          <Text style={styles.batteryTitle}>Battery Status</Text>
          <Text style={styles.batteryPercentage}>{MOCK_DATA.batteryStatus.level}%</Text>
        </View>
        <View style={styles.batteryInfo}>
          <View style={styles.batteryInfoItem}>
            <Text style={styles.batteryInfoLabel}>Estimated Range</Text>
            <Text style={styles.batteryInfoValue}>{MOCK_DATA.batteryStatus.estimatedRange} mi</Text>
          </View>
          <View style={styles.batteryInfoItem}>
            <Text style={styles.batteryInfoLabel}>Time to Full</Text>
            <Text style={styles.batteryInfoValue}>{MOCK_DATA.batteryStatus.timeToFull}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const RecentSessions = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Sessions</Text>
      {MOCK_DATA.recentSessions.map(session => (
        <View key={session.id} style={[styles.sessionCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.sessionHeader}>
            <Text style={[styles.sessionLocation, { color: theme.text }]}>{session.location}</Text>
            <Text style={[styles.sessionDate, { color: theme.textSecondary }]}>{session.date}</Text>
          </View>
          <View style={styles.sessionDetails}>
            <Text style={[styles.sessionDetail, { color: theme.textSecondary }]}>Duration: {session.duration}</Text>
            <Text style={[styles.sessionDetail, { color: theme.textSecondary }]}>Energy: {session.energy}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const FavoriteStations = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Favorite Stations</Text>
      {MOCK_DATA.favoriteStations.map(station => (
        <TouchableOpacity key={station.id} style={[styles.stationCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.stationInfo}>
            <Text style={[styles.stationName, { color: theme.text }]}>{station.name}</Text>
            <Text style={[styles.stationDistance, { color: theme.textSecondary }]}>{station.distance}</Text>
          </View>
          <View style={[styles.availabilityBadge, { backgroundColor: station.available ? theme.success + '20' : theme.error + '20' }]}>
            <Text style={[styles.availabilityText, { color: station.available ? theme.success : theme.error }]}>
              {station.available ? 'Available' : 'Occupied'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.welcomeText, { color: theme.text }]}>Welcome back!</Text>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push('/notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color="#384254" />
        </TouchableOpacity>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: theme.cardBackground }]}>
        <StatCard title="Total Charging" value={MOCK_DATA.quickStats.totalEnergy} icon="flash" color="#4CAF50" />
        <StatCard title="Savings" value={MOCK_DATA.quickStats.totalCost} icon="wallet" color="#2196F3" />
        <StatCard title="Sessions" value={MOCK_DATA.quickStats.totalSessions} icon="time" color="#FF9800" />
      </View>

      <BatteryStatus />
      <RecentSessions />
      <FavoriteStations />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  notificationButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 0,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    width: '30%',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    marginTop: 4,
  },
  batteryCard: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  batteryGradient: {
    padding: 20,
  },
  batteryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  batteryTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  batteryPercentage: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  batteryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  batteryInfoItem: {
    flex: 1,
  },
  batteryInfoLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
  },
  batteryInfoValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  sessionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sessionLocation: {
    fontSize: 16,
    fontWeight: '600',
  },
  sessionDate: {
    fontSize: 14,
  },
  sessionDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sessionDetail: {
    fontSize: 14,
  },
  stationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  stationDistance: {
    fontSize: 14,
    marginTop: 4,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availabilityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});
