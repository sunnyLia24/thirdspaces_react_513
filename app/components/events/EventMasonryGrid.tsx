import React, { useCallback, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, RefreshControl } from 'react-native';
import MasonryList from 'react-native-masonry-list';
import { EventCard } from './EventCard';
import { EventPreview } from '../../types';
import { useTheme } from '../ui/ThemeProvider';

interface EventMasonryGridProps {
  events: EventPreview[];
  isLoading: boolean;
  onRefresh?: () => void;
  onEndReached?: () => void;
}

export const EventMasonryGrid = ({
  events,
  isLoading,
  onRefresh,
  onEndReached,
}: EventMasonryGridProps) => {
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!onRefresh) return;
    
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  }, [onRefresh]);

  // Helper to decide column width based on index
  const getItemWidth = (index: number) => {
    // Alternate between items taking more or less space
    return index % 3 === 0 ? 1 : 1;
  };

  // Helper to decide if an item spans two columns
  const getItemSpan = (index: number) => {
    // Every 5th item spans two columns
    return index % 5 === 0 ? 2 : 1;
  };

  const renderItem = useCallback(({ item, index }: { item: EventPreview; index: number }) => (
    <EventCard event={item} index={index} />
  ), []);

  return (
    <View style={styles.container}>
      {isLoading && events.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={theme === 'dark' ? '#FFFFFF' : '#FF3B7F'}
          />
        </View>
      ) : (
        <MasonryList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item: EventPreview) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF3B7F']}
              tintColor={theme === 'dark' ? '#FFFFFF' : '#FF3B7F'}
            />
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListFooterComponent={
            isLoading && events.length > 0 ? (
              <ActivityIndicator
                size="small"
                color={theme === 'dark' ? '#FFFFFF' : '#FF3B7F'}
                style={styles.footerLoader}
              />
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80, // For FAB space
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  footerLoader: {
    padding: 16,
  },
}); 