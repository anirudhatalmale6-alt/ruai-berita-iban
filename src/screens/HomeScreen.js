import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoadingSpinner from '../components/LoadingSpinner';
import { fetchPosts, fetchCategories } from '../services/api';
import { COLORS, SIZES } from '../constants/theme';

const CATEGORY_IMAGES = {
  newsiban: 'https://www.ruaiberitaiban.my/wp-content/uploads/2026/02/RUAI-BERITA-IBAN-4-1024x290.png',
  perintahsarawak: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Flag_of_Sarawak.svg/320px-Flag_of_Sarawak.svg.png',
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      const cats = await fetchCategories();
      const filtered = cats
        .filter(c => c.count > 0 && c.slug !== 'perintahsarawak')
        .map(c => ({
          ...c,
          name: c.slug === 'newsiban' ? 'Ruai Berita Iban' : c.name,
        }));
      setCategories(filtered);
    } catch (err) {
      // silently fail
    }
  }, []);

  const loadPosts = useCallback(async (pageNum = 1, refresh = false, catId = null) => {
    try {
      setError(null);
      const data = await fetchPosts(pageNum, 10, catId);
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
    loadCategories();
    loadPosts();
  }, [loadCategories, loadPosts]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPosts(1, true, selectedCategory);
  };

  const loadMore = () => {
    if (!loadingMore && page < totalPages) {
      setLoadingMore(true);
      loadPosts(page + 1, false, selectedCategory);
    }
  };

  const selectCategory = (catId) => {
    if (catId === selectedCategory) {
      setSelectedCategory(null);
      setLoading(true);
      loadPosts(1, true, null);
    } else {
      setSelectedCategory(catId);
      setLoading(true);
      loadPosts(1, true, catId);
    }
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setShowMenu(true)}>
          <Ionicons name="menu" size={26} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Berita Tebaru</Text>
        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search" size={22} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>

      <View style={styles.brandRow}>
        <Text style={styles.brandName}>Ruai Berita Iban</Text>
      </View>

      {showMenu && (
        <TouchableOpacity style={styles.menuOverlay} activeOpacity={1} onPress={() => setShowMenu(false)}>
          <View style={styles.menuDrawer}>
            <View style={styles.menuHeader}>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <Ionicons name="close" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); }}>
              <Text style={styles.menuItemText}>HOME</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); navigation.navigate('About'); }}>
              <Text style={styles.menuItemText}>ABOUT US</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuSubText}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderArticle = ({ item, index }) => (
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
          <Text style={styles.articleCategory}>
            {categories.find(c => item.categories.includes(c.id))?.name || 'Ruai Berita Iban'}
          </Text>
          <Text style={styles.articleDate}>{formatDate(item.date)}</Text>
        </View>
      </View>
    </TouchableOpacity>
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
      <FlatList
        data={posts}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
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
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
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
    paddingHorizontal: SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  menuBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.darkGray,
    letterSpacing: 1.5,
  },
  searchBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandRow: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  brandName: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkGray,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },
  menuDrawer: {
    width: '75%',
    height: '100%',
    backgroundColor: '#888888',
  },
  menuHeader: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  menuSubText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    paddingLeft: 16,
  },
  listContent: {
    paddingBottom: 10,
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
    height: 220,
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
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 6,
  },
  articleExcerpt: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleCategory: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  articleDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
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
    backgroundColor: COLORS.darkGray,
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
