import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGetAvailabilityQuery } from '@/store/doctorApiSlice';

export default function ManageAvailability() {
  const { data, isLoading, isError } = useGetAvailabilityQuery({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const slots = data?.slots || [];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Manage Availability</Text>
        <TouchableOpacity 
          style={styles.manageBtnContainer} 
          onPress={() => router.push('/screens/manageAbilityScreen')}
        >
          <Ionicons name="settings-outline" size={14} color="#7c3aed" />
          <Text style={styles.manageText}>Manage</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="small" color="#7c3aed" />
        </View>
      ) : isError ? (
        <Text style={styles.errorText}>Failed to load availability slots.</Text>
      ) : slots.length === 0 ? (
        <Text style={styles.emptyText}>No availability slots found.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          {slots.map((slot: any) => {
            const slotId = String(slot.id);
            const isSelected = slotId === selectedId;
            return (
              <TouchableOpacity 
                key={slotId} 
                activeOpacity={0.9}
                onPress={() => setSelectedId(slotId)}
                style={[styles.slotCard, isSelected && styles.selectedCard]}
              >
                <Text style={[styles.slotDate, isSelected && styles.selectedTextMuted]}>
                  {slot.date}
                </Text>
                
                {/* Displaying both Start Time and End Time */}
                <Text style={[styles.slotTime, isSelected && styles.selectedTextBold]} numberOfLines={1}>
                  {slot.startTime} - {slot.endTime}
                </Text>
                
                <View style={[styles.divider, isSelected && styles.selectedDivider]} />

                <View style={styles.actionRow}>
                  <TouchableOpacity>
                    <Ionicons name="create-outline" size={16} color={isSelected ? '#ffffff' : '#64748b'} />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="trash-outline" size={16} color={isSelected ? '#ffffff' : '#64748b'} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  manageBtnContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  manageText: { fontSize: 14, fontWeight: '600', color: '#7c3aed' },
  loaderContainer: { height: 150, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 13, color: '#ef4444', paddingHorizontal: 4 },
  emptyText: { fontSize: 13, color: '#64748b', paddingHorizontal: 4 },
  scrollContainer: { gap: 12, paddingBottom: 4 },
  slotCard: { 
    width: 145, 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    padding: 16, 
    borderWidth: 1, 
    borderColor: '#e2e8f0',
    justifyContent: 'space-between',
    height: 150,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  } as ViewStyle,
  selectedCard: { 
    backgroundColor: '#6366f1', 
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  } as ViewStyle,
  slotDate: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' } as TextStyle,
  selectedTextMuted: { color: '#c7d2fe' } as TextStyle,
  slotTime: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginTop: 4 } as TextStyle,
  selectedTextBold: { color: '#ffffff' } as TextStyle,
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 } as ViewStyle,
  selectedDivider: { backgroundColor: 'rgba(255, 255, 255, 0.2)' } as ViewStyle,
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 } as ViewStyle
});