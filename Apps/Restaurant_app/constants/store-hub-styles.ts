// store-hub-styles.ts - Styles for Store Hub page

import { StyleSheet } from 'react-native';

export const storeHubStyles = StyleSheet.create({
  // Info box (peach/cream background)
  infoBox: {
    backgroundColor: '#FEF3E7',
    borderRadius: 8,
    padding: 12,
  },

  // Label row with asterisk and info icon
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Input container
  inputContainer: {
    gap: 8,
  },

  // Section with bottom border
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 24,
    marginBottom: 24,
  },
});