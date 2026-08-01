import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import DoctorHome from '../screens/DoctorHome';
import PatientHome from '../screens/PatientHome';

export default function HomeScreen() {
  const role = useSelector((state: RootState) => state.auth.role);

  return (
    <View style={styles.container}>
      {role === 'doctor' ? <DoctorHome /> : <PatientHome />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
});