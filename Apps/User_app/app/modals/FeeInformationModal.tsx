import React from 'react';
import { Modal, View, Text, ScrollView, StyleSheet } from 'react-native';
import { CustomButton } from '@/components/productComponents/Button';
import { FeeRow } from '@/components/productComponents/FeeRow';
import { Fee } from '../types';

interface FeeInformationModalProps {
  visible: boolean;
  fees: Fee[];
  onClose: () => void;
}

 const FeeInformationModal: React.FC<FeeInformationModalProps> = ({ 
  visible, 
  fees, 
  onClose 
}) => (
  <Modal visible={visible} transparent animationType="slide">
    <View style={styles.modalBackground}>
      <View style={styles.feeModalCard}>
        <Text style={styles.feeModalTitle}>How our fees work?</Text>
        <Text style={styles.feeModalSubtitle}>Operational fees</Text>

        <ScrollView style={styles.feesList}>
          {fees.map((fee, index) => (
            <FeeRow 
              key={index}
              icon={fee.icon}
              label={fee.label}
              description={fee.description}
              amount={fee.amount}
            />
          ))}
        </ScrollView>

        <CustomButton 
          title="Got It"
          onPress={onClose}
          style={styles.gotItButton}
        />
      </View>
    </View>
  </Modal>
);

export default FeeInformationModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  feeModalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  feeModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 6,
  },
  feeModalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  feesList: {
    maxHeight: 400,
  },
  gotItButton: {
    marginTop: 20,
  },
});
