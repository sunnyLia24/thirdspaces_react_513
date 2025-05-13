import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../hooks/useStore';

const ProfileScreen = () => {
  const { user } = useStore();
  
  // Mock user for now
  const mockUser = {
    id: 'user123',
    displayName: 'Alex Morgan',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    gender: 'male',
    age: 28,
    location: 'San Francisco, CA',
    bio: 'Adventure enthusiast and photography lover. Always up for trying new restaurants and exploring hidden gems in the city.',
    interests: ['Photography', 'Hiking', 'Food', 'Music', 'Travel', 'Art', 'Reading'],
    eventsAttended: 12,
    eventsHosted: 3,
    connections: 47,
  };
  
  const profileUser = user || mockUser;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <Image 
            source={{ uri: profileUser.photoURL }} 
            style={styles.profileImage} 
          />
          <Text style={styles.name}>{profileUser.displayName}</Text>
          <Text style={styles.location}>{profileUser.location}</Text>
          
          <TouchableOpacity style={styles.editProfileButton}>
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.eventsAttended}</Text>
            <Text style={styles.statLabel}>Events</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.eventsHosted}</Text>
            <Text style={styles.statLabel}>Hosted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{profileUser.connections}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bioText}>{profileUser.bio}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interests</Text>
          <View style={styles.interestsContainer}>
            {profileUser.interests.map((interest, index) => (
              <View key={index} style={styles.interestPill}>
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.emptyEventContainer}>
            <Ionicons name="calendar-outline" size={32} color="#CCCCCC" />
            <Text style={styles.emptyEventText}>No upcoming events</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121212',
    textAlign: 'center',
  },
  settingsButton: {
    position: 'absolute',
    right: 16,
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF3B7F',
  },
  editProfileText: {
    fontSize: 14,
    color: '#FF3B7F',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121212',
    marginBottom: 12,
  },
  seeAllText: {
    fontSize: 14,
    color: '#FF3B7F',
  },
  bioText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestPill: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  interestText: {
    fontSize: 14,
    color: '#333333',
  },
  emptyEventContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyEventText: {
    fontSize: 16,
    color: '#757575',
    marginTop: 8,
  },
});

export default ProfileScreen; 