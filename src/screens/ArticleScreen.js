import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
  Modal,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import AdBanner from '../components/AdBanner';
import { COLORS, SIZES } from '../constants/theme';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun', 'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember'];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const ArticleScreen = ({ route, navigation }) => {
  const { article } = route.params;
  const { width, height } = useWindowDimensions();
  const isTablet = width >= 600;
  const maxContentWidth = isTablet ? 680 : width;
  const contentWidth = maxContentWidth - SIZES.padding * 2;
  const [zoomImage, setZoomImage] = useState(null);

  const tagsStyles = {
    body: {
      color: COLORS.text,
      fontSize: 16,
      lineHeight: 26,
    },
    p: {
      marginBottom: 12,
    },
    img: {
      borderRadius: 8,
    },
    a: {
      color: COLORS.primary,
      textDecorationLine: 'none',
    },
    h1: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
    h2: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
    h3: { fontSize: 18, fontWeight: '600', marginBottom: 6 },
    blockquote: {
      borderLeftWidth: 3,
      borderLeftColor: COLORS.primary,
      paddingLeft: 12,
      marginVertical: 12,
      fontStyle: 'italic',
    },
    figure: {
      marginVertical: 12,
    },
  };

  const renderers = {
    img: ({ tnode }) => {
      const src = tnode.attributes?.src;
      if (!src) return null;
      return (
        <TouchableOpacity activeOpacity={0.9} onPress={() => setZoomImage(src)}>
          <Image source={{ uri: src }} style={{ width: contentWidth, height: contentWidth * 0.6, borderRadius: 8 }} resizeMode="cover" />
        </TouchableOpacity>
      );
    },
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: article.title,
        message: `${article.title}\n\n${article.link}`,
        url: article.link,
      });
    } catch (err) {
      // silently fail
    }
  };

  const heroUrl = article.image;
  const zoomUrl = article.imageUrls?.[article.imageUrls.length - 1] || article.image;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>ARTICLE</Text>
        <TouchableOpacity style={styles.headerBtn} onPress={handleShare}>
          <Ionicons name="share-outline" size={22} color={COLORS.darkGray} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {heroUrl ? (
          <TouchableOpacity activeOpacity={0.9} onPress={() => setZoomImage(zoomUrl)}>
            <Image
              source={{ uri: heroUrl }}
              style={[styles.heroImage, isTablet && styles.heroImageTablet]}
            />
          </TouchableOpacity>
        ) : null}

        <View style={[styles.articleContent, isTablet && styles.articleContentTablet]}>
          <Text style={styles.title}>{article.title}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{formatDate(article.date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={14} color={COLORS.textSecondary} />
              <Text style={styles.metaText}>{article.author}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <RenderHtml
            contentWidth={contentWidth}
            source={{ html: article.content }}
            tagsStyles={tagsStyles}
            renderers={renderers}
            enableExperimentalMarginCollapsing={true}
          />

          <View style={styles.adContainer}>
            <AdBanner />
          </View>
        </View>
      </ScrollView>

      <Modal visible={!!zoomImage} transparent animationType="fade" onRequestClose={() => setZoomImage(null)}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <View style={styles.zoomOverlay}>
          <TouchableOpacity style={styles.zoomClose} onPress={() => setZoomImage(null)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <ScrollView
            contentContainerStyle={styles.zoomScrollContent}
            maximumZoomScale={5}
            minimumZoomScale={1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bouncesZoom={true}
          >
            <Image
              source={{ uri: zoomImage }}
              style={{ width: width, height: width * 0.6 }}
              resizeMode="contain"
            />
          </ScrollView>
        </View>
      </Modal>
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
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkGray,
    flex: 1,
    textAlign: 'center',
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  heroImageTablet: {
    height: 400,
  },
  articleContent: {
    padding: SIZES.padding,
  },
  articleContentTablet: {
    maxWidth: 680,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 12,
  },
  metaContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  metaText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 16,
  },
  adContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  zoomOverlay: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  zoomClose: {
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomScrollContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ArticleScreen;
