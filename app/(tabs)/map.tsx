import { theme } from '@/constants/theme';
import { mockRestaurants } from '@/data/mockData';
import { Restaurant } from '@/types/restaurant';
import { router } from 'expo-router';
import { ArrowLeft, MapPin, Navigation, Star } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Callout, Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, {
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 180;
const CARD_WIDTH = width * 0.9;

// Cape Town coordinates
const CAPE_TOWN_REGION = {
  latitude: -33.9249,
  longitude: 18.4241,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// Generate additional unvisited restaurant locations
const generateUnvisitedRestaurants = () => {
  const locations = [
    { name: 'The Potluck Club', latitude: -33.9271, longitude: 18.4571 },
    { name: 'The Test Kitchen', latitude: -33.9271, longitude: 18.4571 },
    {
      name: 'Chefs Warehouse Beau Constantia',
      latitude: -34.0312,
      longitude: 18.3843,
    },
    { name: 'The Shortmarket Club', latitude: -33.9185, longitude: 18.4173 },
    { name: 'Grub & Vine', latitude: -33.9182, longitude: 18.4172 },
    { name: 'Belly of the Beast', latitude: -33.9246, longitude: 18.4196 },
    { name: 'Upper Bloem', latitude: -33.9137, longitude: 18.4173 },
    { name: 'Janse & Co', latitude: -33.9285, longitude: 18.4119 },
    { name: 'The Stack', latitude: -33.9285, longitude: 18.4119 },
    { name: 'Ash Restaurant', latitude: -33.9182, longitude: 18.4172 },
  ];

  return locations.map((loc, index) => ({
    id: `unvisited-${index}`,
    name: loc.name,
    latitude: loc.latitude,
    longitude: loc.longitude,
    isVisited: false,
  }));
};

const unvisitedRestaurants = generateUnvisitedRestaurants();

const mapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#616161' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#f5f5f5' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'poi',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'transit',
    stylers: [{ visibility: 'off' }],
  },
];

export default function MapScreen() {
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [discoveredRestaurants, setDiscoveredRestaurants] = useState<
    Set<string>
  >(new Set());
  const mapRef = useRef<MapView>(null);
  const translateY = useSharedValue(height);

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.animateToRegion(CAPE_TOWN_REGION, 1000);
      }
    }, 500);
  }, []);

  const selectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setDiscoveredRestaurants((prev) => new Set([...prev, restaurant.id]));
    translateY.value = withSpring(height - CARD_HEIGHT - 100, {
      damping: 15,
      stiffness: 150,
    });

    mapRef.current?.animateToRegion(
      {
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      500
    );
  };

  const closeRestaurantCard = () => {
    translateY.value = withSpring(height);
    setSelectedRestaurant(null);
  };

  const navigateToDetails = (restaurant: Restaurant) => {
    router.push(`/${restaurant.id}`);
  };

  const openInMaps = (restaurant: Restaurant) => {
    const scheme = Platform.select({ ios: 'maps:', android: 'geo:' });
    const url = Platform.select({
      ios: `${scheme}?q=${restaurant.name}&ll=${restaurant.latitude},${restaurant.longitude}`,
      android: `${scheme}${restaurant.latitude},${restaurant.longitude}?q=${restaurant.name}`,
    });

    if (url) {
      router.push(url as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={CAPE_TOWN_REGION}
        showsUserLocation
        showsMyLocationButton
        customMapStyle={mapStyle}
      >
        {/* Visited Restaurants */}
        {mockRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            onPress={() => selectRestaurant(restaurant)}
          >
            <Animated.View
              entering={FadeIn}
              style={[
                styles.markerContainer,
                selectedRestaurant?.id === restaurant.id &&
                  styles.selectedMarker,
                discoveredRestaurants.has(restaurant.id) &&
                  styles.discoveredMarker,
              ]}
            >
              <MapPin
                size={24}
                color={
                  selectedRestaurant?.id === restaurant.id
                    ? theme.colors.white
                    : theme.colors.primary
                }
              />
            </Animated.View>
            <Callout tooltip onPress={() => navigateToDetails(restaurant)}>
              <View style={styles.calloutContainer}>
                <Image
                  source={{ uri: restaurant.image }}
                  style={styles.calloutImage}
                />
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                  <Text style={styles.calloutSubtitle}>
                    {restaurant.cuisine}
                  </Text>
                  <View style={styles.calloutRating}>
                    <Star
                      size={12}
                      color={theme.colors.star}
                      fill={theme.colors.star}
                    />
                    <Text style={styles.calloutRatingText}>
                      {restaurant.rating}
                    </Text>
                  </View>
                </View>
              </View>
            </Callout>
          </Marker>
        ))}

        {/* Unvisited Restaurants */}
        {unvisitedRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
          >
            <View style={styles.unvisitedMarker}>
              <MapPin size={24} color={theme.colors.gray} />
            </View>
            <Callout tooltip>
              <View style={styles.unvisitedCallout}>
                <Text style={styles.unvisitedTitle}>{restaurant.name}</Text>
                <Text style={styles.unvisitedSubtitle}>
                  Restaurant not yet visited
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <Animated.View entering={SlideInDown.delay(500)} style={styles.header}>
        <Text style={styles.headerTitle}>Discover Cape Town</Text>
        <Text style={styles.headerSubtitle}>
          {discoveredRestaurants.size} of {mockRestaurants.length} restaurants
          visited
        </Text>
      </Animated.View>

      {/* Restaurant Card */}
      <Animated.View style={[styles.restaurantCardContainer, animatedStyles]}>
        {selectedRestaurant && (
          <View style={styles.restaurantCard}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeRestaurantCard}
            >
              <ArrowLeft size={20} color={theme.colors.text} />
            </TouchableOpacity>

            <View style={styles.cardImageContainer}>
              <Image
                source={{ uri: selectedRestaurant.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{selectedRestaurant.name}</Text>

              <View style={styles.cardDetails}>
                <View style={styles.cardRating}>
                  <Star
                    size={16}
                    color={theme.colors.star}
                    fill={theme.colors.star}
                  />
                  <Text style={styles.ratingText}>
                    {selectedRestaurant.rating}
                  </Text>
                  <Text style={styles.reviewsText}>
                    ({selectedRestaurant.reviewCount})
                  </Text>
                </View>

                <View style={styles.cardPriceLevel}>
                  <Text style={styles.priceText}>
                    {selectedRestaurant.priceLevel}
                  </Text>
                </View>

                <Text style={styles.cuisineText}>
                  {selectedRestaurant.cuisine}
                </Text>
              </View>

              <Text style={styles.cardAddress}>
                {selectedRestaurant.address}
              </Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.directionsButton}
                  onPress={() => openInMaps(selectedRestaurant)}
                >
                  <Navigation size={20} color={theme.colors.primary} />
                  <Text style={styles.directionsText}>Directions</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigateToDetails(selectedRestaurant)}
                >
                  <Text style={styles.viewButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  map: {
    width,
    height,
    position: 'absolute',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  markerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  selectedMarker: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.white,
    transform: [{ scale: 1.1 }],
  },
  discoveredMarker: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.white,
  },
  unvisitedMarker: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: theme.colors.gray,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  unvisitedCallout: {
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: 8,
    width: 160,
  },
  unvisitedTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  unvisitedSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  calloutContainer: {
    width: 200,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  calloutImage: {
    width: '100%',
    height: 100,
  },
  calloutContent: {
    padding: 12,
  },
  calloutTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  calloutSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  calloutRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calloutRatingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.text,
    marginLeft: 4,
  },
  restaurantCardContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 20,
  },
  restaurantCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    flexDirection: 'row',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImageContainer: {
    width: '40%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
  },
  cardDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  ratingText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 4,
  },
  reviewsText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  cardPriceLevel: {
    marginRight: 10,
  },
  priceText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  cuisineText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  cardAddress: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  directionsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    gap: 6,
  },
  directionsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  viewButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.white,
  },
});
