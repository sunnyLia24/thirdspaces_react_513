import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { signIn } from '../../services/firebase';
import { useStore } from '../../hooks/useStore';
import { useTheme } from '../../components/ui/ThemeProvider';

export default function SignInScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { setUser, setIsAuthenticated } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(20);
  const logoScale = useSharedValue(0.8);

  // Animated styles
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      transform: [{ translateY: formTranslateY.value }],
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  // Start animations when component mounts
  React.useEffect(() => {
    logoScale.value = withSequence(
      withTiming(1.1, { duration: 400 }),
      withTiming(1, { duration: 200 })
    );
    
    formOpacity.value = withDelay(
      300,
      withTiming(1, { duration: 500 })
    );
    
    formTranslateY.value = withDelay(
      300,
      withTiming(0, { duration: 500 })
    );
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setIsLoading(true);
      
      const user = await signIn(email, password);
      
      // In a real app, you would fetch the user's profile from Firestore
      // and set it in the store. For this demo, we'll create a mock user.
      setUser({
        id: user.uid,
        email: user.email!,
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
      router.replace('/');
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error('Sign in error:', error);
      Alert.alert('Sign In Failed', 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    Haptics.selectionAsync();
    setShowPassword(!showPassword);
  };

  const navigateToSignUp = () => {
    router.push('/auth/sign-up');
  };

  return (
    <SafeAreaView 
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? '#121212' : '#F5F5F7' }
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Text 
            style={[
              styles.logoText,
              { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
            ]}
          >
            ThirdSpaces
          </Text>
          <Text 
            style={[
              styles.tagline,
              { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
            ]}
          >
            Connect through social events
          </Text>
        </Animated.View>

        <Animated.View style={[styles.formContainer, formAnimatedStyle]}>
          <View 
            style={[
              styles.inputContainer,
              { 
                backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0',
              }
            ]}
          >
            <Ionicons 
              name="mail-outline" 
              size={20} 
              color={theme === 'dark' ? '#B8B8B8' : '#757575'} 
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
              ]}
              placeholder="Email Address"
              placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View 
            style={[
              styles.inputContainer,
              { 
                backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0',
              }
            ]}
          >
            <Ionicons 
              name="lock-closed-outline" 
              size={20} 
              color={theme === 'dark' ? '#B8B8B8' : '#757575'} 
              style={styles.inputIcon}
            />
            <TextInput
              style={[
                styles.input,
                { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
              ]}
              placeholder="Password"
              placeholderTextColor={theme === 'dark' ? '#B8B8B8' : '#757575'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={toggleShowPassword}
            >
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={theme === 'dark' ? '#B8B8B8' : '#757575'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.signInButton,
              { opacity: isLoading ? 0.7 : 1 }
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text 
              style={[
                styles.forgotPasswordText,
                { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
              ]}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View 
              style={[
                styles.dividerLine, 
                { backgroundColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0' }
              ]}
            />
            <Text 
              style={[
                styles.dividerText,
                { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
              ]}
            >
              OR
            </Text>
            <View 
              style={[
                styles.dividerLine, 
                { backgroundColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0' }
              ]}
            />
          </View>

          <View style={styles.socialButtonsContainer}>
            <TouchableOpacity 
              style={[
                styles.socialButton,
                { 
                  backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0',
                }
              ]}
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text 
                style={[
                  styles.socialButtonText,
                  { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                ]}
              >
                Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.socialButton,
                { 
                  backgroundColor: theme === 'dark' ? '#252525' : '#FFFFFF',
                  borderColor: theme === 'dark' ? '#3A3A3A' : '#E0E0E0',
                }
              ]}
            >
              <Ionicons name="logo-apple" size={20} color={theme === 'dark' ? '#FFFFFF' : '#121212'} />
              <Text 
                style={[
                  styles.socialButtonText,
                  { color: theme === 'dark' ? '#FFFFFF' : '#121212' }
                ]}
              >
                Apple
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Text 
            style={[
              styles.footerText,
              { color: theme === 'dark' ? '#B8B8B8' : '#757575' }
            ]}
          >
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={navigateToSignUp}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  passwordToggle: {
    padding: 8,
  },
  signInButton: {
    backgroundColor: '#FF3B7F',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    flex: 0.48,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    marginRight: 4,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B7F',
  },
}); 