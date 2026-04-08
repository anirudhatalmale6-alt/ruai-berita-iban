import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Share,
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
  const { width } = useWindowDimensions();
  const contentWidth = width - SIZES.padding * 2;

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
        {article.image && (
          <Image source={{ uri: article.image }} style={styles.heroImage} />
        )}

        <View style={styles.articleContent}>
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
            enableExperimentalMarginCollapsing={true}
          />

          <View style={styles.adContainer}>
            <AdBanner />
          </View>
        </View>
      </ScrollView>
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
  articleContent: {
    padding: SIZES.padding,
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
});

export default ArticleScreen;
