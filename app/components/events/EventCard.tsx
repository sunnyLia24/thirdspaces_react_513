import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { EventPreview } from '../../types';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { toggleEventInterest } from '../../services/firebase';
import { useStore } from '../../hooks/useStore';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../ui/ThemeProvider';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface EventCardProps {
  event: EventPreview;
  index: number;
}

export const EventCard = ({ event, index }: EventCardProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { user, toggleEventInterest: storeToggleInterest } = useStore();
  const [isInterested, setIsInterested] = useState(
    user ? event.interestedUsers.includes(user.id) : false
  );
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateY = useSharedValue(50);
  
  // Animation for card appearance
  React.useEffect(() => {
    translateY.value = withTiming(0, { duration: 300 + index * 50 });
    opacity.value = withTiming(1, { duration: 300 + index * 50 });
  }, []);
  
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { translateY: translateY.value }
      ],
      opacity: opacity.value
    };
  });
  
  const handlePress = () => {
    // Tactile feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animation when pressed
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    
    // Navigate to event detail
    router.push(`/events/${event.id}`);
  };
  
  const handleInterestPress = async () => {
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    
    // Tactile feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Toggle locally for immediate feedback
    setIsInterested(!isInterested);
    
    // Update in Zustand store
    storeToggleInterest(event.id);
    
    // Update in Firebase
    try {
      await toggleEventInterest(event.id, user.id, !isInterested);
    } catch (error) {
      // Revert on error
      setIsInterested(isInterested);
      storeToggleInterest(event.id);
      console.error('Error toggling interest:', error);
    }
  };
  
  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  
  // Calculate how many attendees to show vs. +X more
  const visibleAttendees = event.attendees.slice(0, 3);
  const remainingAttendees = event.attendees.length - visibleAttendees.length;
  
  return (
    <AnimatedTouchable
      style={[
        cardAnimatedStyle,
        styles.card,
        { backgroundColor: theme === 'dark' ? '#1F1F1F' : '#FFFFFF' }
      ]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: event.imageURL }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text 
          style={[
            styles.title,
            { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
          ]}
          numberOfLines={2}
        >
          {event.title}
        </Text>
        
        <View style={styles.dateLocationRow}>
          <Text 
            style={[
              styles.date,
              { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
            ]}
          >
            {formattedDate} • {event.time}
          </Text>
          <Text 
            style={[
              styles.location,
              { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
            ]}
            numberOfLines={1}
          >
            {event.location.address}
          </Text>
        </View>
        
        <View style={styles.footer}>
          <View style={styles.attendeesContainer}>
            {visibleAttendees.map((attendee, idx) => (
              <View 
                key={attendee.id} 
                style={[
                  styles.attendeeAvatar,
                  { marginLeft: idx === 0 ? 0 : -8 },
                  { zIndex: visibleAttendees.length - idx }
                ]}
              >
                <Image
                  source={{ uri: attendee.photoURL || 'https://via.placeholder.com/40' }}
                  style={styles.avatarImage}
                />
              </View>
            ))}
            
            {remainingAttendees > 0 && (
              <View style={[styles.attendeeAvatar, styles.attendeeCount, { marginLeft: -8 }]}>
                <Text style={styles.attendeeCountText}>+{remainingAttendees}</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity
            style={[
              styles.interestedButton,
              isInterested && styles.interestedButtonActive
            ]}
            onPress={handleInterestPress}
          >
            <Text 
              style={[
                styles.interestedButtonText,
                isInterested && styles.interestedButtonTextActive
              ]}
            >
              {isInterested ? 'Interested' : 'Interest'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  dateLocationRow: {
    marginBottom: 12,
  },
  date: {
    fontSize: 14,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
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
  attendeeCount: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  attendeeCountText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
  interestedButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
  },
  interestedButtonActive: {
    backgroundColor: '#FFE0EB',
  },
  interestedButtonText: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
  },
  interestedButtonTextActive: {
    color: '#FF3B7F',
  },
}); 