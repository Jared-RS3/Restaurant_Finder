import { theme } from '@/constants/theme';
import { Restaurant } from '@/types/restaurant';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Clock, Heart, MapPin, Star } from 'lucide-react-native';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface RestaurantCardProps {
  restaurant: Restaurant;
  featured: boolean;
}

const { width } = Dimensions.get('window');

export default function RestaurantCard({
  restaurant,
  featured,
}: RestaurantCardProps) {
  const navigateToDetails = () => {
    router.push(`/${restaurant.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={navigateToDetails}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: restaurant.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'transparent']}
          style={styles.gradient}
        />
        <TouchableOpacity style={styles.heartButton}>
          <Heart
            size={20}
            color={theme.colors.white}
            fill={restaurant.isFavorite ? theme.colors.primary : 'transparent'}
          />
        </TouchableOpacity>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{restaurant.cuisine}</Text>
        </View>
        <View style={styles.deliveryTimeTag}>
          <Clock size={14} color={theme.colors.white} />
          <Text style={styles.deliveryTimeText}>{restaurant.deliveryTime}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {restaurant.name}
          </Text>
          <View style={styles.rating}>
            <Star
              size={16}
              color={theme.colors.star}
              fill={theme.colors.star}
            />
            <Text style={styles.ratingText}>{restaurant.rating}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.location}>
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {restaurant.address}
            </Text>
          </View>
          <Text style={styles.priceLevel}>{restaurant.priceLevel}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.9,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 200,
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
    height: '40%',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    flex: 1,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  priceLevel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  heartButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.white,
  },
  deliveryTimeTag: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  deliveryTimeText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.white,
  },
});
