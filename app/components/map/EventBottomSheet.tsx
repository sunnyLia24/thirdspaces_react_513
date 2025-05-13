import React, { forwardRef, useMemo } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { EventPreview } from '../../types';
import { useTheme } from '../ui/ThemeProvider';
import * as Haptics from 'expo-haptics';

interface EventBottomSheetProps {
  event: EventPreview | null;
  onEventPress: (event: EventPreview) => void;
}

export const EventBottomSheet = forwardRef<BottomSheetModal, EventBottomSheetProps>(
  ({ event, onEventPress }, ref) => {
    const { theme } = useTheme();
    
    // Snap points for the bottom sheet
    const snapPoints = useMemo(() => ['25%', '50%'], []);
    
    if (!event) return null;
    
    // Format date
    const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    
    const handleEventPress = () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onEventPress(event);
    };
    
    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
          />
        )}
        backgroundStyle={{
          backgroundColor: theme === 'dark' ? '#1F1F1F' : '#FFFFFF',
        }}
        handleIndicatorStyle={{
          backgroundColor: theme === 'dark' ? '#777777' : '#999999',
        }}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.previewCard} onPress={handleEventPress}>
            <Image
              source={{ uri: event.imageURL }}
              style={styles.image}
              resizeMode="cover"
            />
            <View style={styles.infoContainer}>
              <Text
                style={[
                  styles.title,
                  { color: theme === 'dark' ? '#FFFFFF' : '#121212' },
                ]}
                numberOfLines={2}
              >
                {event.title}
              </Text>
              
              <View style={styles.detailsRow}>
                <Text
                  style={[
                    styles.detailText,
                    { color: theme === 'dark' ? '#B8B8B8' : '#757575' },
                  ]}
                >
                  {formattedDate} • {event.time}
                </Text>
              </View>
              
              <Text
                style={[
                  styles.location,
                  { color: theme === 'dark' ? '#B8B8B8' : '#757575' },
                ]}
                numberOfLines={2}
              >
                {event.location.address}
              </Text>
              
              <View style={styles.attendeesRow}>
                <Text
                  style={[
                    styles.attendeesText,
                    { color: theme === 'dark' ? '#FFFFFF' : '#121212' },
                  ]}
                >
                  {event.attendees.length} attending
                </Text>
                
                <TouchableOpacity
                  style={[
                    styles.viewButton,
                    { backgroundColor: theme === 'dark' ? '#333333' : '#F0F0F0' },
                  ]}
                  onPress={handleEventPress}
                >
                  <Text
                    style={[
                      styles.viewButtonText,
                      { color: theme === 'dark' ? '#FFFFFF' : '#121212' },
                    ]}
                  >
                    View Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  previewCard: {
    flexDirection: 'column',
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  infoContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
  },
  location: {
    fontSize: 14,
    marginBottom: 16,
  },
  attendeesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attendeesText: {
    fontSize: 14,
    fontWeight: '500',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 