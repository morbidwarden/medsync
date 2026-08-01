import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    ViewStyle,
    TextStyle
} from 'react-native';
import * as SecureStore from "expo-secure-store";
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { logout } from '@/store/authSlice';
// import { logout } from '../../store/authSlice'; // Import your logout action if applicable

export default function ProfileScreen() {
    const dispatch = useDispatch();
    const { name, specialization, email } = useSelector((state: RootState) => state.auth);

    const handleLogout = async() => {
        await SecureStore.deleteItemAsync("token");
        dispatch(logout());
    };

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

            {/* Profile Header Card */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop' }}
                        style={styles.avatar}
                    />
                    <TouchableOpacity style={styles.cameraBadge} activeOpacity={0.8}>
                        <Ionicons name="camera" size={14} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.userName}>Dr. {name || 'James Wilson'}</Text>
                <Text style={styles.userSubtitle}>{specialization || 'Cardiologist Specialist'}</Text>
            </View>

            {/* Personal Information Section */}
            <Text style={styles.sectionHeader}>PERSONAL INFORMATION</Text>
            <View style={styles.cardContainer}>

                <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                        <Ionicons name="mail-outline" size={18} color="#6366f1" />
                    </View>
                    <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoLabel}>EMAIL ADDRESS</Text>
                        <Text style={styles.infoValue}>{email || 'dr.james@medsync.com'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                        <Ionicons name="call-outline" size={18} color="#6366f1" />
                    </View>
                    <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoLabel}>PHONE NUMBER</Text>
                        <Text style={styles.infoValue}>+1 (555) 000-1234</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <View style={styles.iconBox}>
                        <Ionicons name="location-outline" size={18} color="#6366f1" />
                    </View>
                    <View style={styles.infoTextWrapper}>
                        <Text style={styles.infoLabel}>HOSPITAL</Text>
                        <Text style={styles.infoValue}>St. Mary&apos;s General Hospital</Text>
                    </View>
                </View>

            </View>

            {/* Account Settings Section */}
            <Text style={styles.sectionHeader}>ACCOUNT SETTINGS</Text>
            <View style={styles.settingsGroup}>

                <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.iconBox, styles.settingsIconBox]}>
                            <Ionicons name="shield-outline" size={18} color="#6366f1" />
                        </View>
                        <Text style={styles.settingTitle}>Privacy &amp; Security</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                    <View style={styles.settingLeft}>
                        <View style={[styles.iconBox, styles.settingsIconBox]}>
                            <Ionicons name="notifications-outline" size={18} color="#6366f1" />
                        </View>
                        <Text style={styles.settingTitle}>Notifications</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.settingItem, styles.logoutItem]}
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <View style={styles.settingLeft}>
                        <View style={[styles.iconBox, styles.logoutIconBox]}>
                            <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                        </View>
                        <Text style={styles.logoutTitle}>Logout Session</Text>
                    </View>
                    <Ionicons name="log-out-outline" size={18} color="#ef4444" />
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
        backgroundColor: '#f8fafc',
        flexGrow: 1,
    } as ViewStyle,
    profileHeader: {
        alignItems: 'center',
        marginBottom: 28,
    } as ViewStyle,
    avatarContainer: {
        position: 'relative',
        marginBottom: 14,
    } as ViewStyle,
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        borderWidth: 3,
        borderColor: '#ffffff',
    },
    cameraBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#6366f1',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ffffff',
    } as ViewStyle,
    userName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: 4,
    } as TextStyle,
    userSubtitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#7c3aed',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    } as TextStyle,
    sectionHeader: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94a3b8',
        marginBottom: 10,
        marginLeft: 4,
        letterSpacing: 0.8,
    } as TextStyle,
    cardContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    } as ViewStyle,
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    } as ViewStyle,
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    } as ViewStyle,
    infoTextWrapper: {
        marginLeft: 14,
        flex: 1,
    } as ViewStyle,
    infoLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94a3b8',
        letterSpacing: 0.5,
    } as TextStyle,
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0f172a',
        marginTop: 2,
    } as TextStyle,
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 4,
    } as ViewStyle,
    settingsGroup: {
        gap: 12,
    } as ViewStyle,
    settingItem: {
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    } as ViewStyle,
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    } as ViewStyle,
    settingsIconBox: {
        backgroundColor: '#eef2ff',
    } as ViewStyle,
    settingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    } as TextStyle,
    logoutItem: {
        backgroundColor: '#fff1f2',
        borderColor: '#ffe4e6',
    } as ViewStyle,
    logoutIconBox: {
        backgroundColor: '#fee2e2',
    } as ViewStyle,
    logoutTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#ef4444',
    } as TextStyle,
});