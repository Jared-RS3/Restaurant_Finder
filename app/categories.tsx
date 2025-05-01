import CategoryButton from '@/components/CategoryButton'; // Ensure this exists
import { theme } from '@/constants/theme';
import { mockRestaurants } from '@/data/mockData';
import { getUniqueCategories } from '@/utils/helpers';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

export default function Categories() {
  const categories = getUniqueCategories(mockRestaurants);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Text style={styles.headerSubtitle}>
          Explore {mockRestaurants.length} restaurants across{' '}
          {categories.length} cuisines
        </Text>
      </View>

      <FlatList
        data={categories}
        numColumns={5}
        showsHorizontalScrollIndicator={false}
        // assuming item has a 'name' property
        contentContainerStyle={styles.categoriesList}
        renderItem={({ item, index }) => (
          <CategoryButton category={item} active={index === 0} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  greet: {
    color: 'black',
    fontSize: 24,
    marginBottom: 16,
  },
  categoriesList: {
    paddingVertical: 20,
    gap: 20,
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});
