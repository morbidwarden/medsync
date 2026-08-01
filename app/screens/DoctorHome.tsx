import React from 'react';
import { StyleSheet, ScrollView, ViewStyle } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import UserIntro from '../components/userIntro';
import ManageAvailability from '../components/manageingAvailiability';
import BookedAppointments from '../components/BookedAppointments';

export default function DoctorHome() {
  const { name, specialization } = useSelector((state: RootState) => state.auth);

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <UserIntro 
        name={`Dr. ${name || 'James Wilson'}`} 
        subtitle={specialization || 'General Physician'}
      />
      <ManageAvailability />
      <BookedAppointments/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { 
    padding: 20, 
    paddingTop: 50, 
    backgroundColor: '#f8fafc', 
    flexGrow: 1 
  } as ViewStyle
});