import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { mockRestaurants } from '@/data/mockData';
import { Heart, Star, Clock, DollarSign, ArrowLeft, Share2, Phone, Globe, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams();
  const restaurant = mockRestaurants.find(r => r.id === id);

  if (!restaurant) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent', 'transparent']}
            style={styles.gradient}
          />
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <ArrowLeft color={theme.colors.white} size={24} />
            </TouchableOpacity>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Share2 color={theme.colors.white} size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Heart
                  size={24}
                  color={theme.colors.white}
                  fill={restaurant.isFavorite ? theme.colors.primary : 'transparent'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>{restaurant.name}</Text>
          
          <View style={styles.stats}>
            <View style={styles.rating}>
              <Star size={20} color={theme.colors.star} fill={theme.colors.star} />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewsText}>({restaurant.reviewCount} reviews)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.deliveryTime}>
              <Clock size={20} color={theme.colors.text} />
              <Text style={styles.deliveryTimeText}>{restaurant.deliveryTime}</Text>
            </View>
            <View style={styles.statDivider} />
            <Text style={styles.priceLevel}>{restaurant.priceLevel}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <MapPin size={20} color={theme.colors.text} />
                  <Text style={styles.infoText}>{restaurant.address}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Phone size={20} color={theme.colors.text} />
                  <Text style={styles.infoText}>{restaurant.phone}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Globe size={20} color={theme.colors.text} />
                  <Text style={styles.infoText}>{restaurant.website}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Clock size={20} color={theme.colors.text} />
                  <Text style={styles.infoText}>{restaurant.openingHours}</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.addPhotoButton} onPress={() => router.push('/add-photo')}>
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: theme.colors.text,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 4,
  },
  reviewsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: theme.colors.border,
    marginHorizontal: 16,
  },
  deliveryTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryTimeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 8,
  },
  priceLevel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.primary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  addPhotoButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  addPhotoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.white,
  },
});