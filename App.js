import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { COLORS } from './src/constants/theme';
import { registerForPushNotifications } from './src/services/notifications';
import { initInterstitialAds } from './src/services/ads';

import HomeScreen from './src/screens/HomeScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import SearchScreen from './src/screens/SearchScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Categories') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Bookmarks') {
          iconName = focused ? 'bookmark' : 'bookmark-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopColor: COLORS.border,
        height: 56,
        paddingBottom: 6,
        paddingTop: 4,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Rumah' }} />
    <Tab.Screen name="Categories" component={CategoriesScreen} options={{ tabBarLabel: 'Kategori' }} />
    <Tab.Screen name="Bookmarks" component={BookmarksScreen} options={{ tabBarLabel: 'Disimpan' }} />
  </Tab.Navigator>
);

export default function App() {
  const navigationRef = useRef(null);
  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  useEffect(() => {
    registerForPushNotifications();
    initInterstitialAds();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      if (data?.article && navigationRef.current) {
        navigationRef.current.navigate('Article', { article: data.article });
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar style="dark" backgroundColor={COLORS.white} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Article"
          component={ArticleScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
