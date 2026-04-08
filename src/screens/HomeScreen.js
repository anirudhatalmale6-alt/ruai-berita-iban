import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPosts } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const loadPosts = useCallback(async (pageNum = 1, refresh = false) => {
    try {
      setError(null);
      const data = await fetchPosts(pageNum, 10);
      if (refresh || pageNum === 1) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }
      setTotalPages(data.totalPages);
      setPage(pageNum);
    } catch (err) {
      setError('Enda ulih ngambi berita. Cuba semak internet nuan.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts(1, true);
  };

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      setLoadingMore(true);
      loadPosts(page + 1);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.headerTitle}>Ruai Berita Iban</Text>
          <Text style={styles.headerSubtitle}>Berita terkini menua kitai</Text>
        </View>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={22} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = ({ item, index }) => (
    <ArticleCard
      article={item}
      featured={index === 0}
      onPress={() => navigation.navigate('Article', { article: item })}
    />
  );

  const renderFooter = () => {
    if (!loadingMore) return <View style={{ height: 20 }} />;
    return <LoadingSpinner size="small" />;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <LoadingSpinner />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <Ionicons name="cloud-offline" size={48} color={COLORS.gray} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => { setLoading(true); loadPosts(); }}>
            <Text style={styles.retryText}>Cuba Semula</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={posts}
        renderItem={renderItem}
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
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  searchBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingTop: SIZES.padding,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.paddingLarge,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: SIZES.radius,
  },
  retryText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default HomeScreen;
