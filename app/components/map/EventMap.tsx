import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, Platform } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useRouter } from 'expo-router';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { MapMarker, EventPreview } from '../../types';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../ui/ThemeProvider';
import { EventBottomSheet } from './EventBottomSheet';

// Set your Mapbox token here
MapboxGL.setAccessToken('YOUR_MAPBOX_ACCESS_TOKEN');

interface EventMapProps {
  markers: MapMarker[];
  events: Record<string, EventPreview>;
  userLocation?: { latitude: number; longitude: number };
}

interface Feature {
  properties: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const EventMap = ({ markers, events, userLocation }: EventMapProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const mapRef = useRef<MapboxGL.MapView>(null);
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventPreview | null>(null);
  
  // Bottom sheet ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  
  // Animation values for pulse effect
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.7);
  
  useEffect(() => {
    // Set up pulse animation
    pulseScale.value = withRepeat(
      withTiming(1.5, { duration: 2000, easing: Easing.ease }),
      -1, // Infinite repeats
      true // Reverse
    );
    
    pulseOpacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.ease }),
      -1, // Infinite repeats
      true // Reverse
    );
  }, []);
  
  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));
  
  // Handle marker press
  const handleMarkerPress = (markerId: string) => {
    const eventId = markers.find(marker => marker.id === markerId)?.eventId;
    
    if (eventId && events[eventId]) {
      setSelectedEvent(events[eventId]);
      bottomSheetModalRef.current?.present();
    }
  };
  
  // Fly to user location
  const flyToUserLocation = () => {
    if (userLocation && cameraRef.current) {
      cameraRef.current.flyTo([userLocation.longitude, userLocation.latitude], 500);
    }
  };
  
  // Initial map setup
  useEffect(() => {
    // Center map on user location initially if available
    if (userLocation && cameraRef.current) {
      setTimeout(() => {
        cameraRef.current?.setCamera({
          centerCoordinate: [userLocation.longitude, userLocation.latitude],
          zoomLevel: 12,
          animationDuration: 1000,
        });
      }, 1000);
    }
  }, [userLocation]);
  
  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapRef}
        style={styles.map}
        styleURL={theme === 'dark' ? MapboxGL.StyleURL.Dark : MapboxGL.StyleURL.Street}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled={true}
        compassViewMargins={{ x: 16, y: 140 }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          zoomLevel={10}
          animationMode="flyTo"
          animationDuration={1000}
        />
        
        {/* Cluster layer for event markers */}
        <MapboxGL.ShapeSource
          id="eventsSource"
          cluster
          clusterRadius={50}
          clusterMaxZoomLevel={14}
          shape={{
            type: 'FeatureCollection',
            features: markers.map(marker => ({
              type: 'Feature',
              properties: {
                id: marker.id,
                eventId: marker.eventId,
                title: marker.title,
              },
              geometry: {
                type: 'Point',
                coordinates: marker.coordinates,
              },
            })),
          }}
        >
          {/* Clustered markers */}
          <MapboxGL.SymbolLayer
            id="clusterCount"
            style={{
              textField: '{point_count}',
              textSize: 14,
              textColor: '#FFFFFF',
              textPitchAlignment: 'map',
              iconAllowOverlap: true,
              textAllowOverlap: true,
            }}
            filter={['has', 'point_count']}
          />
          
          <MapboxGL.CircleLayer
            id="clusteredPoints"
            belowLayerID="clusterCount"
            filter={['has', 'point_count']}
            style={{
              circleColor: '#FF3B7F',
              circleRadius: [
                'step',
                ['get', 'point_count'],
                20,
                10, 25,
                50, 30,
              ],
              circleOpacity: 0.9,
              circleStrokeWidth: 2,
              circleStrokeColor: '#fff',
            }}
          />
          
          {/* Individual markers - Add a TouchableOpacity wrapper for press handling */}
          <MapboxGL.CircleLayer
            id="singlePoint"
            filter={['!', ['has', 'point_count']]}
            style={{
              circleColor: '#FF3B7F',
              circleRadius: 8,
              circleOpacity: 1,
              circleStrokeWidth: 2,
              circleStrokeColor: '#fff',
            }}
          />
        </MapboxGL.ShapeSource>
        
        {/* Heat map layer for event density */}
        <MapboxGL.ShapeSource
          id="heatmapSource"
          shape={{
            type: 'FeatureCollection',
            features: markers.map(marker => ({
              type: 'Feature',
              properties: {
                weight: 1, // You can customize weight based on event popularity
              },
              geometry: {
                type: 'Point',
                coordinates: marker.coordinates,
              },
            })),
          }}
        >
          <MapboxGL.HeatmapLayer
            id="heatmapLayer"
            sourceID="heatmapSource"
            style={{
              heatmapWeight: ['get', 'weight'],
              heatmapIntensity: [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 1,
                9, 3,
              ],
              heatmapColor: [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(33,102,172,0)',
                0.2, 'rgb(103,169,207)',
                0.4, 'rgb(209,229,240)',
                0.6, 'rgb(253,219,199)',
                0.8, 'rgb(239,138,98)',
                1, 'rgb(255,59,127)',
              ],
              heatmapRadius: [
                'interpolate',
                ['linear'],
                ['zoom'],
                0, 2,
                9, 20,
              ],
              heatmapOpacity: [
                'interpolate',
                ['linear'],
                ['zoom'],
                7, 1,
                9, 0.5,
                12, 0.2,
              ],
            }}
          />
        </MapboxGL.ShapeSource>
        
        {/* User location */}
        {userLocation && (
          <MapboxGL.PointAnnotation
            id="userLocation"
            coordinate={[userLocation.longitude, userLocation.latitude]}
            onSelected={() => flyToUserLocation()}
          >
            <View style={styles.userLocationDot}>
              <Animated.View style={[styles.userLocationPulse, pulseAnimatedStyle]} />
            </View>
          </MapboxGL.PointAnnotation>
        )}
      </MapboxGL.MapView>
      
      {/* Event preview bottom sheet */}
      <EventBottomSheet
        ref={bottomSheetModalRef}
        event={selectedEvent}
        onEventPress={(event: EventPreview) => {
          bottomSheetModalRef.current?.dismiss();
          router.push(`/events/${event.id}`);
        }}
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
    width,
    height,
  },
  userLocationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    borderWidth: 3,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
  },
  userLocationPulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
  },
}); 