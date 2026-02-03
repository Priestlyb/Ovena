import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Pressable, StyleSheet } from 'react-native';
import { styles } from '../constants/styles';

import { FileUploadProps } from '../types';

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  required = false,
  onUpload,
  acceptedFormats = 'PDF, PNG, JPEG',
  maxSize = '5mb',
}) => {
  const [fileName, setFileName] = useState('');

  const handlePress = () => {
    // In a real React Native app, use expo-document-picker or react-native-document-picker
    const mockFile = { name: 'business_document.pdf' };
    setFileName(mockFile.name);
    onUpload(mockFile);
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}> *</Text>}
        <Text style={styles.alertIcon}>⚠️</Text>
      </View>
      
      <TouchableOpacity style={styles.fileUploadBox} onPress={handlePress} activeOpacity={0.7}>
        <Text style={styles.fileIcon}>📄</Text>
        <Text style={styles.fileUploadTitle}>
          {fileName || 'Upload Document'}
        </Text>
        <Text style={styles.fileUploadSubtitle}>
          Allowed Format: {acceptedFormats} less than {maxSize}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
