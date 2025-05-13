import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './components/ui/ThemeProvider';
import { useStore } from './hooks/useStore';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

function Layout() {
  const { theme } = useTheme();
  const { user, isAuthenticated, setUser, setIsAuthenticated, setLoading, loading } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      
      if (user) {
        // For this demo, we'll just create a simple user object
        // In a real app, you would fetch the user's profile from Firestore
        setUser({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'New User',
          photoURL: user.photoURL || undefined,
          gender: 'male',
          age: 25,
          preferences: {
            ageRange: [18, 35],
            genders: ['female'],
          },
          interests: ['music', 'food', 'travel'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }]}>
        <ActivityIndicator size="large" color="#FF3B7F" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF3B7F',
        tabBarInactiveTintColor: theme === 'dark' ? '#777777' : '#999999',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
          borderTopColor: theme === 'dark' ? '#333333' : '#E0E0E0',
        },
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        },
        headerTintColor: theme === 'dark' ? '#FFFFFF' : '#121212',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}

// Wrap the layout with our ThemeProvider
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
