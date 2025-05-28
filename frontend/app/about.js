import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function AboutScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>About EV Charger Stats</Text>
      <Text style={styles.body}>
        EV Charger Stats is your go-to app for tracking and analyzing your electric vehicle charging habits.
        We provide detailed insights into your charging sessions, helping you optimize your energy usage and save money.
      </Text>
      <Text style={styles.heading}>Contact Us</Text>
      <Text style={styles.body}>
        For any questions or support, please reach out to us at support@evchargerstats.com.
      </Text>
      <Text style={styles.heading}>Legal</Text>
      <TouchableOpacity onPress={() => router.push('/terms')}>
        <Text style={styles.link}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/privacy')}>
        <Text style={styles.link}>Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafbfc", padding: 20 },
  back: { position: 'absolute', top: 50, left: 24, zIndex: 1 },
  backText: { fontSize: 28, color: "#384254" },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: "#273450" },
  heading: { fontSize: 20, fontWeight: 'bold', marginTop: 18, marginBottom: 5, color: "#273450" },
  body: { fontSize: 16, color: "#384254", marginBottom: 10 },
  link: { fontSize: 16, color: "#5c6e91", marginBottom: 10 }
});
