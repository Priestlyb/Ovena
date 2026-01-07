import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { CustomButton } from '@/components/productComponents/Button';
import { Counter } from '@/components/productComponents/Counter';
import { CheckboxItem } from '@/components/productComponents/CheckboxItem';
import { NutritionInfo } from '@/components/productComponents/NutritionInfo';
import { Product, Extra } from '../types';

interface ProductDetailScreenProps {
  product: Product;
  extras: Extra[];
  onNext: (quantity: number, selectedExtras: Extra[], notes: string) => void;
  onBack?: () => void;
}

 const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({ 
  product, 
  extras, 
  onNext,
  onBack 
}) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => ({
      ...prev,
      [extraId]: !prev[extraId]
    }));
  };

  const calculateTotal = (): number => {
    let total = product.price * quantity;
    extras.forEach(extra => {
      if (selectedExtras[extra.id]) {
        total += extra.price;
      }
    });
    return total;
  };

  const handleNext = () => {
    const selected = extras.filter(extra => selectedExtras[extra.id]);
    onNext(quantity, selected, notes);
  };

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

      <View style={styles.productImage} />

      <ScrollView style={styles.scrollContent}>
        <View style={styles.productSection}>
          <View style={styles.productTitleRow}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <Counter 
              value={quantity}
              onIncrement={() => setQuantity(q => q + 1)}
              onDecrement={() => setQuantity(q => q - 1)}
              size="large"
              minValue={1}
            />
          </View>

          <Text style={styles.productDesc}>{product.description}</Text>

          <View style={styles.nutritionGrid}>
            <NutritionInfo label="Rating" value={product.rating} unit="★" />
            <NutritionInfo label="Kcal" value={product.kcal} unit="" />
            <NutritionInfo label="Time" value={product.time} unit=" min" />
            <NutritionInfo label="Calories" value={product.calories} unit=" Kcal" />
          </View>

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Add Extra Additional</Text>
          
          {extras.map(extra => (
            <CheckboxItem 
              key={extra.id}
              label={extra.label}
              price={extra.price}
              checked={!!selectedExtras[extra.id]}
              onToggle={() => toggleExtra(extra.id)}
            />
          ))}

          <View style={styles.sectionDivider} />

          <Text style={styles.sectionTitle}>Add Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Write instruction for restaurant..."
            placeholderTextColor="#999"
            multiline
            value={notes}
            onChangeText={setNotes}
          />

          <CustomButton 
            title={`Next  |  $${calculateTotal().toFixed(2)}`}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

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
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e8e8e8',
  },
  scrollContent: {
    flex: 1,
  },
  productSection: {
    padding: 20,
    paddingBottom: 40,
  },
  productTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
    marginRight: 12,
  },
  productDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 16,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    color: '#333',
    textAlignVertical: 'top',
    marginBottom: 20,
  },
});