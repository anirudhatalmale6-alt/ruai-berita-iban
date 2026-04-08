import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './src/constants/theme';

import HomeScreen from './src/screens/HomeScreen';
import ArticleScreen from './src/screens/ArticleScreen';
import SearchScreen from './src/screens/SearchScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import BookmarksScreen from './src/screens/BookmarksScreen';

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
  return (
    <NavigationContainer>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
