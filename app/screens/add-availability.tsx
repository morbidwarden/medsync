import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch,
    ScrollView,
    ViewStyle,
    TextStyle,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useAddAvailabilityMutation } from '@/store/doctorApiSlice';

export default function AddAvailabilityScreen() {
    const [sessionDuration, setSessionDuration] = useState<'15 Min' | '30 Min' | '60 Min'>('15 Min');
    const [repeatWeekly, setRepeatWeekly] = useState(false);

    // States for date and time values & picker visibility
    const [date, setDate] = useState<Date>(new Date());
    const [startTime, setStartTime] = useState<Date>(new Date());
    const [endTime, setEndTime] = useState<Date>(new Date());

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);

    // RTK Query mutation hook
    const [addAvailability, { isLoading }] = useAddAvailabilityMutation();

    const handleSave = async () => {
        try {
            // Format helpers to match backend schema: "YYYY-MM-DD" and "HH:mm:ss"
            const formatDateForApi = (d: Date) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const formatTimeForApi = (d: Date) => {
                const hours = String(d.getHours()).padStart(2, '0');
                const minutes = String(d.getMinutes()).padStart(2, '0');
                const seconds = String(d.getSeconds()).padStart(2, '0');
                return `${hours}:${minutes}:${seconds}`;
            };

            const payload = {
                date: formatDateForApi(date),
                startTime: formatTimeForApi(startTime),
                endTime: formatTimeForApi(endTime),
            };

            await addAvailability(payload).unwrap();

            Alert.alert('Success', 'Availability saved successfully!');
            router.back();
        } catch (err: any) {
            console.error('Failed to save availability:', err);
            Alert.alert('Error', err?.data?.message || 'Could not save availability.');
        }
    };

    // Format helpers
    const formatDate = (d: Date) => {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const formatTime = (d: Date) => {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header Row */}
            <View style={styles.headerRow}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={20} color="#0f172a" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Availability</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Select Date Section */}
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Select Date</Text>
                <TouchableOpacity style={styles.fieldBox} onPress={() => setShowDatePicker(true)}>
                    <Ionicons name="calendar-outline" size={20} color="#6366f1" />
                    <Text style={styles.placeholderText}>{formatDate(date)}</Text>
                    <Ionicons name="calendar-outline" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                        setShowDatePicker(false);
                        if (selectedDate) setDate(selectedDate);
                    }}
                />
            )}

            {/* Start Time & End Time Row */}
            <View style={styles.timeRow}>
                <View style={styles.timeColumn}>
                    <Text style={styles.label}>Start Time</Text>
                    <TouchableOpacity style={styles.timeFieldBox} onPress={() => setShowStartTimePicker(true)}>
                        <Ionicons name="time-outline" size={18} color="#6366f1" />
                        <Text style={styles.placeholderText}>{formatTime(startTime)}</Text>
                        <Ionicons name="time-outline" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                </View>

                <View style={styles.timeColumn}>
                    <Text style={styles.label}>End Time</Text>
                    <TouchableOpacity style={styles.timeFieldBox} onPress={() => setShowEndTimePicker(true)}>
                        <Ionicons name="time-outline" size={18} color="#6366f1" />
                        <Text style={styles.placeholderText}>{formatTime(endTime)}</Text>
                        <Ionicons name="time-outline" size={18} color="#94a3b8" />
                    </TouchableOpacity>
                </View>
            </View>

            {showStartTimePicker && (
                <DateTimePicker
                    value={startTime}
                    mode="time"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedTime?: Date) => {
                        setShowStartTimePicker(false);
                        if (selectedTime) setStartTime(selectedTime);
                    }}
                />
            )}

            {showEndTimePicker && (
                <DateTimePicker
                    value={endTime}
                    mode="time"
                    display="default"
                    onChange={(event: DateTimePickerEvent, selectedTime?: Date) => {
                        setShowEndTimePicker(false);
                        if (selectedTime) setEndTime(selectedTime);
                    }}
                />
            )}

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSave}
                    activeOpacity={0.9}
                    disabled={isLoading}
                >
                    <Text style={styles.saveButtonText}>
                        {isLoading ? 'Saving...' : 'Save Availability'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()} activeOpacity={0.9}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f8fafc',
        flexGrow: 1,
        justifyContent: 'flex-start'
    } as ViewStyle,
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 28
    } as ViewStyle,
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0'
    } as ViewStyle,
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' } as TextStyle,
    headerSpacer: { width: 40 } as ViewStyle,
    inputGroup: { marginBottom: 20 } as ViewStyle,
    label: { fontSize: 13, fontWeight: '700', color: '#0f172a', marginBottom: 8 } as TextStyle,
    fieldBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1
    } as ViewStyle,
    placeholderText: { fontSize: 14, fontWeight: '600', color: '#0f172a' } as TextStyle,
    timeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 } as ViewStyle,
    timeColumn: { flex: 1 } as ViewStyle,
    timeFieldBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        paddingHorizontal: 14,
        height: 52,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1
    } as ViewStyle,
    durationRow: { flexDirection: 'row', gap: 10 } as ViewStyle,
    durationButton: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 14,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    } as ViewStyle,
    activeDurationButton: {
        backgroundColor: '#ffffff',
        borderColor: '#6366f1',
        borderWidth: 2,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2
    } as ViewStyle,
    durationText: { fontSize: 14, fontWeight: '600', color: '#64748b' } as TextStyle,
    activeDurationText: { color: '#6366f1', fontWeight: '700' } as TextStyle,
    toggleCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 28,
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1
    } as ViewStyle,
    toggleTextContainer: { flex: 1 } as ViewStyle,
    toggleTitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginBottom: 2 } as TextStyle,
    toggleSubtitle: { fontSize: 12, fontWeight: '500', color: '#94a3b8' } as TextStyle,
    actionContainer: { gap: 12 } as ViewStyle,
    saveButton: {
        backgroundColor: '#6366f1',
        borderRadius: 16,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3
    } as ViewStyle,
    saveButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' } as TextStyle,
    cancelButton: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 16,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center'
    } as ViewStyle,
    cancelButtonText: { color: '#64748b', fontSize: 16, fontWeight: '600' } as TextStyle,
});