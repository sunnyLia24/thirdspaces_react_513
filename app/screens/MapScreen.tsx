import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { EventMap } from '../components/map/EventMap';
import { useStore } from '../hooks/useStore';
import { getEvents } from '../services/firebase';
import { useTheme } from '../components/ui/ThemeProvider';
import { MapMarker, EventPreview, Event } from '../types';

export default function MapScreen() {
  const { theme } = useTheme();
  const { events, setEvents } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>({
    // Default location (e.g., San Francisco)
    latitude: 37.7749,
    longitude: -122.4194,
  });

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await getEvents(50);
      setEvents(eventsData as Event[]);
      setError(null);
    } catch (error) {
      setError('Failed to load events. Please try again.');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    // In a real app, you would use Expo Location to get the user's location
    // For this demo, we'll use a mock location
    const getUserLocation = async () => {
      try {
        // Mock getting location for the demo
        // In a real app, you would do:
        // const { status } = await Location.requestForegroundPermissionsAsync();
        // if (status !== 'granted') {
        //   return;
        // }
        // const location = await Location.getCurrentPositionAsync({});
        // setUserLocation({
        //   latitude: location.coords.latitude,
        //   longitude: location.coords.longitude,
        // });
        
        // For now, we'll just use the default
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };
    
    getUserLocation();
  }, []);

  // Transform events to map markers
  const mapMarkers: MapMarker[] = events.map((event, index) => ({
    id: `marker-${event.id}`,
    coordinates: [
      event.location.coordinates.longitude,
      event.location.coordinates.latitude,
    ],
    eventId: event.id,
    title: event.title,
  }));
  
  // Create a lookup for quick event retrieval by ID
  const eventsById: Record<string, EventPreview> = {};
  events.forEach((event) => {
    eventsById[event.id] = event;
  });

  if (error) {
    return (
      <SafeAreaView 
        style={[
          styles.container, 
          { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }
        ]}
      >
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <EventMap
        markers={mapMarkers}
        events={eventsById}
        userLocation={userLocation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF3B7F',
    fontSize: 16,
    textAlign: 'center',
  },
}); 