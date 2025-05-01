import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import {
  ArrowLeft,
  Clock,
  DollarSign,
  Globe,
  Heart,
  MapPin,
  Navigation,
  Phone,
  Share2,
  Star,
  Utensils,
} from 'lucide-react-native';
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, { FadeIn } from 'react-native-reanimated';

import { theme } from '@/constants/theme';
import { mockRestaurants } from '@/data/mockData';

const { width } = Dimensions.get('window');

export default function RestaurantDetails() {
  const { id } = useLocalSearchParams();
  const restaurant = mockRestaurants.find((r) => r.id === id);

  if (!restaurant) return null;

  const openMaps = () => {
    const latLng = `${restaurant.latitude},${restaurant.longitude}`;
    const label = restaurant.name;
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latLng}`,
      android: `geo:0,0?q=${latLng}(${label})`,
    });

    if (url) Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Image Section */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: restaurant.image }} style={styles.image} />
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']}
            style={styles.gradient}
          />

          {/* Top Actions */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
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
                  fill={
                    restaurant.isFavorite ? theme.colors.primary : 'transparent'
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tags on Image */}
          <View style={styles.imageOverlay}>
            <View style={styles.categoryTag}>
              <Utensils size={16} color={theme.colors.white} />
              <Text style={styles.categoryText}>{restaurant.cuisine}</Text>
            </View>
            <View style={styles.deliveryTag}>
              <Clock size={16} color={theme.colors.white} />
              <Text style={styles.deliveryText}>{restaurant.deliveryTime}</Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <Animated.View style={styles.content} entering={FadeIn.duration(400)}>
          <Text style={styles.name}>{restaurant.name}</Text>

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.rating}>
              <Star
                size={20}
                color={theme.colors.star}
                fill={theme.colors.star}
              />
              <Text style={styles.ratingText}>{restaurant.rating}</Text>
              <Text style={styles.reviewsText}>
                ({restaurant.reviewCount} reviews)
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.priceContainer}>
              <DollarSign size={20} color={theme.colors.primary} />
              <Text style={styles.priceLevel}>{restaurant.priceLevel}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryFee}>
                Delivery {restaurant.deliveryFee}
              </Text>
            </View>
          </View>

          {/* Tags */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tagsContainer}
          >
            {restaurant.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Map Section */}
          <View style={styles.mapSection}>
            <View style={styles.mapHeader}>
              <Text style={styles.sectionTitle}>Location</Text>
              <TouchableOpacity
                style={styles.directionsButton}
                onPress={openMaps}
              >
                <Navigation size={20} color={theme.colors.primary} />
                <Text style={styles.directionsText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                provider={PROVIDER_DEFAULT}
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: restaurant.latitude,
                  longitude: restaurant.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: restaurant.latitude,
                    longitude: restaurant.longitude,
                  }}
                  title={restaurant.name}
                />
              </MapView>
            </View>
          </View>

          {/* Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Information</Text>

            <View style={styles.infoCard}>
              {[
                { icon: MapPin, label: 'Location', value: restaurant.address },
                { icon: Phone, label: 'Phone', value: restaurant.phone },
                { icon: Globe, label: 'Website', value: restaurant.website },
                {
                  icon: Clock,
                  label: 'Opening Hours',
                  value: restaurant.openingHours,
                },
              ].map(({ icon: Icon, label, value }, index) => (
                <TouchableOpacity key={index} style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <Icon size={20} color={theme.colors.primary} />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>{label}</Text>
                    <Text style={styles.infoText}>{value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Add Photo Button */}
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={() => router.push('/add-photo')}
          >
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  scrollView: { flex: 1 },
  imageContainer: { width, height: 300, position: 'relative' },
  image: { width: '100%', height: '100%' },
  gradient: { position: 'absolute', top: 0, left: 0, right: 0, height: '100%' },
  header: {
    position: 'absolute',
    top: 35,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: { flexDirection: 'row', gap: 12 },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 36,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.white,
  },
  deliveryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  deliveryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.white,
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
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
  rating: { flexDirection: 'row', alignItems: 'center' },
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
    // backgroundColor: theme.colors.diver,
    marginHorizontal: 12,
  },
  priceContainer: { flexDirection: 'row', alignItems: 'center' },
  priceLevel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 4,
  },
  deliveryInfo: { justifyContent: 'center' },
  deliveryFee: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tagsContainer: { gap: 8, marginVertical: 16 },
  tag: {
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.text,
  },
  mapSection: { marginVertical: 24 },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  directionsButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  directionsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  mapContainer: { height: 200, borderRadius: 12, overflow: 'hidden' },
  map: { width: '100%', height: '100%' },
  section: { marginVertical: 24 },
  infoCard: { backgroundColor: theme.colors.surfaceLight, borderRadius: 12 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    // borderBottomColor: theme.colors.divider,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.text,
  },
  addPhotoButton: {
    backgroundColor: 'theme.colors.primary',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 24,
  },
  addPhotoText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.white,
  },
});
