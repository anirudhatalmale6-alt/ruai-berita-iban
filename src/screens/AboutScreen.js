import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ABOUT US</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('../../assets/logo_circle.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Ruai Berita Iban</Text>
        <Text style={styles.tagline}>
          Ngerembaika berita selampur menua, seriris enggau pemansang dunya digital
        </Text>

        <View style={styles.divider} />

        <Text style={styles.description}>
          Ruai Berita Iban nya siti portal berita ti ngena jaku Iban, nyadi perantara berita terkini ari menua Sarawak enggau menua bukai.
        </Text>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL('https://www.ruaiberitaiban.my')}
        >
          <Ionicons name="globe-outline" size={20} color={COLORS.primary} />
          <Text style={styles.linkText}>www.ruaiberitaiban.my</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkRow}
          onPress={() => Linking.openURL('https://www.facebook.com/ruaiberitaiban')}
        >
          <Ionicons name="logo-facebook" size={20} color={COLORS.primary} />
          <Text style={styles.linkText}>Facebook</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Privacy Policy</Text>
        <Text style={styles.description}>
          Kami nyaga privasi pengguna kami. App tu enda nyimpan data peribadi nuan.
        </Text>

        <Text style={styles.version}>Version 1.0.0</Text>
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
    letterSpacing: 1,
  },
  content: {
    padding: SIZES.paddingLarge,
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    marginVertical: 20,
  },
  description: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  linkText: {
    fontSize: 15,
    color: COLORS.primary,
    marginLeft: 8,
  },
  version: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 20,
  },
});

export default AboutScreen;
