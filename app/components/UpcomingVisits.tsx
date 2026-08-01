import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  FlatList, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConfirmedSlot {
  id: string | number;
  doctorName: string;
  specialization: string;
  date: string; // e.g., "OCT 21" or "2026-08-05"
  time: string; // e.g., "09:00 AM"
}

interface UpcomingVisitsProps {
  visits: ConfirmedSlot[];
  onSeeAllPress?: () => void;
  onCallPress?: (visit: ConfirmedSlot) => void;
}

export default function UpcomingVisits({ visits, onSeeAllPress, onCallPress }: UpcomingVisitsProps) {
  if (!visits || visits.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Upcoming Visits</Text>
        <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
          <Text style={styles.seeAllText}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Visits List */}
      <FlatList
        data={visits}
        keyExtractor={(item) => String(item.id)}
        scrollEnabled={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Date Box Icon */}
            <View style={styles.dateBox}>
              <Text style={styles.dateMonth}>APPT</Text>
              <Text style={styles.dateDay}>{item.date}</Text>
            </View>

            {/* Doctor Info */}
            <View style={styles.infoContainer}>
              <Text style={styles.doctorName}>Dr. {item.doctorName}</Text>
              <Text style={styles.specializationText}>
                {item.specialization} • {item.time}
              </Text>
            </View>

            {/* Action Call Button */}
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onCallPress && onCallPress(item)}
              activeOpacity={0.8}
            >
              <Ionicons name="call" size={18} color="#6366f1" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 } as ViewStyle,
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 14, 
    paddingHorizontal: 4 
  } as ViewStyle,
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' } as TextStyle,
  seeAllText: { fontSize: 14, fontWeight: '600', color: '#6366f1' } as TextStyle,
  listContainer: { gap: 12 } as ViewStyle,
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 24, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2 
  } as ViewStyle,
  dateBox: { 
    width: 60, 
    height: 60, 
    borderRadius: 18, 
    backgroundColor: '#6366f1', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 4
  } as ViewStyle,
  dateMonth: { fontSize: 10, fontWeight: '700', color: '#c7d2fe', textTransform: 'uppercase' } as TextStyle,
  dateDay: { fontSize: 14, fontWeight: '800', color: '#ffffff', marginTop: 2 } as TextStyle,
  infoContainer: { flex: 1, marginLeft: 14, justifyContent: 'center' } as ViewStyle,
  doctorName: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 2 } as TextStyle,
  specializationText: { fontSize: 13, fontWeight: '500', color: '#64748b' } as TextStyle,
  actionButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    backgroundColor: '#eef2ff', 
    justifyContent: 'center', 
    alignItems: 'center' 
  } as ViewStyle,
});