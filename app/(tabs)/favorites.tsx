import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import RestaurantCard from '@/components/RestaurantCard';
import { mockRestaurants } from '@/data/mockData';
import { Heart } from 'lucide-react-native';
import EmptyState from '@/components/EmptyState';

export default function FavoritesScreen() {
  // In a real app, you'd store and retrieve favorites from a persistent store
  const [favorites] = useState(mockRestaurants.slice(0, 3));
  
  // Create dummy collections
  const collections = [
    { id: '1', name: 'Must Try', count: 2 },
    { id: '2', name: 'Date Night', count: 1 },
    { id: '3', name: 'Lunch Spots', count: 0 },
  ];

  const [activeTab, setActiveTab] = useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
            All Favorites
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'collections' && styles.activeTab]}
          onPress={() => setActiveTab('collections')}
        >
          <Text style={[styles.tabText, activeTab === 'collections' && styles.activeTabText]}>
            Collections
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'all' ? (
        favorites.length > 0 ? (
          <FlatList
            data={favorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RestaurantCard restaurant={item} featured={false} />
            )}
            contentContainerStyle={styles.favoritesList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState
            icon={<Heart size={50} color={theme.colors.gray} />}
            title="No favorites yet"
            message="Save your favorite restaurants here to easily find them later"
            actionLabel="Explore Restaurants"
            onAction={() => {}}
          />
        )
      ) : (
        <View style={styles.collectionsContainer}>
          {collections.map((collection) => (
            <TouchableOpacity key={collection.id} style={styles.collectionCard}>
              <View style={styles.collectionInfo}>
                <Text style={styles.collectionName}>{collection.name}</Text>
                <Text style={styles.collectionCount}>
                  {collection.count} {collection.count === 1 ? 'restaurant' : 'restaurants'}
                </Text>
              </View>
              <View style={styles.collectionActions}>
                <TouchableOpacity style={styles.viewCollectionButton}>
                  <Text style={styles.viewCollectionText}>View</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.createCollectionButton}>
            <Text style={styles.createCollectionText}>Create New Collection</Text>
          </TouchableOpacity>
        </View>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.background,
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  favoritesList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  collectionsContainer: {
    paddingHorizontal: 20,
  },
  collectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 4,
  },
  collectionCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  collectionActions: {
    flexDirection: 'row',
  },
  viewCollectionButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  viewCollectionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  createCollectionButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  createCollectionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.white,
  },
});