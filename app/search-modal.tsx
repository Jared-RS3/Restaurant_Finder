import FilterBottomSheet from '@/components/FilterBottomSheet';
import FilterChip from '@/components/FilterChip';
import RestaurantCard from '@/components/RestaurantCard';
import SortDropdown from '@/components/SortDropdown';
import { theme } from '@/constants/theme';
import { mockRestaurants } from '@/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeInDown,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 300;
const HEADER_MIN_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const sortOptions = [
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating-high', label: 'Rating: High to Low' },
  { id: 'distance-high', label: 'Distance: Far to Near' },
];

export default function SearchModal() {
  const [query, setQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const inputRef = useRef<TextInput>(null);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      'clamp'
    );
    return {
      height,
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE / 2],
      [1, 0],
      'clamp'
    );
    const scale = interpolate(scrollY.value, [-100, 0], [1.5, 1], 'clamp');
    return {
      opacity,
      transform: [{ scale }],
    };
  });

  const titleStyle = useAnimatedStyle(() => {
    const fontSize = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [32, 24],
      'clamp'
    );
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE / 2],
      [1, 0],
      'clamp'
    );
    return {
      fontSize,
      opacity,
    };
  });

  const sortRestaurants = (restaurants: typeof mockRestaurants) => {
    return [...restaurants].sort((a, b) => {
      switch (selectedSort.id) {
        case 'rating-high':
          return b.rating - a.rating;
        case 'rating-low':
          return a.rating - b.rating;
        case 'price-high':
          return b.priceLevel.length - a.priceLevel.length;
        case 'price-low':
          return a.priceLevel.length - b.priceLevel.length;
        case 'distance':
          // In a real app, calculate actual distance from user's location
          return 0;
        default:
          return 0;
      }
    });
  };

  const filteredRestaurants = sortRestaurants(
    mockRestaurants.filter((restaurant) => {
      const matchesSearch =
        !query ||
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.cuisine.toLowerCase().includes(query.toLowerCase());

      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.some((filter) => restaurant.cuisine === filter);

      return matchesSearch && matchesFilters;
    })
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <Animated.View style={[styles.header, headerStyle]}>
        <AnimatedImageBackground
          source={{
            uri: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
          }}
          style={[StyleSheet.absoluteFill, imageStyle]}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.6)', 'transparent']}
            style={StyleSheet.absoluteFill}
          />
        </AnimatedImageBackground>

        <SafeAreaView style={styles.headerContent}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft color={theme.colors.white} size={24} />
            </TouchableOpacity>
            <View style={styles.locationContainer}>
              <MapPin size={16} color={theme.colors.white} />
              <Text style={styles.locationText}>Cape Town, SA</Text>
            </View>
          </View>

          <Animated.Text style={[styles.title, titleStyle]}>
            Find your favorite{'\n'}restaurants
          </Animated.Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Search restaurants or cuisines"
                placeholderTextColor={theme.colors.textSecondary}
                value={query}
                onChangeText={setQuery}
              />
              {query !== '' && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <X size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setIsFilterVisible(true)}
            >
              <SlidersHorizontal size={20} color={theme.colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
            <RestaurantCard restaurant={item} featured={false} />
          </Animated.View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <SortDropdown
              options={sortOptions}
              selectedOption={selectedSort}
              onSelect={setSelectedSort}
            />
            <View style={styles.filters}>
              <Animated.ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersList}
              >
                {[
                  'All',
                  'Fine Dining',
                  'African',
                  'Contemporary',
                  'European',
                  'Seafood',
                ].map((filter) => (
                  <FilterChip
                    key={filter}
                    label={filter}
                    active={activeFilters.includes(filter)}
                    onPress={() => {
                      if (filter === 'All') {
                        setActiveFilters([]);
                      } else {
                        setActiveFilters((prev) =>
                          prev.includes(filter)
                            ? prev.filter((f) => f !== filter)
                            : [...prev, filter]
                        );
                      }
                    }}
                  />
                ))}
              </Animated.ScrollView>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No results found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
      />

      <FilterBottomSheet
        isVisible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApplyFilters={() => setIsFilterVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.white,
    marginLeft: 4,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    color: theme.colors.white,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    height: 56,
    borderRadius: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.text,
    marginLeft: 12,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingTop: HEADER_MAX_HEIGHT + 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listHeader: {
    gap: 16,
    marginBottom: 20,
  },
  filters: {
    marginTop: 8,
  },
  filtersList: {
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
});
