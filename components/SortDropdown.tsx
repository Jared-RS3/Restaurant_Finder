import { theme } from '@/constants/theme';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface SortOption {
  id: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  selectedOption: SortOption;
  onSelect: (option: SortOption) => void;
}

export default function SortDropdown({
  options,
  selectedOption,
  onSelect,
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rotateAnim = new Animated.Value(0);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    Animated.spring(rotateAnim, {
      toValue: isOpen ? 0 : 1,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <Text style={styles.selectedText}>Sort</Text>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <ChevronDown size={16} color={theme.colors.primary} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                selectedOption.id === option.id && styles.selectedOption,
              ]}
              onPress={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption.id === option.id && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1000,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  selectedText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: theme.colors.primary,
    marginRight: 4,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    width: 200,
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    marginTop: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedOption: {
    backgroundColor: theme.colors.primaryLight,
  },
  optionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: theme.colors.text,
  },
  selectedOptionText: {
    fontFamily: 'Poppins-Medium',
    color: theme.colors.primary,
  },
});
