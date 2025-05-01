import CategoryButton from '@/components/CategoryButton';
import RestaurantCard from '@/components/RestaurantCard';
import { theme } from '@/constants/theme';
import { mockRestaurants } from '@/data/mockData';
import { getUniqueCategories } from '@/utils/helpers';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, MapPin, Search } from 'lucide-react-native';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const BANNER_HEIGHT = 325;
const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

export default function HomeScreen() {
  const categories = getUniqueCategories(mockRestaurants);
  const scrollY = useSharedValue(0);

  const openSearch = () => {
    router.push('/search-modal');
  };

  const seeAll = () => {
    router.push('/categories');
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const bannerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [-100, 0],
      [1.5, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, BANNER_HEIGHT],
      [0, -BANNER_HEIGHT / 2],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, BANNER_HEIGHT / 2],
      [1, 0],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  const contentAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, BANNER_HEIGHT],
      [0, -BANNER_HEIGHT / 4],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Fixed Banner Background */}
      <AnimatedImageBackground
        source={{
          uri: 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg',
        }}
        style={[styles.bannerBackground, bannerAnimatedStyle]}
      >
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </AnimatedImageBackground>

      <Animated.ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Banner Content */}
        <View style={styles.bannerContent}>
          <View style={styles.topHeader}>
            <View style={styles.locationRow}>
              <MapPin size={20} color={theme.colors.white} />
              <Text style={styles.location}>San Francisco, CA</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color={theme.colors.white} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          <Text style={styles.bannerText}>
            What would you like{'\n'}to eat today?
          </Text>

          <TouchableOpacity
            style={styles.searchBar}
            activeOpacity={0.8}
            onPress={openSearch}
          >
            <Search size={20} color={theme.colors.textSecondary} />
            <Text style={styles.searchText}>
              Search for restaurants or dishes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <Animated.View style={[styles.mainContent, contentAnimatedStyle]}>
          {/* Categories */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={seeAll}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item, index }) => (
              <CategoryButton category={item} active={index === 0} />
            )}
          />

          {/* Popular Now */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Now</Text>
            <TouchableOpacity onPress={openSearch}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {mockRestaurants.slice(0, 5).map((restaurant, index) => (
              <View
                key={restaurant.id}
                style={{
                  marginRight: index !== mockRestaurants.length - 1 ? 30 : 0,
                }}
              >
                <RestaurantCard restaurant={restaurant} featured={true} />
              </View>
            ))}
          </ScrollView>

          {/* Recommended */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity onPress={openSearch}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recommendedList}>
            {mockRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                featured={false}
              />
            ))}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  bannerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: BANNER_HEIGHT,
    zIndex: 0,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: {
    minHeight: '100%',
  },
  bannerContent: {
    height: BANNER_HEIGHT,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 45,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.white,
    marginLeft: 6,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
  bannerText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 25,
    color: theme.colors.white,
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
    lineHeight: 42,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 20,
  },
  searchText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: 12,
  },
  mainContent: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingBottom: 20,
    marginTop: -25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  seeAll: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  categoriesList: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 32,
  },
  featuredList: {
    paddingLeft: 20,
    paddingRight: 10,
    marginBottom: 32,
  },
  recommendedList: {
    paddingHorizontal: 20,
  },
});
