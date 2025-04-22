import { theme } from '@/constants/theme';
import { X } from 'lucide-react-native';
import { useEffect } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface FilterBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

const { height } = Dimensions.get('window');
const MAX_TRANSLATE_Y = 0;
const MIN_TRANSLATE_Y = height;
const SPRING_CONFIG = {
  damping: 50,
  stiffness: 300,
  mass: 0.8,
};

export default function FilterBottomSheet({
  isVisible,
  onClose,
  onApplyFilters,
}: FilterBottomSheetProps) {
  const translateY = useSharedValue(MIN_TRANSLATE_Y);
  const context = useSharedValue(0);
  const active = useSharedValue(false);

  useEffect(() => {
    if (isVisible) {
      translateY.value = withSpring(MAX_TRANSLATE_Y, SPRING_CONFIG);
    } else {
      translateY.value = withSpring(MIN_TRANSLATE_Y, SPRING_CONFIG);
    }
  }, [isVisible]);

  const scrollTo = (destination: number) => {
    'worklet';
    active.value = destination !== MIN_TRANSLATE_Y;
    translateY.value = withSpring(destination, SPRING_CONFIG);
  };

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = translateY.value;
    })
    .onUpdate((event) => {
      translateY.value = Math.max(
        Math.min(context.value + event.translationY, MIN_TRANSLATE_Y),
        MAX_TRANSLATE_Y
      );
    })
    .onEnd((event) => {
      if (event.velocityY > 500) {
        scrollTo(MIN_TRANSLATE_Y);
        runOnJS(onClose)();
      } else if (event.velocityY < -500) {
        scrollTo(MAX_TRANSLATE_Y);
      } else {
        const shouldClose = translateY.value > height * 0.6;
        if (shouldClose) {
          scrollTo(MIN_TRANSLATE_Y);
          runOnJS(onClose)();
        } else {
          scrollTo(MAX_TRANSLATE_Y);
        }
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    const borderRadius = interpolate(
      translateY.value,
      [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
      [25, 5],
      'clamp'
    );

    return {
      borderTopLeftRadius: borderRadius,
      borderTopRightRadius: borderRadius,
      transform: [{ translateY: translateY.value }],
    };
  });

  const rBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      display: isVisible ? 'flex' : 'none',
    };
  });

  const sortOptions = ['Recommended', 'Nearest', 'Rating', 'Popular'];
  const priceRanges = ['$', '$$', '$$$', '$$$$'];
  const dietaryOptions = ['Vegetarian', 'Vegan', 'Gluten-free', 'Halal'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Cafe'];

  return (
    <GestureHandlerRootView style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.backdrop, rBackdropStyle]}>
        <TouchableOpacity style={styles.backdropButton} onPress={onClose} />
      </Animated.View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.bottomSheet, rBottomSheetStyle]}>
          <View style={styles.header}>
            <View style={styles.handle} />
            <Text style={styles.title}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort by</Text>
              <View style={styles.optionsGrid}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[styles.optionButton, styles.activeOption]}
                  >
                    <Text style={[styles.optionText, styles.activeOptionText]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Range</Text>
              <View style={styles.optionsRow}>
                {priceRanges.map((price) => (
                  <TouchableOpacity key={price} style={styles.priceButton}>
                    <Text style={styles.priceText}>{price}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dietary</Text>
              <View style={styles.optionsGrid}>
                {dietaryOptions.map((option) => (
                  <TouchableOpacity key={option} style={styles.optionButton}>
                    <Text style={styles.optionText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Meal Type</Text>
              <View style={styles.optionsGrid}>
                {mealTypes.map((type) => (
                  <TouchableOpacity key={type} style={styles.optionButton}>
                    <Text style={styles.optionText}>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton}>
              <Text style={styles.resetText}>Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                onApplyFilters({});
                onClose();
              }}
            >
              <Text style={styles.applyText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  backdropButton: {
    flex: 1,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.surface,
    zIndex: 2,
    paddingBottom: 34,
    height: '85%',
    shadowColor: theme.colors.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: theme.colors.text,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  activeOption: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  optionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: theme.colors.text,
  },
  activeOptionText: {
    color: theme.colors.white,
  },
  priceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.text,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  resetText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: theme.colors.text,
  },
  applyButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
  },
  applyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: theme.colors.white,
  },
});
