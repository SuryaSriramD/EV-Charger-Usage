import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Linking, Platform } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../constants/ThemeContext';

// Mock data for charging stations
const MOCK_CHARGING_STATIONS = [
  {
    id: 1,
    name: "Tata Power - Davanam Suites",
    latitude: 12.9216509,
    longitude: 77.6206294,
    available: true,
    type: "DC Fast",
    power: "30 kW",
    price: "₹21/kWh",
    distance: "2.5 km",
    rating: 4.1,
    totalPorts: 2,
    availablePorts: 1
  },
  {
    id: 2,
    name: "BESCOM EV Charging Station - Jayanagar",
    latitude: 12.9293,
    longitude: 77.5828,
    available: true,
    type: "Level 2",
    power: "15 kW",
    price: "₹15/kWh",
    distance: "3.2 km",
    rating: 3.8,
    totalPorts: 3,
    availablePorts: 2
  },
  {
    id: 3,
    name: "Ather Grid - Indiranagar",
    latitude: 12.9784,
    longitude: 77.6408,
    available: true,
    type: "Level 2",
    power: "7.2 kW",
    price: "₹18/kWh",
    distance: "4.1 km",
    rating: 4.2,
    totalPorts: 2,
    availablePorts: 1
  },
  {
    id: 4,
    name: "ChargeGrid - MG Road",
    latitude: 12.9740,
    longitude: 77.6148,
    available: false,
    type: "DC Fast",
    power: "50 kW",
    price: "₹22/kWh",
    distance: "5.5 km",
    rating: 4.0,
    totalPorts: 2,
    availablePorts: 0
  },
  {
    id: 5,
    name: "Relux Electric - HSR Layout",
    latitude: 12.9121,
    longitude: 77.6446,
    available: true,
    type: "DC Fast",
    power: "60 kW",
    price: "₹20/kWh",
    distance: "6.8 km",
    rating: 4.5,
    totalPorts: 4,
    availablePorts: 3
  },
  {
    id: 6,
    name: "Koramangala Hub",
    latitude: 12.9279,
    longitude: 77.6271,
    available: false,
    type: "DC Fast",
    power: "180 kW",
    price: "₹20/kWh",
    distance: "1.0 km",
    rating: 4.7,
    totalPorts: 2,
    availablePorts: 0
  },
  {
    id: 7,
    name: "Statiq - Li-Whitefield Hub",
    latitude: 12.9788,
    longitude: 77.7258,
    available: true,
    type: "DC Fast",
    power: "60 kW",
    price: "₹25/kWh",
    distance: "8.5 km",
    rating: 4.5,
    totalPorts: 8,
    availablePorts: 6
  },
  {
    id: 8,
    name: "Jio-Bp Pulse - Electronic City",
    latitude: 12.8452,
    longitude: 77.6602,
    available: true,
    type: "DC Fast",
    power: "50 kW",
    price: "₹21/kWh",
    distance: "15.2 km",
    rating: 4.4,
    totalPorts: 4,
    availablePorts: 3
  },
  {
    id: 9,
    name: "Zeon Charging - Orion Mall",
    latitude: 13.0110,
    longitude: 77.5552,
    available: false,
    type: "DC Fast",
    power: "50 kW",
    price: "₹24/kWh",
    distance: "6.1 km",
    rating: 4.2,
    totalPorts: 3,
    availablePorts: 0
  },
  {
    id: 10,
    name: "Tata Power - Adishakti Cars, Hebbal",
    latitude: 13.0402,
    longitude: 77.5959,
    available: true,
    type: "DC Fast",
    power: "25 kW",
    price: "₹20/kWh",
    distance: "9.8 km",
    rating: 4.0,
    totalPorts: 2,
    availablePorts: 2
  },
  {
    "id": 11,
    "name": "ChargeGrid - Forum Mall, Koramangala",
    "latitude": 12.9345,
    "longitude": 77.6110,
    "available": true,
    "type": "Level 2",
    "power": "22 kW",
    "price": "₹18/kWh",
    "distance": "0.8 km",
    "rating": 4.1,
    "totalPorts": 4,
    "availablePorts": 2
  }
];

export default function MapScreen() {
  const { theme } = useTheme();
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedStation, setSelectedStation] = useState(null);
  const [isChargerListExpanded, setIsChargerListExpanded] = useState(true);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleMarkerPress = (station) => {
    setSelectedStation(station);
    setIsChargerListExpanded(false);
    mapRef.current?.animateToRegion({
      latitude: station.latitude,
      longitude: station.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  const toggleChargerList = () => {
    setIsChargerListExpanded(!isChargerListExpanded);
  };

  // Function to open native maps app
  const handleNavigate = () => {
    if (!selectedStation) return;
    const { latitude, longitude, name } = selectedStation;
    let url = '';
    if (Platform.OS === 'ios') {
      url = `http://maps.apple.com/?daddr=${latitude},${longitude}&dirflg=d`;
    } else {
      url = `geo:${latitude},${longitude}?q=${encodeURIComponent(name)}`;
    }
    Linking.openURL(url);
  };

  const StationCallout = ({ station }) => (
    <Callout tooltip onPress={() => handleMarkerPress(station)}>
      <View style={[styles.calloutContainer, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.calloutTitle, { color: theme.text }]}>{station.name}</Text>
        <View style={styles.calloutDetails}>
          <View style={styles.calloutRow}>
            <Ionicons name="flash" size={16} color={theme.primary} />
            <Text style={[styles.calloutText, { color: theme.textSecondary }]}>{station.type} • {station.power}</Text>
          </View>
          <View style={styles.calloutRow}>
            <Ionicons name="cash" size={16} color={theme.primary} />
            <Text style={[styles.calloutText, { color: theme.textSecondary }]}>{station.price}</Text>
          </View>
          <View style={styles.calloutRow}>
            <Ionicons name="time" size={16} color={theme.primary} />
            <Text style={[styles.calloutText, { color: theme.textSecondary }]}>{station.distance}</Text>
          </View>
          <View style={styles.calloutRow}>
            <Ionicons name="star" size={16} color={theme.primary} />
            <Text style={[styles.calloutText, { color: theme.textSecondary }]}>{station.rating} • {station.availablePorts}/{station.totalPorts} ports</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.calloutButton, { backgroundColor: theme.primary }]}
          onPress={() => handleMarkerPress(station)}
        >
          <Text style={styles.calloutButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Callout>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords?.latitude || 12.9716,
          longitude: location?.coords?.longitude || 77.5946,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        minZoomLevel={0}
        maxZoomLevel={20}
      >
        {MOCK_CHARGING_STATIONS.map((station) => (
          <Marker
            key={station.id}
            coordinate={{
              latitude: station.latitude,
              longitude: station.longitude,
            }}
            onPress={() => handleMarkerPress(station)}
            tracksViewChanges={false} // Optimize marker rendering
          >
            <View style={[
              styles.markerContainer,
              selectedStation?.id === station.id && styles.selectedMarkerContainer
            ]}>
              <View style={[
                styles.marker,
                { backgroundColor: station.available ? theme.success : theme.error },
                selectedStation?.id === station.id && styles.selectedMarker
              ]}>
                <Ionicons 
                  name="flash" 
                  size={selectedStation?.id === station.id ? 20 : 16} 
                  color="white" 
                />
              </View>
            </View>
            <StationCallout station={station} />
          </Marker>
        ))}
      </MapView>

      {selectedStation && (
        <View style={[styles.stationDetails, { backgroundColor: theme.cardBackground }]}>
          <TouchableOpacity 
            style={[styles.closeButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              setSelectedStation(null);
              setIsChargerListExpanded(true);
            }}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.stationName, { color: theme.text }]}>{selectedStation.name}</Text>
          <View style={styles.stationInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="flash" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{selectedStation.type} • {selectedStation.power}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="cash" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{selectedStation.price}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{selectedStation.distance}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="star" size={20} color={theme.primary} />
              <Text style={[styles.infoText, { color: theme.textSecondary }]}>{selectedStation.rating} • {selectedStation.availablePorts}/{selectedStation.totalPorts} ports</Text>
            </View>
          </View>
          <TouchableOpacity style={[styles.navigateButton, { backgroundColor: theme.primary }]} onPress={handleNavigate}>
            <Text style={styles.navigateButtonText}>Navigate</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={[
        styles.overlay,
        { backgroundColor: theme.cardBackground },
        !isChargerListExpanded && styles.overlayCollapsed
      ]}>
        <TouchableOpacity 
          style={styles.overlayHeader}
          onPress={toggleChargerList}
        >
          <Text style={[styles.overlayTitle, { color: theme.text }]}>Nearby Chargers</Text>
          <Ionicons 
            name={isChargerListExpanded ? "chevron-down" : "chevron-up"} 
            size={24} 
            color={theme.text} 
          />
        </TouchableOpacity>
        {isChargerListExpanded && (
          <ScrollView style={styles.chargerList}>
            {MOCK_CHARGING_STATIONS.map((charger) => (
              <TouchableOpacity
                key={charger.id}
                style={[styles.chargerItem, { borderBottomColor: theme.border }]}
                onPress={() => handleMarkerPress(charger)}
              >
                <View>
                  <Text style={[styles.chargerTitle, { color: theme.text }]}>{charger.name}</Text>
                  <Text style={[styles.chargerType, { color: theme.textSecondary }]}>
                    {charger.type}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        charger.available ? theme.success + '20' : theme.error + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: charger.available ? theme.success : theme.error,
                      },
                    ]}
                  >
                    {charger.available ? 'Available' : 'In Use'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 100,
  },
  calloutContainer: {
    width: 200,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  calloutDetails: {
    marginBottom: 8,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 14,
    marginLeft: 8,
  },
  calloutButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  stationDetails: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 220,
    marginBottom: 60,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stationName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  stationInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
  },
  navigateButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayCollapsed: {
    paddingVertical: 10,
  },
  overlayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  overlayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chargerList: {
    maxHeight: 300,
  },
  chargerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chargerTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  chargerType: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedMarkerContainer: {
    transform: [{ scale: 1.2 }],
  },
  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedMarker: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#4c669f',
  },
});
