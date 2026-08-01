import React, { useState } from 'react';
import {
    Modal,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    ViewStyle,
    TextStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Slot {
    id: number;
    doctorId: number;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface Doctor {
    id: number;
    name: string;
    specialization: string;
    availabilitySlots: Slot[];
}

interface BookingModalProps {
    visible: boolean;
    doctor: Doctor | null;
    onClose: () => void;
    onConfirmBooking: (slotId: number) => void;
    isBookingLoading?: boolean;
}

export default function BookingModal({
    visible,
    doctor,
    onClose,
    onConfirmBooking,
    isBookingLoading
}: BookingModalProps) {
    const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

    if (!doctor) return null;

    // Filter out already booked slots
    const availableSlots = doctor.availabilitySlots?.filter(slot => !slot.isBooked) || [];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>

                    {/* Header */}
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.modalTitle}>Book Appointment</Text>
                            <Text style={styles.doctorSubtitle}>Dr. {doctor.name} • {doctor.specialization}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={20} color="#64748b" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.sectionLabel}>Select Available Slot</Text>

                    {/* Slot Selection List */}
                    {availableSlots.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={40} color="#94a3b8" />
                            <Text style={styles.emptyText}>No available slots for this doctor right now.</Text>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.slotsGrid} showsVerticalScrollIndicator={false}>
                            {availableSlots.map((slot) => {
                                const isSelected = slot.id === selectedSlotId;
                                return (
                                    <TouchableOpacity
                                        key={slot.id}
                                        activeOpacity={0.8}
                                        onPress={() => setSelectedSlotId(slot.id)}
                                        style={[styles.slotCard, isSelected && styles.selectedSlotCard]}
                                    >
                                        <Ionicons
                                            name="time-outline"
                                            size={18}
                                            color={isSelected ? '#ffffff' : '#6366f1'}
                                        />
                                        <View style={styles.slotDetails}>
                                            <Text style={[styles.slotDateText, isSelected && styles.selectedTextMuted]}>
                                                {slot.date}
                                            </Text>
                                            <Text style={[styles.slotTimeText, isSelected && styles.selectedTextBold]}>
                                                {slot.startTime} - {slot.endTime}
                                            </Text>
                                        </View>
                                        {isSelected && (
                                            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    )}

                    {/* Confirm Action Button */}
                    {availableSlots.length > 0 && (
                        <TouchableOpacity
                            style={[styles.confirmButton, !selectedSlotId && styles.disabledButton]}
                            disabled={!selectedSlotId || isBookingLoading}
                            onPress={() => selectedSlotId && onConfirmBooking(selectedSlotId)}
                            activeOpacity={0.9}
                        >
                            {isBookingLoading ? (
                                <ActivityIndicator color="#ffffff" size="small" />
                            ) : (
                                <Text style={styles.confirmButtonText}>Confirm Appointment</Text>
                            )}
                        </TouchableOpacity>
                    )}

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        justifyContent: 'flex-end',
    } as ViewStyle,
    modalContent: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        maxHeight: '75%',
        minHeight: '50%',
    } as ViewStyle,
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    } as ViewStyle,
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
    } as TextStyle,
    doctorSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 2,
    } as TextStyle,
    closeButton: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#334155',
        marginBottom: 12,
    } as TextStyle,
    slotsGrid: {
        gap: 10,
        paddingBottom: 20,
    } as ViewStyle,
    slotCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        padding: 16,
        gap: 14,
    } as ViewStyle,
    selectedSlotCard: {
        backgroundColor: '#6366f1',
        borderColor: '#6366f1',
    } as ViewStyle,
    slotDetails: {
        flex: 1,
    } as ViewStyle,
    slotDateText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
    } as TextStyle,
    selectedTextMuted: {
        color: '#c7d2fe',
    } as TextStyle,
    slotTimeText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
        marginTop: 2,
    } as TextStyle,
    selectedTextBold: {
        color: '#ffffff',
    } as TextStyle,
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    } as ViewStyle,
    emptyText: {
        fontSize: 14,
        color: '#94a3b8',
        textAlign: 'center',
    } as TextStyle,
    confirmButton: {
        backgroundColor: '#6366f1',
        borderRadius: 16,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    } as ViewStyle,
    disabledButton: {
        backgroundColor: '#cbd5e1',
        shadowOpacity: 0,
        elevation: 0,
    } as ViewStyle,
    confirmButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    } as TextStyle,
});