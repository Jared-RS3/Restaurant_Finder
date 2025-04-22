import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  small?: boolean;
}

export default function FilterChip({ label, active, onPress, small = false }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        active && styles.activeContainer,
        small && styles.smallContainer,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.label,
          active && styles.activeLabel,
          small && styles.smallLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeContainer: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  smallContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  label: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  activeLabel: {
    color: theme.colors.white,
  },
  smallLabel: {
    fontSize: 12,
  },
});