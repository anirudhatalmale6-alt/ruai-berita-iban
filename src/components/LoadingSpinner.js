import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const LoadingSpinner = ({ size = 'large' }) => (
  <View style={styles.container}>
    <ActivityIndicator size={size} color={COLORS.primary} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
});

export default LoadingSpinner;
