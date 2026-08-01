import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    ScrollView, 
    TouchableOpacity, 
    TextInput, 
    ActivityIndicator, 
    Alert,
    ViewStyle, 
    TextStyle 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useGetAvailabilityQuery, useDeleteAvailabilityMutation } from '@/store/doctorApiSlice';

export default function ManageAvailabilityScreen() {
    const { data, isLoading, isError } = useGetAvailabilityQuery({});
    const [deleteAvailability, { isLoading: isDeleting }] = useDeleteAvailabilityMutation();
    const [searchFilter, setSearchFilter] = useState('');

    const slots = data?.slots || [];

    // Filter slots based on user search input
    const filteredSlots = slots.filter((slot: any) => 
        slot.date?.toLowerCase().includes(searchFilter.toLowerCase()) ||
        slot.startTime?.toLowerCase().includes(searchFilter.toLowerCase())
    );

    // Group filtered slots by their date string
    const groupedSlots = filteredSlots.reduce((acc: Record<string, any[]>, slot: any) => {
        const dateKey = slot.date || 'OTHER DATES';
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(slot);
        return acc;
    }, {});

    const handleDeleteSlot = async (slot: any) => {
        // Prevent deletion if the slot is booked
        if (slot.isBooked) {
            Alert.alert('Cannot Delete', 'This slot is already booked by a patient and cannot be deleted.');
            return;
        }

        Alert.alert(
            'Delete Slot',
            'Are you sure you want to delete this availability slot?',
            [
                { text: 'Cancel', style: 'cancel' },
                { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteAvailability(slot.id || slot._id).unwrap();
                            Alert.alert('Success', 'Availability slot deleted successfully.');
                        } catch (err: any) {
                            console.error('Failed to delete slot:', err);
                            Alert.alert('Error', err?.data?.message || 'Could not delete availability slot.');
                        }
                    }
                }
            ]
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            
            {/* Top Navigation Row */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()} activeOpacity={0.8}>
                    <Ionicons name="chevron-back" size={20} color="#0f172a" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Manage Availability</Text>

                <View style={styles.headerRightButtons}>
                    <TouchableOpacity 
                        style={styles.addButtonCircle} 
                        onPress={() => router.push('/screens/add-availability')} 
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={20} color="#ffffff" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionIconButton} activeOpacity={0.8}>
                        <Ionicons name="exit-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Date Filter Bar */}
            <View style={styles.searchBar}>
                <Ionicons name="calendar-outline" size={18} color="#94a3b8" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Filter by date..."
                    placeholderTextColor="#94a3b8"
                    value={searchFilter}
                    onChangeText={setSearchFilter}
                />
            </View>

            {/* Content List */}
            {isLoading ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color="#6366f1" />
                </View>
            ) : isError ? (
                <Text style={styles.errorText}>Failed to load availability slots.</Text>
            ) : Object.keys(groupedSlots).length === 0 ? (
                <Text style={styles.emptyText}>No availability slots found.</Text>
            ) : (
                Object.keys(groupedSlots).map((dateKey) => {
                    const dateSlots = groupedSlots[dateKey];
                    return (
                        <View key={dateKey} style={styles.sectionGroup}>
                            <Text style={styles.dateSectionHeader}>{dateKey}</Text>

                            {dateSlots.map((slot: any) => {
                                const isAvailable = !slot.isBooked;
                                const statusText = isAvailable ? 'Available' : 'Booked';
                                const slotId = slot.id || slot._id;

                                return (
                                    <View key={slotId} style={styles.slotCard}>
                                        <View style={styles.slotIconBox}>
                                            <Ionicons name="time-outline" size={20} color="#6366f1" />
                                        </View>

                                        <View style={styles.slotInfo}>
                                            <Text style={styles.slotTimeText}>
                                                {slot.startTime} - {slot.endTime}
                                            </Text>
                                            <Text style={[styles.slotStatusText, isAvailable ? styles.availableText : styles.bookedText]}>
                                                {statusText}
                                            </Text>
                                        </View>

                                        <View style={styles.cardActions}>
                                            <TouchableOpacity style={styles.iconActionBtn} activeOpacity={0.7}>
                                                <Ionicons name="create-outline" size={18} color="#94a3b8" />
                                            </TouchableOpacity>
                                            <TouchableOpacity 
                                                style={[styles.iconActionBtn, slot.isBooked && styles.disabledActionBtn]} 
                                                onPress={() => handleDeleteSlot(slot)} 
                                                disabled={isDeleting}
                                                activeOpacity={0.7}
                                            >
                                                <Ionicons 
                                                    name="trash-outline" 
                                                    size={18} 
                                                    color={slot.isBooked ? '#cbd5e1' : '#ef4444'} 
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    );
                })
            )}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f8fafc',
        flexGrow: 1,
    } as ViewStyle,
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    } as ViewStyle,
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    } as ViewStyle,
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0f172a',
    } as TextStyle,
    headerRightButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    } as ViewStyle,
    addButtonCircle: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    actionIconButton: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#fff1f2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ffe4e6',
    } as ViewStyle,
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 24,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    } as ViewStyle,
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
    } as TextStyle,
    dateSectionHeader: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: 12,
        marginTop: 8,
        marginLeft: 4,
        letterSpacing: 0.8,
    } as TextStyle,
    sectionGroup: {
        gap: 12,
        marginBottom: 16,
    } as ViewStyle,
    slotCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    } as ViewStyle,
    slotIconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#eef2ff',
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    slotInfo: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    } as ViewStyle,
    slotTimeText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 2,
    } as TextStyle,
    slotStatusText: {
        fontSize: 12,
        fontWeight: '600',
    } as TextStyle,
    availableText: {
        color: '#10b981',
    } as TextStyle,
    bookedText: {
        color: '#6366f1',
    } as TextStyle,
    cardActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    } as ViewStyle,
    iconActionBtn: {
        padding: 4,
    } as ViewStyle,
    disabledActionBtn: {
        opacity: 0.6,
    } as ViewStyle,
    loaderContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    } as ViewStyle,
    errorText: {
        color: '#ef4444',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 20,
    } as TextStyle,
    emptyText: {
        color: '#94a3b8',
        fontSize: 13,
        textAlign: 'center',
        marginTop: 20,
    } as TextStyle,
});