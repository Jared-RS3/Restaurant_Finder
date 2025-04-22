import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';
import { Settings, ChevronRight, History, Star, MapPin, MessageSquare, Bell, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

export default function ProfileScreen() {
  const profileMenuItems = [
    { 
      icon: <History size={22} color={theme.colors.text} />,
      title: 'Order History', 
      subtitle: 'View your past orders',
      action: () => {},
    },
    { 
      icon: <Star size={22} color={theme.colors.text} />,
      title: 'My Reviews', 
      subtitle: 'Manage your reviews',
      action: () => {},
    },
    { 
      icon: <MapPin size={22} color={theme.colors.text} />,
      title: 'Saved Addresses', 
      subtitle: 'Manage your addresses',
      action: () => {},
    },
    { 
      icon: <MessageSquare size={22} color={theme.colors.text} />,
      title: 'Support', 
      subtitle: 'Get help with the app',
      action: () => {},
    },
    { 
      icon: <Bell size={22} color={theme.colors.text} />,
      title: 'Notifications', 
      subtitle: 'Manage notification settings',
      action: () => {},
    },
    { 
      icon: <HelpCircle size={22} color={theme.colors.text} />,
      title: 'About', 
      subtitle: 'App information',
      action: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image 
              source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }} 
              style={styles.profileImage} 
            />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@example.com</Text>
              <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>
        
        <View style={styles.menuSection}>
          {profileMenuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.menuItem,
                index === profileMenuItems.length - 1 && styles.lastMenuItem
              ]}
              onPress={item.action}
            >
              <View style={styles.menuItemIcon}>
                {item.icon}
              </View>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.gray} />
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity style={styles.logoutButton}>
          <LogOut size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  headerTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: theme.colors.text,
  },
  settingsButton: {
    padding: 8,
  },
  profileSection: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 20,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: theme.colors.text,
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.primary,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 15,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: theme.colors.border,
    alignSelf: 'center',
  },
  menuSection: {
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 10,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemIcon: {
    marginRight: 15,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.danger,
    marginLeft: 10,
  },
});