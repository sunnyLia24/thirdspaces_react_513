import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapboxGL from '@rnmapbox/maps';
import { mockEvents } from '../utils/mockData';

// Initialize Mapbox with the access token
MapboxGL.setAccessToken('pk.eyJ1Ijoic3VubnkyNCIsImEiOiJjbTdtbDBzb2gwb2plMnBvY2lxbml0Z3pyIn0.OrQMpXUEaR_vN3MubP6JSw');

const MapScreen = () => {
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [userLocation, setUserLocation] = useState([-122.4194, 37.7749]); // Default to San Francisco
  
  // Events data from mock data
  const events = mockEvents;

  // Set up permissions for user location
  useEffect(() => {
    const requestPermissions = async () => {
      const isGranted = await MapboxGL.requestAndroidLocationPermissions();
      console.log('Location permissions granted:', isGranted);
      setLoading(false);
    };
    
    // Location permissions are handled differently on iOS
    if (Platform.OS === 'android') {
      requestPermissions();
    } else {
      setLoading(false);
    }
  }, []);

  const handleMapLoaded = () => {
    setMapLoaded(true);
  };

  const handleMarkerPress = (event) => {
    setSelectedEvent(event);
  };

  const renderEventMarkers = () => {
    return events.map((event) => (
      <MapboxGL.PointAnnotation
        key={event.id}
        id={`event-${event.id}`}
        coordinate={[event.location.coordinates.longitude, event.location.coordinates.latitude]}
        onSelected={() => handleMarkerPress(event)}
      >
        <View style={styles.markerContainer}>
          <View style={styles.marker}>
            <Ionicons name="calendar" size={16} color="#FFFFFF" />
          </View>
        </View>
      </MapboxGL.PointAnnotation>
    ));
  };

  const renderEventInfo = () => {
    if (!selectedEvent) return null;

    return (
      <View style={styles.eventInfoContainer}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventTitle}>{selectedEvent.title}</Text>
          <Text style={styles.eventDateTime}>{selectedEvent.date} • {selectedEvent.time}</Text>
          <Text style={styles.eventLocation}>{selectedEvent.location.address}</Text>
          
          <View style={styles.tagsContainer}>
            {selectedEvent.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setSelectedEvent(null)}
        >
          <Ionicons name="close-circle" size={24} color="#757575" />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B7F" />
        <Text style={styles.loadingText}>Loading Map...</Text>
      </View>
    );
  }

  // If we catch an error loading the Mapbox component, show a fallback UI
  try {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Event Map</Text>
        </View>
        
        <View style={styles.mapContainer}>
          <MapboxGL.MapView
            style={styles.map}
            styleURL={MapboxGL.StyleURL.Street}
            onDidFinishLoadingMap={handleMapLoaded}
          >
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={userLocation}
              animationDuration={2000}
            />
            
            {/* User location dot */}
            <MapboxGL.UserLocation
              visible={true}
              onUpdate={(location) => {
                if (location && location.coords) {
                  setUserLocation([location.coords.longitude, location.coords.latitude]);
                }
              }}
            />
            
            {/* Event markers */}
            {renderEventMarkers()}
          </MapboxGL.MapView>
          
          {renderEventInfo()}
        </View>
      </View>
    );
  } catch (error) {
    console.log('Error rendering Mapbox component:', error);
    // Fallback UI if Mapbox fails to load
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Event Map</Text>
        </View>
        
        <View style={styles.fallbackContainer}>
          <View style={styles.mapPlaceholder}>
            <Ionicons name="map-outline" size={48} color="#CCCCCC" />
          </View>
          <Text style={styles.fallbackTitle}>Map Loading Error</Text>
          <Text style={styles.fallbackDescription}>
            We couldn't load the map. Please check your connection and try again.
          </Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
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
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF3B7F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  eventInfoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    padding: 16,
  },
  eventInfo: {
    paddingRight: 24,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#121212',
    marginBottom: 8,
  },
  eventDateTime: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tagPill: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#757575',
  },
  viewDetailsButton: {
    backgroundColor: '#FF3B7F',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  mapPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#F0F0F0',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 12,
    textAlign: 'center',
  },
  fallbackDescription: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#FF3B7F',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MapScreen; 