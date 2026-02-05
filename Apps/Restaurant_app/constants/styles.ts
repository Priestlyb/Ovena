// constants/styles.ts - Complete stylesheet with all phone verification styles
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================================================
  // GENERAL PAGE STYLES
  // ============================================================================
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  locationContainer: {
    paddingTop: 100,
  },
  backButton: {
    marginBottom: 32,
  },
  backButtonInline: {
    marginRight: 16,
  },
  backArrow: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  
  // ============================================================================
  // INPUT STYLES
  // ============================================================================
  inputContainer: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  required: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
  },
  inputWrapper: {
    position: 'relative',
  },
  textInput: {
    backgroundColor: '#ffb47e45',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#838383',
    boxShadow: '0px 4px 8px #ff592099',
  },
  passwordToggle: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  eyeIcon: {
    fontSize: 20,
    color: '#ff5920',
  },
  
  // ============================================================================
  // DROPDOWN STYLES
  // ============================================================================
  dropdown: {
    backgroundColor: '#ffb47e45',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0px 4px 8px #ff592099',
  },
  dropdownText: {
    fontSize: 16,
    color: '#838383',
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#868686',
    flex: 1,
  },
  chevron: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '100%',
    maxHeight: '60%',
    borderWidth: 2,
    borderColor: 'rgba(255, 89, 32, 0.6)',
    overflow: 'hidden',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: '#111827',
  },
  
  // ============================================================================
  // PHONE INPUT STYLES
  // ============================================================================
  phoneRow: {
    flexDirection: 'row',
    gap: 12,
  },
  countryCodeBox: {
    backgroundColor: '#ffb47e45',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0px 4px 8px #ff592099',
  },
  flagEmoji: {
    fontSize: 24,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#ffb47e45',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    boxShadow: '0px 4px 8px #ff592099',
  },
  
  // ============================================================================
  // OTP STYLES
  // ============================================================================
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    marginTop: 24,
  },
  otpBox: {
    width: 70,
    height: 70,
    backgroundColor: '#ffb47e45',
    borderRadius: 12,
    fontSize: 32,
    fontWeight: '600',
    color: '#838383',
    textAlign: 'center',
    boxShadow: '0px 4px 8px #ff592099',
  },
  
  // ============================================================================
  // FILE UPLOAD STYLES
  // ============================================================================
  fileUploadBox: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  fileUploadTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  fileUploadSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  alertIcon: {
    fontSize: 18,
    marginLeft: 8,
  },
  
  // ============================================================================
  // CHECKLIST STYLES
  // ============================================================================
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  checklistIconBox: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
  
  checklistIconText: {
    fontSize: 24,
  },
  
  checklistTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  
  checklistItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  
  checklistLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  checklistLinkText: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 4,
  },
  
  chevronIcon: {
    marginLeft: 2,
  },
  
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  
  checkboxCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  
  checkboxCheckmark: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  checkboxCheckmarkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },

  disabledBtn: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },

  disabledBtnText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // ============================================================================
  // BUTTON STYLES
  // ============================================================================
  continueBtn: {
    backgroundColor: '#FF5920',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  disabledBtn1: {
    backgroundColor: '#9CA3AF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledBtnText1: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // ============================================================================
  // EMAIL VERIFICATION PAGE SPECIFIC
  // ============================================================================
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emailDisplay: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  
  // ============================================================================
  // PHONE VERIFICATION PAGE SPECIFIC (OLD LAYOUT - KEPT FOR COMPATIBILITY)
  // ============================================================================
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  content: {
    flex: 1,
  },

  infoBox: {
    backgroundColor: 'rgba(255, 180, 126, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 89, 32, 0.3)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 16,
  },

  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  
  // ============================================================================
  // PHONE VERIFICATION PAGE SPECIFIC (NEW LAYOUT)
  // ============================================================================
  phoneVerificationContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  phoneVerificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  phoneVerificationBackBtn: {
    marginRight: 16,
  },
  phoneVerificationTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  phoneVerificationSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  phoneVerificationNumber: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 60,
  },
  phoneVerificationContent: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
  },
  phoneVerificationSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 32,
  },
  phoneVerificationInputContainer: {
    marginBottom: 16,
  },
  phoneVerificationInput: {
    backgroundColor: 'rgba(255, 180, 126, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    boxShadow: '0px 4px 8px #ff592099',
  },
  phoneVerificationInfoBox: {
    backgroundColor: 'rgba(255, 180, 126, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 89, 32, 0.3)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  phoneVerificationInfoIconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneVerificationInfoIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  phoneVerificationInfoText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  otpWrapper: {
    width: '100%',
    marginBottom: 40,
  },
  phoneVerificationResendSection: {
    alignItems: 'center',
  },
  phoneVerificationResendText: {
    fontSize: 14,
    color: '#111827',
    marginBottom: 4,
  },
  phoneVerificationResendLink: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '500',
  },
  phoneVerificationContinueBtn: {
    backgroundColor: '#FF5920',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  phoneVerificationContinueBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  phoneDisplay: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 32,
    textAlign: 'center',
  },

  resendSection: {
    marginTop: 24,
    alignItems: 'center',
  },

  resendText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },

  resendLink: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 8,
  },

  dividerLine: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 20,
  },

  addAmenitiesBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },

  addAmenitiesText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },

  openingTimesSection: {
    marginTop: 24,
  },

  openingTimesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  openingTimesLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },

  infoIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
  },

  infoIconSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  infoIconText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  openingTimesBox: {
    backgroundColor: '#FEF3E7',
    padding: 16,
    borderRadius: 12,
  },

  openingTimesSubtext: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },

  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },

  timeDropdown: {
    flex: 1,
  },

  bvnInfoBox: {
    backgroundColor: '#FEF3E7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  bvnInfoText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },

  preOrderInfoBox: {
    backgroundColor: '#FEF3E7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  preOrderInfoText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },

  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  profileHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 16,
  },

  profileImageSection: {
    alignItems: 'center',
    marginBottom: 24,
  },

  profileImageCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3E7',
    position: 'relative',
    marginBottom: 12,
  },

  profileImagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },

  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  imageSizeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3E7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  imageSizeText: {
    fontSize: 12,
    color: '#92400E',
    marginLeft: 8,
  },

  uploadInfoBox: {
    backgroundColor: '#FEF3E7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  uploadInfoText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },

  addCategoryBtn: {
    marginTop: 8,
    paddingVertical: 8,
  },

  addCategoryText: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },
});