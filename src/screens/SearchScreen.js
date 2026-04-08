import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchPosts } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const SearchScreen = ({ navigation }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery) {
      setResults([]);
      setSearched(false);
      setQuery('');
      return;
    }
    setQuery(searchQuery);
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchPosts(searchQuery, 1);
      setResults(data.posts);
      setTotalPages(data.totalPages);
      setPage(1);
    } catch (err) {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = async () => {
    if (loadingMore || page >= totalPages || !query) return;
    setLoadingMore(true);
    try {
      const data = await searchPosts(query, page + 1);
      setResults(prev => [...prev, ...data.posts]);
      setPage(page + 1);
    } catch (err) {
      // silently fail
    } finally {
      setLoadingMore(false);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SEARCH</Text>
        <View style={{ width: 40 }} />
      </View>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <LoadingSpinner />
      ) : searched && results.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color={COLORS.mediumGray} />
          <Text style={styles.emptyText}>Nadai berita dijumpai</Text>
          <Text style={styles.emptySubtext}>Cuba guna kata kunci bukai</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <LoadingSpinner size="small" /> : null}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingBottom: 12,
    paddingHorizontal: SIZES.paddingSmall,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 1,
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
  },
});

export default SearchScreen;
