import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../components/SearchBar';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchPosts } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pansik</Text>
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
          renderItem={({ item }) => (
            <ArticleCard
              article={item}
              onPress={() => navigation.navigate('Article', { article: item })}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={loadingMore ? <LoadingSpinner size="small" /> : null}
          showsVerticalScrollIndicator={false}
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
    paddingBottom: 12,
    paddingHorizontal: SIZES.paddingSmall,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.white,
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
  },
});

export default SearchScreen;
