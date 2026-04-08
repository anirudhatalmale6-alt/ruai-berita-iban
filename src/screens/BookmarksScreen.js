import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import ArticleCard from '../components/ArticleCard';
import { COLORS, SIZES } from '../constants/theme';

const BOOKMARKS_KEY = '@rbi_bookmarks';

export const getBookmarks = async () => {
  try {
    const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const toggleBookmark = async (article) => {
  try {
    const bookmarks = await getBookmarks();
    const exists = bookmarks.find(b => b.id === article.id);
    let updated;
    if (exists) {
      updated = bookmarks.filter(b => b.id !== article.id);
    } else {
      updated = [article, ...bookmarks];
    }
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
};

export const isBookmarked = async (articleId) => {
  const bookmarks = await getBookmarks();
  return bookmarks.some(b => b.id === articleId);
};

const BookmarksScreen = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadBookmarks();
    }, [])
  );

  const loadBookmarks = async () => {
    const data = await getBookmarks();
    setBookmarks(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Disimpan</Text>
      </View>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={48} color={COLORS.mediumGray} />
          <Text style={styles.emptyText}>Nadai berita disimpan</Text>
          <Text style={styles.emptySubtext}>Tekan ikon bookmark ba berita untuk nyimpan</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              onPress={() => navigation.navigate('Article', { article: item })}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 1.5,
  },
  listContent: {
    paddingTop: SIZES.paddingSmall,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});

export default BookmarksScreen;
