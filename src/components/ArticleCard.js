import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mac', 'Apr', 'Mei', 'Jun', 'Jul', 'Ogos', 'Sep', 'Okt', 'Nov', 'Dis'];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const ArticleCard = ({ article, onPress, featured = false }) => {
  if (featured) {
    return (
      <TouchableOpacity style={styles.featuredCard} onPress={onPress} activeOpacity={0.85}>
        {article.image ? (
          <Image source={{ uri: article.image }} style={styles.featuredImage} />
        ) : (
          <View style={[styles.featuredImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>RBI</Text>
          </View>
        )}
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredTitle} numberOfLines={3}>{article.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.featuredDate}>{formatDate(article.date)}</Text>
            <Text style={styles.featuredAuthor}>{article.author}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={3}>{article.title}</Text>
          <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.date}>{formatDate(article.date)}</Text>
            <Text style={styles.author}>{article.author}</Text>
          </View>
        </View>
        {article.image ? (
          <Image source={{ uri: article.image }} style={styles.thumbnail} />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderImage]}>
            <Text style={styles.placeholderTextSmall}>RBI</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.padding,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  featuredImage: {
    width: '100%',
    height: 220,
  },
  featuredOverlay: {
    padding: SIZES.padding,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  featuredDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  featuredAuthor: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  card: {
    marginHorizontal: SIZES.padding,
    marginBottom: 12,
    borderRadius: SIZES.radiusSmall,
    backgroundColor: COLORS.card,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  excerpt: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  author: {
    fontSize: 11,
    color: COLORS.primary,
    fontWeight: '600',
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: SIZES.radiusSmall,
  },
  placeholderImage: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: '700',
  },
  placeholderTextSmall: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ArticleCard;
