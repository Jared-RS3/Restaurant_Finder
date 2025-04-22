import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { Search as SearchIcon, X, FileSliders as Sliders } from 'lucide-react-native';
import RestaurantCard from '@/components/RestaurantCard';
import { mockRestaurants } from '@/data/mockData';
import FilterChip from '@/components/FilterChip';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const cuisineFilters = ['Italian', 'Mexican', 'Japanese', 'Indian', 'American', 'Thai', 'Chinese', 'Mediterranean'];
  const priceFilters = ['$', '$$', '$$$', '$$$$'];
  
  const filteredRestaurants = mockRestaurants.filter(restaurant => {
    const matchesSearch = !searchQuery || 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesFilters = activeFilters.length === 0 || 
      activeFilters.includes(restaurant.cuisine) ||
      activeFilters.includes(restaurant.priceLevel);
      
    return matchesSearch && matchesFilters;
  });

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Restaurants</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={theme.colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for restaurants or cuisines"
            placeholderTextColor={theme.colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <X size={20} color={theme.colors.gray} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Sliders size={20} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>Cuisine:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersList}
        >
          {cuisineFilters.map(filter => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilters.includes(filter)}
              onPress={() => toggleFilter(filter)}
            />
          ))}
        </ScrollView>
        
        <Text style={styles.filtersTitle}>Price:</Text>
        <View style={styles.priceFilters}>
          {priceFilters.map(filter => (
            <FilterChip
              key={filter}
              label={filter}
              active={activeFilters.includes(filter)}
              onPress={() => toggleFilter(filter)}
              small
            />
          ))}
        </View>
      </View>
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>
          {filteredRestaurants.length} {filteredRestaurants.length === 1 ? 'Result' : 'Results'}
        </Text>
        <FlatList
          data={filteredRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard restaurant={item} featured={false} />
          )}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: 10,
    paddingVertical: 5,
  },
  filterButton: {
    marginLeft: 10,
    backgroundColor: theme.colors.primary,
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 2,
  },
  filtersContainer: {
    paddingHorizontal: 20,
  },
  filtersTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  filtersList: {
    paddingBottom: 15,
  },
  priceFilters: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultsTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  resultsList: {
    paddingBottom: 20,
  },
});