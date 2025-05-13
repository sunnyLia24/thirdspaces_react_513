import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { EventMasonryGrid } from '../components/events/EventMasonryGrid';
import { AnimatedFAB } from '../components/ui/AnimatedFAB';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../hooks/useStore';
import { getEvents } from '../services/firebase';
import { useTheme } from '../components/ui/ThemeProvider';
import { EventPreview, Event } from '../types';

export default function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, events, setEvents } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const eventsData = await getEvents(20);
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
  }, []);

  const handleCreateEvent = () => {
    if (!user) {
      router.push('/auth/sign-in');
    } else {
      router.push('/events/create');
    }
  };

  const handleRefresh = async () => {
    await fetchEvents();
  };

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }
      ]}
    >
      <View style={styles.header}>
        <Text 
          style={[
            styles.headerTitle, 
            { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
          ]}
        >
          Discover Events
        </Text>
        {user && (
          <View style={styles.profileContainer}>
            {user.photoURL ? (
              <Ionicons 
                name="person-circle" 
                size={32} 
                color={theme === 'dark' ? '#FFFFFF' : '#121212'} 
                onPress={() => router.push('/profile')}
              />
            ) : (
              <Ionicons 
                name="person-circle-outline" 
                size={32} 
                color={theme === 'dark' ? '#FFFFFF' : '#121212'} 
                onPress={() => router.push('/profile')}
              />
            )}
          </View>
        )}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <EventMasonryGrid
          events={events as EventPreview[]}
          isLoading={isLoading}
          onRefresh={handleRefresh}
          onEndReached={() => {
            // Load more events when user reaches end of list
            // For MVP we'll just reload the same events
            // fetchMoreEvents();
          }}
        />
      )}

      <AnimatedFAB
        onPress={handleCreateEvent}
        label="Create"
        icon={<Ionicons name="add" size={24} color="#FFF" />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  profileContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
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