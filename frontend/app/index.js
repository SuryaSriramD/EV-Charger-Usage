import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function LandingScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/ev-landing.png')} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to ChargeWise</Text>
        <Text style={styles.subtitle}>
          Track your EV charging habits and optimize your energy usage with ChargeWise.
        </Text>
        <TouchableOpacity style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signupBtn} onPress={() => router.push('/signup')}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footerText}>
        By continuing, you agree to our Terms of Service and Privacy Policy.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafbfc" },
  image: { width: "100%", height: 250, marginBottom: 10 },
  content: { flex: 1, alignItems: "center", paddingHorizontal: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginTop: 46, marginBottom: 12, color: "#222" },
  subtitle: { fontSize: 16, color: "#384254", marginBottom: 68, textAlign: "center" },
  loginBtn: {
    width: "100%", backgroundColor: "#b7c6eb", borderRadius: 30, padding: 16, alignItems: "center", marginBottom: 12
  },
  signupBtn: {
    width: "100%", backgroundColor: "#f0f3fa", borderRadius: 30, padding: 16, alignItems: "center", marginBottom: 12
  },
  loginText: { color: "#273450", fontSize: 18, fontWeight: "bold" },
  signupText: { color: "#384254", fontSize: 18, fontWeight: "bold" },
  footerText: { textAlign: "center", fontSize: 13, color: "#6a7492", marginBottom: 20 }
});
