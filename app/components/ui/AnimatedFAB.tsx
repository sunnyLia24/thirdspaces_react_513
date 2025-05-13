import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  TouchableWithoutFeedback, 
  View,
  Text
} from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  interpolate, 
  Extrapolate 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from './ThemeProvider';

interface AnimatedFABProps {
  onPress: () => void;
  label: string;
  icon: React.ReactNode;
}

export const AnimatedFAB = ({ onPress, label, icon }: AnimatedFABProps) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const width = useSharedValue(56);
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    // Animate in on mount
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const fabAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
      width: width.value,
      opacity: opacity.value
    };
  });
  
  const labelAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        width.value,
        [56, 130],
        [0, 1],
        Extrapolate.CLAMP
      ),
      transform: [
        { 
          translateX: interpolate(
            width.value,
            [56, 130],
            [20, 0],
            Extrapolate.CLAMP
          ) 
        }
      ]
    };
  });
  
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: interpolate(
            width.value,
            [56, 130],
            [0, -8],
            Extrapolate.CLAMP
          ) 
        }
      ]
    };
  });

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.9);
    width.value = withSpring(130);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    width.value = withSpring(56);
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View 
        style={[
          fabAnimatedStyle,
          styles.fab,
          { backgroundColor: theme === 'dark' ? '#FF3B7F' : '#FF3B7F' }
        ]}
      >
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          {icon}
        </Animated.View>
        <Animated.Text 
          style={[
            labelAnimatedStyle,
            styles.label,
            { color: '#FFFFFF' }
          ]}
        >
          {label}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  fab: {
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  iconContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
}); 