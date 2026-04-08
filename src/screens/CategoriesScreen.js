import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  ScrollView,
} from 'react-native';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchCategories, fetchPosts } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

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

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('Article', { article: item })}
      activeOpacity={0.9}
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.articleImage} />
      ) : (
        <View style={[styles.articleImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>RBI</Text>
        </View>
      )}
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={3}>{item.title}</Text>
        <Text style={styles.articleExcerpt} numberOfLines={2}>{item.excerpt}</Text>
        <View style={styles.articleMeta}>
          <Text style={styles.articleAuthor}>{item.author}</Text>
          <Text style={styles.articleDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>CATEGORIES</Text>
        </View>
        <LoadingSpinner />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CATEGORIES</Text>
      </View>

      <View style={styles.categoryBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        >
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
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
                {item.name.toUpperCase()}
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
          ))}
        </ScrollView>
      </View>

      {postsLoading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.darkGray]}
              tintColor={COLORS.darkGray}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <LoadingSpinner size="small" /> : null}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    backgroundColor: COLORS.darkGray,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.5,
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
    color: COLORS.darkGray,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  listContent: {
    paddingTop: 0,
  },
  separator: {
    height: 8,
    backgroundColor: '#f0f0f0',
  },
  articleCard: {
    backgroundColor: COLORS.white,
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  placeholderImage: {
    backgroundColor: COLORS.darkGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
  },
  articleContent: {
    padding: SIZES.padding,
  },
  articleTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 23,
    marginBottom: 4,
  },
  articleExcerpt: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 8,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  articleAuthor: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  articleDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
