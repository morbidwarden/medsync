import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLoginUserMutation } from '@/store/apiSlice';
import { useDispatch } from 'react-redux';
import { setUserCredentials } from '../store/authSlice';

export default function LoginScreen() {
    const [role, setRole] = useState<'Patient' | 'Doctor'>('Patient');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Added state for password visibility
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [loginUser, { isLoading }] = useLoginUserMutation();
    const dispatch = useDispatch();

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password');
            return;
        }

        try {
            const response = await loginUser({
                email,
                password,
                role: role.toLowerCase()
            }).unwrap();

            const { token, user } = response;

            if (token && user) {
                await SecureStore.setItemAsync('userToken', token);

                dispatch(setUserCredentials({
                    role: user.role.toLowerCase() as 'patient' | 'doctor',
                    name: user.name,
                    email: user.email,
                    specialization: user.specialization
                }));
            }
            router.replace('/(tabs)/home');
        } catch (err: any) {
            console.error('Login failed:', err);
            Alert.alert('Sign In Failed', err?.data?.message || 'Invalid credentials or network error.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                {/* Header Logo & Title */}
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../assets/images/medSyncLogo.jpg')} // Adjust the relative path to point to your image asset
                        style={styles.logoImage}
                    />
                    <Text style={styles.title}>MedSync</Text>
                    <Text style={styles.subtitle}>Healthcare at your fingertips</Text>
                </View>

                {/* Card Container */}
                <View style={styles.card}>
                    {/* Role Switcher */}
                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'Patient' && styles.activeRoleButton]}
                            onPress={() => setRole('Patient')}
                        >
                            <Text style={[styles.roleText, role === 'Patient' && styles.activeRoleText]}>Patient</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.roleButton, role === 'Doctor' && styles.activeRoleButton]}
                            onPress={() => setRole('Doctor')}
                        >
                            <Text style={[styles.roleText, role === 'Doctor' && styles.activeRoleText]}>Doctor</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="name@example.com"
                                placeholderTextColor="#94a3b8"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#94a3b8"
                                secureTextEntry={!showPassword} // Toggles based on state
                                value={password}
                                onChangeText={setPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons
                                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                                    size={20}
                                    color="#94a3b8"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.forgotContainer}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Keep me logged in checkbox */}
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        activeOpacity={0.8}
                        onPress={() => setKeepLoggedIn(!keepLoggedIn)}
                    >
                        <View style={[styles.checkbox, keepLoggedIn && styles.checkboxChecked]}>
                            {keepLoggedIn && <Ionicons name="checkmark" size={12} color="#fff" />}
                        </View>
                        <Text style={styles.checkboxLabel}>Keep me logged in</Text>
                    </TouchableOpacity>

                    {/* Sign In Button */}
                    <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={isLoading}>
                        <Text style={styles.signInButtonText}>{isLoading ? 'Signing In...' : 'Sign In'}</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Logins */}
                    <View style={styles.socialContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome name="google" size={18} color="#0f172a" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome name="apple" size={18} color="#0f172a" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>Don&apos;t have an account? </Text>
                    <TouchableOpacity>
                        <Text style={styles.footerLink}>Create Account</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#f8fafc' },
    logoImage: {
        width: 64,
        height: 64,
        borderRadius: 16,
        resizeMode: 'contain',
        marginBottom: 12
    },
    container: { flex: 1, justifyContent: 'center', paddingHorizontal: 20, paddingVertical: 20 },
    headerContainer: { alignItems: 'center', marginBottom: 24 },
    logoBox: { width: 56, height: 56, backgroundColor: '#7c3aed', borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6, marginBottom: 12 },
    title: { fontSize: 26, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
    subtitle: { fontSize: 14, color: '#64748b' },
    card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, shadowColor: '#64748b', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 4 },
    roleContainer: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderRadius: 12, padding: 4, marginBottom: 20 },
    roleButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
    activeRoleButton: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
    roleText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    activeRoleText: { color: '#7c3aed' },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, paddingHorizontal: 12, backgroundColor: '#f8fafc', height: 48 },
    inputIcon: { marginRight: 10 },
    input: { flex: 1, fontSize: 14, color: '#0f172a' },
    forgotContainer: { alignItems: 'flex-end', marginTop: 6 },
    forgotText: { fontSize: 12, color: '#7c3aed', fontWeight: '600' },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 4, marginRight: 8, justifyContent: 'center', alignItems: 'center' },
    checkboxChecked: { backgroundColor: '#7c3aed', borderColor: '#7c3aed' },
    checkboxLabel: { fontSize: 13, color: '#475569' },
    signInButton: { backgroundColor: '#7c3aed', borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center', shadowColor: '#7c3aed', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 3 },
    signInButtonText: { color: '#ffffff', fontSize: 15, fontWeight: '600' },
    dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: '#f1f5f9' },
    dividerText: { fontSize: 10, fontWeight: '700', color: '#94a3b8', marginHorizontal: 10 },
    socialContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
    socialButton: { width: 60, height: 44, borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff' },
    footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
    footerText: { fontSize: 13, color: '#64748b' },
    footerLink: { fontSize: 13, color: '#7c3aed', fontWeight: '600' }
});