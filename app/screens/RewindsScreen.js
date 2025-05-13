import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RewindsScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rewinds</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={48} color="#FF3B7F" />
        </View>
        <Text style={styles.title}>No Rewinds Yet</Text>
        <Text style={styles.description}>
          Events you've attended will appear here so you can easily find them again.
        </Text>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF0F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default RewindsScreen; 