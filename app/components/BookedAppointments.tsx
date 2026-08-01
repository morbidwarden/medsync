import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ViewStyle, 
  TextStyle, 
  ImageStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useGetAppointmentsQuery } from '@/store/doctorApiSlice';

interface Appointment {
  id: string;
  name: string;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING';
  avatarUrl: string;
  accentColor: string;
}

export default function BookedAppointments() {
  const { data, isLoading, isError } = useGetAppointmentsQuery({});
  console.log("data from the bookedappointments", data);
  
  // Extract appointments list from the response payload
  const rawAppointments = data?.appointments || data || [];

  // Map backend response format to the expected component interface
  const appointments = rawAppointments.map((item: any, index: number) => ({
    id: String(item.id || item._id || index),
    name: item.patient?.name || 'Patient Name',
    date: item.appointmentDate || 'Oct 21, 2024',
    time: item.slot?.startTime ? `${item.slot?.startTime}${item.slot?.endTime ? ` - ${item.slot?.endTime}` : ''}` : '09:00 AM',
    status: (item.status?.toUpperCase() === 'CONFIRMED' ? 'CONFIRMED' : 'PENDING') as 'CONFIRMED' | 'PENDING',
    avatarUrl: item.patientAvatar || item.patient?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    accentColor: item.status?.toUpperCase() === 'BOOKED' ? '#6366f1' : '#f59e0b',
  }));

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Booked Appointments</Text>
        <TouchableOpacity>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Appointment Cards List */}
      <View style={styles.listContainer}>
        {appointments.map((item:any) => {
          const isConfirmed = item.status === 'BOOKED';
          return (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.9} 
              style={styles.card}
            >
              {/* Left Accent Color Indicator Bar */}
              <View style={[styles.accentBar, { backgroundColor: item.accentColor }]} />

              <View style={styles.cardContent}>
                {/* Top Row: Avatar, Name & Status Badge */}
                <View style={styles.topRow}>
                  <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                  
                  <View style={styles.nameAndStatus}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={[styles.badge, isConfirmed ? styles.confirmedBadge : styles.pendingBadge]}>
                      <Text style={[styles.badgeText, isConfirmed ? styles.confirmedText : styles.pendingText]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
                </View>

                {/* Bottom Row: Date & Time Metadata */}
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color="#6366f1" />
                    <Text style={styles.metaText}>{item.date}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color="#6366f1" />
                    <Text style={styles.metaText}>{item.time}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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
  viewAllText: { fontSize: 14, fontWeight: '600', color: '#6366f1' } as TextStyle,
  listContainer: { gap: 12 } as ViewStyle,
  card: { 
    backgroundColor: '#ffffff', 
    borderRadius: 24, 
    flexDirection: 'row', 
    overflow: 'hidden',
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  } as ViewStyle,
  accentBar: { width: 6 } as ViewStyle,
  cardContent: { flex: 1, padding: 16 } as ViewStyle,
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as ViewStyle,
  avatar: { width: 50, height: 50, borderRadius: 16 } as ImageStyle,
  nameAndStatus: { flex: 1, marginLeft: 12, justifyContent: 'center' } as ViewStyle,
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 4 } as TextStyle,
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' } as ViewStyle,
  confirmedBadge: { backgroundColor: '#dcfce7' } as ViewStyle,
  pendingBadge: { backgroundColor: '#fef3c7' } as ViewStyle,
  badgeText: { fontSize: 10, fontWeight: '700' } as TextStyle,
  confirmedText: { color: '#15803d' } as TextStyle,
  pendingText: { color: '#b45309' } as TextStyle,
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 14, paddingLeft: 62 } as ViewStyle,
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 } as ViewStyle,
  metaText: { fontSize: 12, fontWeight: '600', color: '#64748b' } as TextStyle,
});