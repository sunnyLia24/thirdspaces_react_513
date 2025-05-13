import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../components/ui/ThemeProvider';
import { useStore } from '../hooks/useStore';
import * as Haptics from 'expo-haptics';
import { createEvent } from '../services/firebase';

export default function CreateEventScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, addEvent } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [imageURL, setImageURL] = useState('https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  
  const handleCreateEvent = async () => {
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    
    if (!title || !description || !date || !time || !location) {
      Alert.alert('Missing Fields', 'Please fill in all required fields');
      return;
    }
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsLoading(true);
      
      // In a real app, this would communicate with Firebase
      // For demo purposes, we'll just simulate creating an event
      
      const newEvent = {
        id: Math.random().toString(36).substring(2, 15),
        title,
        description,
        location: {
          address: location,
          coordinates: {
            latitude: 37.7749, // Default to SF for demo
            longitude: -122.4194
          }
        },
        date,
        time,
        imageURL,
        hostId: user.id,
        attendees: [{ id: user.id, photoURL: user.photoURL }],
        interestedUsers: [user.id],
        category: category || 'other',
        tags: tags.split(',').map(tag => tag.trim()),
        isPrivate: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, this would be the response from Firebase
      // const eventId = await createEvent(newEvent);
      
      // Add to local store
      addEvent(newEvent);
      
      Alert.alert(
        'Success',
        'Event created successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={theme === 'dark' ? '#FFFFFF' : '#121212'} 
            />
          </TouchableOpacity>
          <Text 
            style={[
              styles.headerTitle, 
              { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
            ]}
          >
            Create Event
          </Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formGroup}>
            <Text 
              style={[
                styles.label, 
                { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
              ]}
            >
              Event Title*
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                  color: theme === 'dark' ? '#FFFFFF' : '#121212',
                  borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0'
                }
              ]}
              placeholder="Enter event title"
              placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.formGroup}>
            <Text 
              style={[
                styles.label, 
                { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
              ]}
            >
              Description*
            </Text>
            <TextInput
              style={[
                styles.textArea,
                { 
                  backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                  color: theme === 'dark' ? '#FFFFFF' : '#121212',
                  borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0'
                }
              ]}
              placeholder="Enter event description"
              placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text 
                style={[
                  styles.label, 
                  { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                ]}
              >
                Date*
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                    color: theme === 'dark' ? '#FFFFFF' : '#121212',
                    borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0'
                  }
                ]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
                value={date}
                onChangeText={setDate}
              />
            </View>

            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text 
                style={[
                  styles.label, 
                  { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                ]}
              >
                Time*
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                    color: theme === 'dark' ? '#FFFFFF' : '#121212',
                    borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0'
                  }
                ]}
                placeholder="HH:MM AM/PM"
                placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
                value={time}
                onChangeText={setTime}
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text 
              style={[
                styles.label, 
                { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
              ]}
            >
              Location*
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                  color: theme === 'dark' ? '#FFFFFF' : '#121212',
                  borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0'
                }
              ]}
              placeholder="Enter event location"
              placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.formGroup}>
            <Text 
              style={[
                styles.label, 
                { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
              ]}
            >
              Category
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                  color: theme === 'dark' ? '#FFFFFF' : '#121212',
                  borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0'
                }
              ]}
              placeholder="e.g. music, tech, art, social"
              placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
              value={category}
              onChangeText={setCategory}
            />
          </View>

          <View style={styles.formGroup}>
            <Text 
              style={[
                styles.label, 
                { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
              ]}
            >
              Tags (comma separated)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                  color: theme === 'dark' ? '#FFFFFF' : '#121212',
                  borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0'
                }
              ]}
              placeholder="e.g. jazz, live music, drinks"
              placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
              value={tags}
              onChangeText={setTags}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              { opacity: isLoading ? 0.7 : 1 }
            ]}
            onPress={handleCreateEvent}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating...' : 'Create Event'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
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
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#FF3B7F',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 