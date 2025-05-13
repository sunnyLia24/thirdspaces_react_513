import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../hooks/useStore';
import { signOut } from '../services/firebase';
import { useTheme } from '../components/ui/ThemeProvider';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, setUser, setIsAuthenticated } = useStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      setIsAuthenticated(false);
      router.replace('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    router.replace('/auth/sign-in');
    return null;
  }

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text 
            style={[
              styles.headerTitle, 
              { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
            ]}
          >
            Profile
          </Text>
          <TouchableOpacity onPress={() => router.push('/settings')}>
            <Ionicons 
              name="settings-outline" 
              size={24} 
              color={theme === 'dark' ? '#FFFFFF' : '#121212'} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.photoURL ? (
              <Image 
                source={{ uri: user.photoURL }} 
                style={styles.avatar} 
              />
            ) : (
              <View 
                style={[
                  styles.avatarPlaceholder, 
                  { backgroundColor: theme === 'dark' ? '#333333' : '#E0E0E0' }
                ]}
              >
                <Ionicons 
                  name="person" 
                  size={40} 
                  color={theme === 'dark' ? '#777777' : '#999999'} 
                />
              </View>
            )}
          </View>
          
          <Text 
            style={[
              styles.displayName, 
              { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
            ]}
          >
            {user.displayName}
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="mail-outline" 
              size={18} 
              color={theme === 'dark' ? '#B8B8B8' : '#757575'} 
              style={styles.infoIcon}
            />
            <Text 
              style={[
                styles.infoText, 
                { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
              ]}
            >
              {user.email}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="calendar-outline" 
              size={18} 
              color={theme === 'dark' ? '#B8B8B8' : '#757575'} 
              style={styles.infoIcon}
            />
            <Text 
              style={[
                styles.infoText, 
                { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
              ]}
            >
              {user.age} years old
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="person-outline" 
              size={18} 
              color={theme === 'dark' ? '#B8B8B8' : '#757575'} 
              style={styles.infoIcon}
            />
            <Text 
              style={[
                styles.infoText, 
                { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
              ]}
            >
              {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
            </Text>
          </View>
        </View>

        <View 
          style={[
            styles.section, 
            { backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF' }
          ]}
        >
          <Text 
            style={[
              styles.sectionTitle, 
              { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
            ]}
          >
            Interests
          </Text>
          
          <View style={styles.interestTags}>
            {user.interests.map((interest, index) => (
              <View 
                key={index} 
                style={[
                  styles.interestTag, 
                  { backgroundColor: theme === 'dark' ? '#333333' : '#F0F0F0' }
                ]}
              >
                <Text 
                  style={[
                    styles.interestTagText, 
                    { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                  ]}
                >
                  {interest}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View 
          style={[
            styles.section, 
            { backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF' }
          ]}
        >
          <Text 
            style={[
              styles.sectionTitle, 
              { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
            ]}
          >
            Looking For
          </Text>
          
          <View style={styles.preferences}>
            <View style={styles.preferenceItem}>
              <Text 
                style={[
                  styles.preferenceLabel, 
                  { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
                ]}
              >
                Age Range:
              </Text>
              <Text 
                style={[
                  styles.preferenceValue, 
                  { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                ]}
              >
                {user.preferences.ageRange[0]} - {user.preferences.ageRange[1]}
              </Text>
            </View>
            
            <View style={styles.preferenceItem}>
              <Text 
                style={[
                  styles.preferenceLabel, 
                  { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
                ]}
              >
                Gender Preference:
              </Text>
              <Text 
                style={[
                  styles.preferenceValue, 
                  { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                ]}
              >
                {user.preferences.genders.map(g => g.charAt(0).toUpperCase() + g.slice(1)).join(', ')}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.signOutButton, 
            { backgroundColor: theme === 'dark' ? '#333333' : '#F0F0F0' }
          ]}
          onPress={handleSignOut}
        >
          <Text 
            style={[
              styles.signOutButtonText, 
              { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
            ]}
          >
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  interestTagText: {
    fontSize: 14,
  },
  preferences: {},
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
  },
  preferenceLabel: {
    fontSize: 16,
  },
  preferenceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  signOutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 