import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    ViewStyle,
    TextStyle,
    ImageStyle
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AvailabilitySlot {
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
    email: string;
    specialization: string;
    availabilitySlots: AvailabilitySlot[];
}

interface TopDoctorsProps {
    doctors: Doctor[];
    onBookPress?: (doctor: Doctor) => void;
}

export default function TopDoctors({ doctors, onBookPress }: TopDoctorsProps) {
    // Fallback sample images for avatars since the API json doesn't include avatar URLs
    const defaultAvatars = [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    ];

    return (
        <View style={styles.container}>
            {/* Section Header */}
            <View style={styles.headerRow}>
                <Text style={styles.sectionTitle}>Top Rated Doctors</Text>
            </View>

            {/* Doctor Cards List */}
            <FlatList
                data={doctors}
                keyExtractor={(item) => String(item.id)}
                scrollEnabled={false} // Use inside parent ScrollView if needed
                contentContainerStyle={styles.listContainer}
                renderItem={({ item, index }) => {
                    const avatar = defaultAvatars[index % defaultAvatars.length];
                    const hasAvailableSlots = item.availabilitySlots.some(slot => !slot.isBooked);

                    return (
                        <View style={styles.card}>
                            {/* Doctor Avatar */}
                            <Image source={{ uri: avatar }} style={styles.avatar} />

                            {/* Doctor Details */}
                            <View style={styles.infoContainer}>
                                <Text style={styles.doctorName}>Dr. {item.name}</Text>
                                <Text style={styles.specialization}>
                                    {item.specialization} {hasAvailableSlots ? '• Available' : ''}
                                </Text>

                                {/* Rating & Review Mock row matching screenshot style */}
                                <View style={styles.ratingRow}>
                                    <Ionicons name="star" size={14} color="#f59e0b" />
                                    <Text style={styles.ratingText}>4.9 <Text style={styles.reviewText}>(120 Reviews)</Text></Text>
                                </View>
                            </View>

                            {/* Book Now Button */}
                            <TouchableOpacity
                                style={styles.bookButton}
                                activeOpacity={0.8}
                                onPress={() => onBookPress && onBookPress(item)}
                            >
                                <Text style={styles.bookButtonText}>Book Now</Text>
                            </TouchableOpacity>
                        </View>
                    );
                }}
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
    listContainer: { gap: 14 } as ViewStyle,
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
    avatar: { width: 64, height: 64, borderRadius: 18 } as ImageStyle,
    infoContainer: { flex: 1, marginLeft: 14, justifyContent: 'center' } as ViewStyle,
    doctorName: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 2 } as TextStyle,
    specialization: { fontSize: 13, fontWeight: '500', color: '#64748b', marginBottom: 6 } as TextStyle,
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: { fontSize: 13, fontWeight: '700', color: '#0f172a' } as TextStyle,
    reviewText: { fontWeight: '400', color: '#94a3b8' } as TextStyle,
    bookButton: {
        backgroundColor: '#eef2ff',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    } as ViewStyle,
    bookButtonText: { fontSize: 12, fontWeight: '700', color: '#6366f1' } as TextStyle,
});