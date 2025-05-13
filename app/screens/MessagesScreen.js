import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const mockMessages = [
  {
    id: '1',
    name: 'Sarah Johnson',
    lastMessage: 'Are you going to the jazz night tomorrow?',
    time: '10:30 AM',
    unread: true,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    id: '2',
    name: 'Michael Chen',
    lastMessage: 'The photography walk was amazing!',
    time: 'Yesterday',
    unread: false,
    avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
  {
    id: '3',
    name: 'Emma Williams',
    lastMessage: 'Let\'s catch up at the next event',
    time: 'Wed',
    unread: true,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

const MessagesScreen = () => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.messageItem}>
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.unread && <View style={styles.unreadIndicator} />}
      </View>
      
      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        <Text style={[styles.message, item.unread && styles.unreadMessage]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="create-outline" size={24} color="#FF3B7F" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={mockMessages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#121212',
  },
  newMessageButton: {
    position: 'absolute',
    right: 16,
  },
  messagesList: {
    padding: 16,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  unreadIndicator: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FF3B7F',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#121212',
  },
  time: {
    fontSize: 14,
    color: '#757575',
  },
  message: {
    fontSize: 14,
    color: '#757575',
  },
  unreadMessage: {
    fontWeight: '600',
    color: '#121212',
  },
});

export default MessagesScreen; 