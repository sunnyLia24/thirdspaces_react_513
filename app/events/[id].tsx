import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ui/ThemeProvider';
import { useStore } from '../hooks/useStore';
import { Event } from '../types';
import { mockEvents } from '../utils/mockData';
import * as Haptics from 'expo-haptics';

export default function EventDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { user, toggleEventInterest } = useStore();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from Firebase
    // For demo purposes, we'll use mock data
    const foundEvent = mockEvents.find(e => e.id === id);
    setEvent(foundEvent || null);
    setLoading(false);
  }, [id]);

  const handleToggleInterest = () => {
    if (!event || !user) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleEventInterest(event.id);
  };

  const isInterested = event && user ? event.interestedUsers.includes(user.id) : false;
  
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }]}>
        <ActivityIndicator size="large" color="#FF3B7F" />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }]}>
        <Text style={[styles.errorText, { color: theme === 'dark' ? '#FFFFFF' : '#121212' }]}>
          Event not found
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={theme === 'dark' ? '#FFFFFF' : '#121212'} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={() => Haptics.selectionAsync()}
        >
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={theme === 'dark' ? '#FFFFFF' : '#121212'} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: event.imageURL }} 
          style={styles.eventImage} 
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme === 'dark' ? '#FFFFFF' : '#121212' }]}>
            {event.title}
          </Text>

          <View style={styles.infoRow}>
            <Ionicons 
              name="calendar-outline" 
              size={18} 
              color={theme === 'dark' ? '#B8B8B8' : '#757575'} 
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme === 'dark' ? '#B8B8B8' : '#757575' }]}>
              {event.date} at {event.time}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="location-outline" 
              size={18} 
              color={theme === 'dark' ? '#B8B8B8' : '#757575'} 
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme === 'dark' ? '#B8B8B8' : '#757575' }]}>
              {event.location.address}
            </Text>
          </View>

          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tagPill,
                  { backgroundColor: theme === 'dark' ? '#333333' : '#F0F0F0' }
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#121212' }]}>
            About
          </Text>
          <Text style={[styles.description, { color: theme === 'dark' ? '#B8B8B8' : '#757575' }]}>
            {event.description}
          </Text>

          <Text style={[styles.sectionTitle, { color: theme === 'dark' ? '#FFFFFF' : '#121212' }]}>
            Attendees ({event.attendees.length})
          </Text>
          <View style={styles.attendeesContainer}>
            {event.attendees.map((attendee, index) => (
              <View key={index} style={styles.attendeeAvatar}>
                {attendee.photoURL ? (
                  <Image 
                    source={{ uri: attendee.photoURL }} 
                    style={styles.avatarImage} 
                  />
                ) : (
                  <View 
                    style={[
                      styles.avatarFallback,
                      { backgroundColor: theme === 'dark' ? '#333333' : '#E0E0E0' }
                    ]}
                  >
                    <Text style={{ color: theme === 'dark' ? '#FFFFFF' : '#121212' }}>
                      {attendee.id.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.interestedButton,
            isInterested ? styles.interestedActive : {}
          ]}
          onPress={handleToggleInterest}
        >
          <Ionicons 
            name={isInterested ? "heart" : "heart-outline"} 
            size={20} 
            color="#FFFFFF" 
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>
            {isInterested ? 'Interested' : 'I\'m Interested'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#FF3B7F',
    fontSize: 16,
    fontWeight: '600',
  },
  shareButton: {
    padding: 8,
    borderRadius: 20,
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16,
    marginBottom: 24,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  attendeesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  attendeeAvatar: {
    marginRight: -8,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatarFallback: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  interestedButton: {
    backgroundColor: '#FF3B7F',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  interestedActive: {
    backgroundColor: '#D71A60',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
}); 