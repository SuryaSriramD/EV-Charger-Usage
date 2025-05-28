import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTheme } from '../../constants/ThemeContext';

const screenWidth = Dimensions.get('window').width;

// Mock data for charts and analytics
const MOCK_DATA = {
  usageOverTime: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      data: [65, 45, 80, 55, 70, 90, 60]
    }]
  },
  costAnalysis: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{
      data: [120, 150, 180, 140, 200, 160]
    }]
  },
  chargingDistribution: [
    {
      name: "Home",
      population: 45,
      color: "#4CAF50",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Work",
      population: 30,
      color: "#2196F3",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    },
    {
      name: "Public",
      population: 25,
      color: "#FF9800",
      legendFontColor: "#7F7F7F",
      legendFontSize: 12
    }
  ],
  summary: {
    totalSessions: 1250,
    totalEnergy: "1,850 kWh",
    totalCost: "₹450.75",
    avgSessionDuration: "45 min",
    peakHours: "5 PM - 7 PM",
    savings: "₹120.50"
  }
};

export default function StatsScreen() {
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState('week');

  const TimeRangeButton = ({ label, active }) => (
    <TouchableOpacity
      style={[styles.timeButton, active && styles.timeButtonActive]}
      onPress={() => setTimeRange(label.toLowerCase())}
    >
      <Text style={[styles.timeButtonText, active && styles.timeButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ title, value, icon, color, change }) => (
    <View style={[styles.statCard, { borderBottomColor: theme.border }]}>
      <View style={[styles.statHeader, { borderBottomColor: theme.border }]}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={[styles.statTitle, { color: theme.text }]}>{title}</Text>
      </View>
      <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
      {change && (
        <Text style={[styles.statChange, { color: change > 0 ? theme.success : theme.error }]}>
          {change > 0 ? '+' : ''}{change}% from last {timeRange}
        </Text>
      )}
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Charging Analytics</Text>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.border }]}>
          <Ionicons name="options-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Time Range Selector */}
      <View style={[styles.timeRangeContainer, { backgroundColor: theme.cardBackground }]}>
        <TimeRangeButton label="Week" active={timeRange === 'week'} />
        <TimeRangeButton label="Month" active={timeRange === 'month'} />
        <TimeRangeButton label="Year" active={timeRange === 'year'} />
      </View>

      {/* Summary Stats */}
      <View style={[styles.statsGrid, { backgroundColor: theme.cardBackground }]}>
        <StatCard
          title="Total Sessions"
          value={MOCK_DATA.summary.totalSessions}
          icon="flash"
          color="#4CAF50"
          change={12}
        />
        <StatCard
          title="Total Energy"
          value={MOCK_DATA.summary.totalEnergy}
          icon="battery-charging"
          color="#2196F3"
          change={8}
        />
        <StatCard
          title="Total Cost"
          value={MOCK_DATA.summary.totalCost}
          icon="wallet"
          color="#FF9800"
          change={-5}
        />
        <StatCard
          title="Avg. Duration"
          value={MOCK_DATA.summary.avgSessionDuration}
          icon="time"
          color="#9C27B0"
        />
      </View>

      {/* Usage Over Time Chart */}
      <View style={[styles.chartCard, { backgroundColor: theme.cardBackground }]}>
        <View style={[styles.chartHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Usage Over Time</Text>
          <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>Daily charging sessions</Text>
        </View>
        <LineChart
          data={MOCK_DATA.usageOverTime}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(56, 66, 84, ${opacity})`,
            style: { borderRadius: 16 },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#4CAF50"
            }
          }}
          bezier
          style={[styles.chart, { backgroundColor: theme.cardBackground }]}
        />
      </View>

      {/* Cost Analysis Chart */}
      <View style={[styles.chartCard, { backgroundColor: theme.cardBackground }]}>
        <View style={[styles.chartHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Cost Analysis</Text>
          <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>Monthly charging costs</Text>
        </View>
        <BarChart
          data={MOCK_DATA.costAnalysis}
          width={screenWidth - 40}
          height={220}
          yAxisLabel="₹"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(56, 66, 84, ${opacity})`,
            style: { borderRadius: 16 }
          }}
          style={[styles.chart, { backgroundColor: theme.cardBackground }]}
        />
      </View>

      {/* Charging Distribution */}
      <View style={[styles.chartCard, { backgroundColor: theme.cardBackground }]}>
        <View style={[styles.chartHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.chartTitle, { color: theme.text }]}>Charging Distribution</Text>
          <Text style={[styles.chartSubtitle, { color: theme.textSecondary }]}>By location type</Text>
        </View>
        <PieChart
          data={MOCK_DATA.chargingDistribution}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={[styles.chart, { backgroundColor: theme.cardBackground }]}
        />
      </View>

      {/* Savings Card */}
      <View style={[styles.savingsCard, { backgroundColor: theme.cardBackground }]}>
        <View style={[styles.savingsContent, { borderBottomColor: theme.border }]}>
          <View>
            <Text style={[styles.savingsTitle, { color: theme.text }]}>Total Savings</Text>
            <Text style={[styles.savingsValue, { color: theme.primary }]}>{MOCK_DATA.summary.savings}</Text>
            <Text style={[styles.savingsSubtitle, { color: theme.textSecondary }]}>Compared to traditional fuel</Text>
          </View>
          <Ionicons name="leaf" size={40} color={theme.success} />
        </View>
      </View>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterButton: {
    padding: 8,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  timeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  timeButtonActive: {
    backgroundColor: '#4c669f',
  },
  timeButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  timeButtonTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: '50%',
    padding: 10,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartHeader: {
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  savingsCard: {
    backgroundColor: '#4c669f',
    borderRadius: 16,
    margin: 10,
    padding: 20,
  },
  savingsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savingsTitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  savingsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: 4,
  },
  savingsSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
