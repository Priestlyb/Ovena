import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface DeleteConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.deleteModalBackground}>
      <View style={styles.deleteModalCard}>
        <Text style={styles.deleteModalIcon}>🗑️</Text>
        <Text style={styles.deleteModalTitle}>Delete cart?</Text>
        <Text style={styles.deleteModalMessage}>
          Are you sure you want to start a new ride to add items again.
        </Text>

        <View style={styles.deleteModalActions}>
          <TouchableOpacity
            style={styles.deleteConfirmButton}
            onPress={onConfirm}
          >
            <Text style={styles.deleteConfirmIcon}>✓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteCancelButton}
            onPress={onCancel}
          >
            <Text style={styles.deleteCancelIcon}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

export default DeleteConfirmationModal;

const styles = StyleSheet.create({
  deleteModalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 40,
  },
  deleteModalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    maxWidth: 320,
  },
  deleteModalIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  deleteModalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  deleteModalActions: {
    flexDirection: 'row',
    gap: 16,
  },
  deleteConfirmButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ff6347',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteConfirmIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteCancelButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteCancelIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
