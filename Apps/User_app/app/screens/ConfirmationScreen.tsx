import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CustomButton } from '@/components/productComponents/Button';
import { Counter } from '@/components/productComponents/Counter';
import { SelectionBox } from '@/components/productComponents/SelectionBox';

interface ConfirmationScreenProps {
  onConfirm: (protein: number, drinks: number) => void;
  onBack?: () => void;
  totalPrice: number;
}

const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({
  onConfirm,
  onBack,
  totalPrice,
}) => {
  const [protein, setProtein] = useState(0);
  const [drinks, setDrinks] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={onBack}>
          <Text style={styles.iconButtonText}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconButtonText}>♡</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.confirmationImage} />

      <View style={styles.confirmationContent}>
        <View style={styles.confirmationSection}>
          <View style={styles.confirmationHeader}>
            <Text style={styles.confirmationSectionTitle}>Protein</Text>
            <Counter value={1} onIncrement={() => {}} onDecrement={() => {}} />
          </View>

          <View style={styles.selectionGrid}>
            <SelectionBox
              icon="🚫"
              selected={protein === 0}
              onPress={() => setProtein(0)}
            />
            <SelectionBox
              selected={protein === 1}
              onPress={() => setProtein(1)}
            />
            <SelectionBox
              selected={protein === 2}
              onPress={() => setProtein(2)}
            />
          </View>
        </View>

        <View style={styles.confirmationSection}>
          <View style={styles.confirmationHeader}>
            <Text style={styles.confirmationSectionTitle}>Drinks</Text>
            <Counter value={1} onIncrement={() => {}} onDecrement={() => {}} />
          </View>

          <View style={styles.selectionGrid}>
            <SelectionBox
              icon="🚫"
              selected={drinks === 0}
              onPress={() => setDrinks(0)}
            />
            <SelectionBox
              selected={drinks === 1}
              onPress={() => setDrinks(1)}
            />
            <SelectionBox
              selected={drinks === 2}
              onPress={() => setDrinks(2)}
            />
          </View>
        </View>

        <View style={styles.spacer} />

        <CustomButton
          title={`Confirm Order  |  $${totalPrice.toFixed(2)}`}
          onPress={() => onConfirm(protein, drinks)}
        />
      </View>
    </View>
  );
};

export default ConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 18,
    color: '#333',
  },
  confirmationImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#e8e8e8',
  },
  confirmationContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    padding: 24,
  },
  confirmationSection: {
    marginBottom: 28,
  },
  confirmationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmationSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  selectionGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
});
