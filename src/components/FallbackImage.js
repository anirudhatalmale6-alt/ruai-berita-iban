import React, { useState, useCallback } from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

const FallbackImage = ({ urls, style, resizeMode = 'cover', placeholder = 'RBI' }) => {
  const [urlIndex, setUrlIndex] = useState(0);
  const [failed, setFailed] = useState(false);

  const onError = useCallback(() => {
    if (urlIndex < urls.length - 1) {
      setUrlIndex(prev => prev + 1);
    } else {
      setFailed(true);
    }
  }, [urlIndex, urls.length]);

  if (!urls || urls.length === 0 || failed) {
    return (
      <View style={[style, styles.placeholder]}>
        <Text style={styles.placeholderText}>{placeholder}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: urls[urlIndex] }}
      style={style}
      resizeMode={resizeMode}
      onError={onError}
    />
  );
};

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
});

export default FallbackImage;
