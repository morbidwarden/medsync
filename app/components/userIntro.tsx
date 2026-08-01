import React from 'react';
import { StyleSheet, Text, View, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserIntroProps {
  name: string;
  subtitle: string;
  avatarUrl?: string;
  onNotificationPress?: () => void;
}

export default function UserIntro({ 
  name, 
  subtitle, 
  avatarUrl, 
  onNotificationPress 
}: UserIntroProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Image 
          source={{ uri: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }} 
          style={styles.avatar} 
        />
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.name}>{name}</Text>
        </View>
      </View>

      <View style={styles.notificationBtn}>
        <Ionicons name="notifications-outline" size={20} color="#334155" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', // Fixed from 'between' to 'space-between'
    backgroundColor: '#ffffff', 
    borderRadius: 24, 
    padding: 16, 
    marginBottom: 24,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  } as ViewStyle,
  leftSection: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    flex: 1 
  } as ViewStyle,
  avatar: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    borderWidth: 2, 
    borderColor: '#f1f5f9' 
  } as ImageStyle,
  greeting: { 
    fontSize: 13, 
    color: '#64748b', 
    fontStyle: 'italic', 
    fontWeight: '400' 
  } as TextStyle,
  name: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#0f172a', 
    marginTop: 1 
  } as TextStyle,
  notificationBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#f8fafc', 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1f5f9'
  } as ViewStyle
});