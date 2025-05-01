import FilterBottomSheet from '@/components/FilterBottomSheet';
import FilterChip from '@/components/FilterChip';
import RestaurantCard from '@/components/RestaurantCard';
import { theme } from '@/constants/theme';
import { mockRestaurants } from '@/data/mockData';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import {
  ArrowLeft,
  Coffee,
  MapPin,
  Search,
  SlidersHorizontal,
  UtensilsCrossed,
  X,
} from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Pressable,
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
  withSpring,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = 320;
const HEADER_MIN_HEIGHT = 140;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SearchType = 'restaurants' | 'food';

const sortOptions = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'rating-high', label: 'Highest Rated' },
  { id: 'price-low', label: 'Lowest Price' },
  { id: 'distance', label: 'Nearest to You' },
];

export default function SearchModal() {
  const [query, setQuery] = useState('');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);
  const [searchType, setSearchType] = useState<SearchType>('restaurants');
  const inputRef = useRef<TextInput>(null);
  const scrollY = useSharedValue(0);
  const switchAnim = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const toggleSearchType = () => {
    setSearchType((prev) => {
      const next = prev === 'restaurants' ? 'food' : 'restaurants';
      switchAnim.value = withSpring(next === 'food' ? 1 : 0);
      return next;
    });
  };

  const switchStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(switchAnim.value * (width / 2 - 24)) },
    ],
  }));

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

  const sortRestaurants = (restaurants: typeof mockRestaurants) => {
    return [...restaurants].sort((a, b) => {
      switch (selectedSort.id) {
        case 'rating-high':
          return b.rating - a.rating;
        case 'price-low':
          return a.priceLevel.length - b.priceLevel.length;
        case 'distance':
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
            colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)', 'transparent']}
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
              <Text style={styles.locationText}>Kuils River, Cape Town</Text>
            </View>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color={theme.colors.textSecondary} />
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder={`Search ${searchType}...`}
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

          <View style={styles.searchTypeContainer}>
            <Animated.View style={[styles.switchBackground, switchStyle]} />
            <TouchableOpacity
              style={[
                styles.switchOption,
                searchType === 'restaurants' && styles.activeOption,
              ]}
              onPress={() => setSearchType('restaurants')}
            >
              <UtensilsCrossed
                size={20}
                color={
                  searchType === 'restaurants'
                    ? theme.colors.primary
                    : theme.colors.white
                }
              />
              <Text
                style={[
                  styles.switchText,
                  searchType === 'restaurants' && styles.activeText,
                ]}
              >
                Restaurants
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchOption,
                searchType === 'food' && styles.activeOption,
              ]}
              onPress={() => setSearchType('food')}
            >
              <Coffee
                size={20}
                color={
                  searchType === 'food'
                    ? theme.colors.primary
                    : theme.colors.white
                }
              />
              <Text
                style={[
                  styles.switchText,
                  searchType === 'food' && styles.activeText,
                ]}
              >
                Food
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sortContainer}>
            {/* <SortDropdown
              options={sortOptions}
              selectedOption={selectedSort}
              onSelect={setSelectedSort}
            /> */}
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
            <Text style={styles.resultsCount}>
              {filteredRestaurants.length}{' '}
              {filteredRestaurants.length === 1 ? 'Result' : 'Results'}
            </Text>
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
    paddingTop: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 50,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    height: 50,
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
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 4,
    position: 'relative',
    height: 44,
  },
  switchBackground: {
    position: 'absolute',
    top: 4,
    left: 4,
    width: width / 2 - 24,
    height: 36,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
  },
  switchOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    zIndex: 1,
  },
  activeOption: {
    backgroundColor: 'transparent',
  },
  switchText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.white,
  },
  activeText: {
    color: theme.colors.primary,
  },
  sortContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  content: {
    flex: 1,
    paddingTop: HEADER_MAX_HEIGHT + 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: -4,
    backgroundColor: theme.colors.surface,
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
  resultsCount: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
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
