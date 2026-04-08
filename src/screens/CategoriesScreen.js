import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCategories, fetchPosts } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      const filtered = cats.filter(c => c.count > 0);
      setCategories(filtered);
      if (filtered.length > 0) {
        selectCategory(filtered[0]);
      }
    } catch (err) {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const selectCategory = async (category) => {
    setSelectedCategory(category);
    setPostsLoading(true);
    setPosts([]);
    try {
      const data = await fetchPosts(1, 10, category.id);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setPage(1);
    } catch (err) {
      // silently fail
    } finally {
      setPostsLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || page >= totalPages || !selectedCategory) return;
    setLoadingMore(true);
    try {
      const data = await fetchPosts(page + 1, 10, selectedCategory.id);
      setPosts(prev => [...prev, ...data.posts]);
      setPage(page + 1);
    } catch (err) {
      // silently fail
    } finally {
      setLoadingMore(false);
    }
  };

  const onRefresh = async () => {
    if (!selectedCategory) return;
    setRefreshing(true);
    try {
      const data = await fetchPosts(1, 10, selectedCategory.id);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
      setPage(1);
    } catch (err) {
      // silently fail
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kategori</Text>
        </View>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kategori</Text>
      </View>

      <View style={styles.categoryBar}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory?.id === item.id && styles.categoryChipActive,
              ]}
              onPress={() => selectCategory(item)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory?.id === item.id && styles.categoryTextActive,
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.categoryCount,
                  selectedCategory?.id === item.id && styles.categoryCountActive,
                ]}
              >
                {item.count}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {postsLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              onPress={() => navigation.navigate('Article', { article: item })}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <LoadingSpinner size="small" /> : null}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nadai berita dalam kategori tu</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: SIZES.padding,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  categoryBar: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  categoryList: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  categoryTextActive: {
    color: COLORS.white,
  },
  categoryCount: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginLeft: 6,
    backgroundColor: COLORS.mediumGray,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  categoryCountActive: {
    color: COLORS.primary,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  listContent: {
    paddingTop: SIZES.paddingSmall,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
  },
});

export default CategoriesScreen;
