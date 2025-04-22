import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, Callout } from 'react-native-maps';
import { theme } from '@/constants/theme';
import { MapPin, ArrowLeft, Star } from 'lucide-react-native';
import { mockRestaurants } from '@/data/mockData';
import { Restaurant } from '@/types/restaurant';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = 180;
const CARD_WIDTH = width * 0.9;

export default function MapScreen() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const mapRef = useRef<MapView>(null);
  
  const translateY = useSharedValue(height);
  
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const selectRestaurant = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    translateY.value = withSpring(height - CARD_HEIGHT - 100);
    
    // Center map on selected restaurant
    mapRef.current?.animateToRegion({
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 500);
  };

  const closeRestaurantCard = () => {
    translateY.value = withSpring(height);
    setSelectedRestaurant(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {mockRestaurants.map(restaurant => (
          <Marker
            key={restaurant.id}
            coordinate={{
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
            }}
            onPress={() => selectRestaurant(restaurant)}
          >
            <View style={[
              styles.markerContainer,
              selectedRestaurant?.id === restaurant.id && styles.selectedMarker
            ]}>
              <MapPin 
                size={24} 
                color={selectedRestaurant?.id === restaurant.id ? theme.colors.white : theme.colors.primary} 
              />
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{restaurant.name}</Text>
                <Text style={styles.calloutSubtitle}>{restaurant.cuisine}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Restaurants</Text>
      </View>
      
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
                  <Star size={16} color={theme.colors.star} fill={theme.colors.star} />
                  <Text style={styles.ratingText}>{selectedRestaurant.rating}</Text>
                  <Text style={styles.reviewsText}>({selectedRestaurant.reviewCount})</Text>
                </View>
                
                <View style={styles.cardPriceLevel}>
                  <Text style={styles.priceText}>{selectedRestaurant.priceLevel}</Text>
                </View>
                
                <Text style={styles.cuisineText}>{selectedRestaurant.cuisine}</Text>
              </View>
              
              <Text style={styles.cardAddress}>{selectedRestaurant.address}</Text>
              
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
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
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    textAlign: 'center',
  },
  markerContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    padding: 6,
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  selectedMarker: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.white,
  },
  calloutContainer: {
    width: 160,
    backgroundColor: theme.colors.white,
    borderRadius: 10,
    padding: 10,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  calloutTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  calloutSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.textSecondary,
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
  viewButton: {
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