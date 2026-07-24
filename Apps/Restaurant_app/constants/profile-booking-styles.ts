// profile-booking-styles.ts - Styles for Profile and Booking Details pages

import { StyleSheet } from 'react-native';

export const profileBookingStyles = StyleSheet.create({
  // Profile Page Styles
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileUserInfo: {
    alignItems: 'center',
    position: 'relative',
  },
  profileRatingBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },

  // Booking Details Page Styles
  bookingCodeContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  stayInfoGrid: {
    flexDirection: 'row',
    gap: 24,
  },
  stayInfoColumn: {
    flex: 1,
  },
  guestDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  guestDetail: {
    alignItems: 'center',
    gap: 4,
  },
});