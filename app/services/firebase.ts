// Using mock implementations instead of Firebase to avoid dependency issues in demo
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockEvents } from '../utils/mockData';
import { User, Event } from '../types';

// Mock auth state
let currentUser: any = null;
let authStateListeners: Function[] = [];

// Simulated auth
export const auth = {
  currentUser,
  onAuthStateChanged: (callback: Function) => {
    authStateListeners.push(callback);
    callback(currentUser);
    return () => {
      authStateListeners = authStateListeners.filter(listener => listener !== callback);
    };
  }
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    // Simulate user creation
    const newUser = {
      uid: Math.random().toString(36).substring(2, 15),
      email,
      displayName: email.split('@')[0],
    };
    currentUser = newUser;
    
    // Notify listeners
    authStateListeners.forEach(listener => listener(currentUser));
    
    return newUser;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    // Simulate sign in
    const user = {
      uid: 'user123',
      email,
      displayName: email.split('@')[0],
    };
    currentUser = user;
    
    // Notify listeners
    authStateListeners.forEach(listener => listener(currentUser));
    
    return user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    currentUser = null;
    
    // Notify listeners
    authStateListeners.forEach(listener => listener(currentUser));
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const updateUserProfile = async (user: any, profileData: { displayName?: string; photoURL?: string }) => {
  try {
    if (currentUser) {
      currentUser = { ...currentUser, ...profileData };
      
      // Notify listeners
      authStateListeners.forEach(listener => listener(currentUser));
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Mock db
export const db = {};

// Local storage for events
let events = [...mockEvents];

// Create user document mock
export const createUserDocument = async (userId: string, userData: any) => {
  console.log('Mock createUserDocument', userId, userData);
  return userId;
};

// Get user document mock
export const getUserDocument = async (userId: string) => {
  console.log('Mock getUserDocument', userId);
  if (userId === 'user123') {
    return {
      id: userId,
      email: 'user@example.com',
      displayName: 'Demo User',
      interests: ['music', 'food', 'travel'],
    };
  }
  return null;
};

// Event functions
export const createEvent = async (eventData: any) => {
  try {
    const newEvent = {
      ...eventData,
      id: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(newEvent);
    return newEvent.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEvents = async (limitCount = 20) => {
  try {
    return events.slice(0, limitCount);
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

export const toggleEventInterest = async (eventId: string, userId: string, isInterested: boolean) => {
  try {
    const eventIndex = events.findIndex(e => e.id === eventId);
    
    if (eventIndex !== -1) {
      const event = events[eventIndex];
      
      if (isInterested) {
        if (!event.interestedUsers.includes(userId)) {
          event.interestedUsers.push(userId);
        }
      } else {
        event.interestedUsers = event.interestedUsers.filter(id => id !== userId);
      }
      
      event.updatedAt = new Date().toISOString();
      events[eventIndex] = event;
    }
  } catch (error) {
    console.error('Error toggling event interest:', error);
    throw error;
  }
};

// Mock storage
export const storage = {};

// Storage functions
export const uploadImage = async (uri: string, path: string): Promise<string> => {
  // Just return the URI as if it was uploaded
  return uri;
};

export default {
  auth,
  signUp,
  signIn,
  signOut,
  updateUserProfile,
  db,
  createUserDocument,
  getUserDocument,
  createEvent,
  getEvents,
  toggleEventInterest,
  storage,
  uploadImage
}; 