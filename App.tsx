import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { useStore } from './app/hooks/useStore';
import { Ionicons } from '@expo/vector-icons';
import { auth } from './app/services/firebase';

// Import screens
import HomeScreen from './app/screens/HomeScreen';
import RewindsScreen from './app/screens/RewindsScreen';
import MapScreen from './app/screens/MapScreen';
import MessagesScreen from './app/screens/MessagesScreen';
import ProfileScreen from './app/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const { setUser, setIsAuthenticated, setLoading } = useStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for auth state changes using our mock service
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user) {
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

      setLoading(false);
      setInitializing(false);
    });

    // Set a timeout to simulate loading
    setTimeout(() => {
      setInitializing(false);
    }, 1500);

    // Cleanup subscription
    return unsubscribe;
  }, []);

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B7F" />
        <Text style={styles.loadingText}>Loading ThirdSpaces...</Text>
      </View>
    );
  }

  // Try-catch block to handle potential errors with navigation or other components
  try {
    return (
      <>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Rewinds') {
                  iconName = focused ? 'time' : 'time-outline';
                } else if (route.name === 'Map') {
                  iconName = focused ? 'map' : 'map-outline';
                } else if (route.name === 'Messages') {
                  iconName = focused ? 'chatbubble' : 'chatbubble-outline';
                } else if (route.name === 'Profile') {
                  iconName = focused ? 'person' : 'person-outline';
                }

                return <Ionicons name={iconName as any} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#FF3B7F',
              tabBarInactiveTintColor: '#757575',
              headerShown: false,
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Rewinds" component={RewindsScreen} />
            <Tab.Screen name="Map" component={MapScreen} />
            <Tab.Screen name="Messages" component={MessagesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </>
    );
  } catch (error) {
    console.error('Error rendering main app:', error);
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="alert-circle" size={48} color="#FF3B7F" />
        <Text style={[styles.loadingText, { marginTop: 16 }]}>
          Something went wrong. Please restart the app.
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F7',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#121212',
  },
});
