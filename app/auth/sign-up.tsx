import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../components/ui/ThemeProvider';

export default function SignUp() {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }
      ]}
    >
      <View style={styles.content}>
        <Text 
          style={[
            styles.title, 
            { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
          ]}
        >
          Sign Up Screen
        </Text>
        <Text 
          style={[
            styles.subtitle, 
            { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
          ]}
        >
          This is a placeholder for the Sign Up screen.
        </Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF3B7F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
