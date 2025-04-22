import { theme } from '@/constants/theme';
import {
  Fish,
  Soup,
  Utensils,
  UtensilsCrossed,
  Wine,
} from 'lucide-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CategoryButtonProps {
  category: string;
  active?: boolean;
}

const getCategoryIcon = (category: string, active: boolean) => {
  const color = active ? theme.colors.primary : theme.colors.text;
  const size = 24;

  switch (category) {
    case 'Fine Dining':
      return <UtensilsCrossed size={size} color={color} />;
    case 'Contemporary':
      return <Utensils size={size} color={color} />;
    case 'European':
      return <Wine size={size} color={color} />;
    case 'African':
      return <Soup size={size} color={color} />;
    case 'Seafood':
      return <Fish size={size} color={color} />;
    default:
      return <Utensils size={size} color={color} />;
  }
};

export default function CategoryButton({
  category,
  active = false,
}: CategoryButtonProps) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={[styles.iconWrapper, active && styles.activeIconWrapper]}>
        {getCategoryIcon(category, active)}
      </View>
      <Text style={[styles.text, active && styles.activeText]}>{category}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    alignItems: 'center',
    width: 80,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  activeIconWrapper: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary,
  },
  text: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  activeText: {
    color: theme.colors.primary,
  },
});
