import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { mockEvents } from '../utils/mockData';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const [events, setEvents] = useState(mockEvents);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ThirdSpaces Events</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {events.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <Image 
              source={{ uri: event.imageURL }} 
              style={styles.eventImage}
              resizeMode="cover" 
            />
            <View style={styles.eventContent}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventDate}>{event.date} • {event.time}</Text>
              <Text style={styles.eventLocation} numberOfLines={1}>{event.location.address}</Text>
              
              <View style={styles.tagsContainer}>
                {event.tags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <View style={styles.attendeesContainer}>
                  {event.attendees.slice(0, 3).map((attendee, index) => (
                    <View 
                      key={attendee.id} 
                      style={[styles.attendeeAvatar, { marginLeft: index === 0 ? 0 : -8 }]}
                    >
                      {attendee.photoURL ? (
                        <Image source={{ uri: attendee.photoURL }} style={styles.avatarImage} />
                      ) : (
                        <View style={styles.avatarFallback}>
                          <Text style={styles.avatarText}>{attendee.id.charAt(0).toUpperCase()}</Text>
                        </View>
                      )}
                    </View>
                  ))}
                  {event.attendees.length > 3 && (
                    <View style={[styles.attendeeAvatar, styles.attendeeCount, { marginLeft: -8 }]}>
                      <Text style={styles.attendeeCountText}>+{event.attendees.length - 3}</Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity style={styles.interestedButton}>
                  <Ionicons name="heart-outline" size={14} color="#757575" style={{ marginRight: 4 }} />
                  <Text style={styles.interestedButtonText}>Interest</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121212',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 180,
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#121212',
  },
  eventDate: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagPill: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#757575',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  attendeeCount: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendeeCountText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  interestedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestedButtonText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
});

export default HomeScreen; 