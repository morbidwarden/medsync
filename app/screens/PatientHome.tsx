import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ViewStyle, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserIntro from '../components/userIntro';
import TopDoctors from '../components/TopDoctors';
import { RootState } from '../../store/store';
import { useSelector } from 'react-redux';
import { useBookAppointmentMutation, useGetAppointmentsQuery, useGetDoctorsQuery } from '../../store/patientApiSlice';
import BookingModal from '../components/BookingModal';
import UpcomingVisits from '../components/UpcomingVisits';

export default function PatientHome() {
    const { name, specialization } = useSelector((state: RootState) => state.auth);
    const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    //const [isBookingLoading, setIsBookingLoading] = useState(false);
    const { data: appointmentsData } = useGetAppointmentsQuery({});
    const { data, isLoading, isError } = useGetDoctorsQuery({});
    const doctorsList = data?.doctors || [];
    const [bookAppointment, { isLoading: setIsBookingLoading }] = useBookAppointmentMutation();
    const handleOpenBooking = (doctor: any) => {
     setSelectedDoctor(doctor);
     setIsModalVisible(true);
   };
   console.log("APPT", appointmentsData)
   const confirmedVisits = (appointmentsData?.appointments || appointmentsData || []).map((appt: any) => ({
        id: appt.id,
        doctorName: appt.doctor?.name || 'Doctor',
        specialization: appt.doctor?.specialization || 'Doctor',
        date: appt.slot.date || 'TODAY',
        time: appt.slot.startTime ? `${appt.slot.startTime}${appt.slot.endTime ? ` - ${appt.slot.endTime}` : ''}` : '09:00 AM',
    }));
    const handleConfirmBooking = async (slotId: number) => {
        try {
            await bookAppointment({ slotId }).unwrap();

            Alert.alert('Success', 'Appointment booked successfully!');
            setIsModalVisible(false);
        } catch (err: any) {
            Alert.alert('Error', err?.data?.message || 'Failed to book appointment.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <UserIntro
                name={`${name || 'James Wilson'}`}
                subtitle={specialization || 'General Physician'}
            />
            <UpcomingVisits
                visits={confirmedVisits}
                onSeeAllPress={() => console.log('See all appointments')}
                onCallPress={(visit) => console.log('Call doctor for visit:', visit.id)}
            />
            {isLoading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="small" color="#6366f1" />
                </View>
            ) : isError ? (
                <Text style={styles.errorText}>Failed to load doctors list.</Text>
            ) : (
                <TopDoctors
                    doctors={doctorsList}
                    onBookPress={(doctor) => handleOpenBooking(doctor)}
                />
            )}

            {/* Booking Slot Selection Modal */}
            <BookingModal
                visible={isModalVisible}
                doctor={selectedDoctor}
                onClose={() => setIsModalVisible(false)}
                onConfirmBooking={handleConfirmBooking}
                isBookingLoading={false}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#f8fafc',
        flexGrow: 1
    } as ViewStyle,
    centerContainer: {
        paddingVertical: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#ef4444',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    }
});