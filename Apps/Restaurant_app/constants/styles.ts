// constants/styles.ts - Complete stylesheet with all phone verification styles
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ============================================================================
  // GENERAL PAGE STYLES
  // ============================================================================
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 50
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
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10,
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
    fontSize: 17,
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
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: "#FFF",
  },
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
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    marginTop: 24,
  },
  otpBox: {
    width: 50,
    height: 50,
    backgroundColor: '#ffb47e45',
    borderRadius: 12,
    fontSize: 25,
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
    backgroundColor: '#FF6B35',

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
    backgroundColor: "#FF5920",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 32,
    marginBottom: 75,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  continueBtnDisabled: {
    backgroundColor: "#9CA3AF",
    opacity: 0.7, // Optional
  },

  continueBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  continueBtnTextDisabled: {
    color: "#E5E7EB",
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
  numberDisplay: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 25,
  },
  resendButton: {
    color: "#FFB47E",
    padding: 10,
    marginTop: 5,
    borderRadius: 10,
    fontWeight: 700,
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

  /* =========================================================
   🔹 BRANCH LIST STYLES
========================================================= */

  branchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  branchName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },

  branchAddress: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },

  branchCoords: {
    fontSize: 12,
    color: "#9CA3AF",
  },

  branchActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // Orange indicator for incomplete checklist items
  checkboxOrangeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35', // Orange color
  },

  // Progress Section
  progressSection: {
    marginTop: 32,
    marginBottom: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },

  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },

  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF6B35', // Orange color
    borderRadius: 4,
  },

  passwordInputWrapper: {
    position: 'relative',
  },

  passwordIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },

  passwordStrength: {
    flexDirection: 'row',
    gap: 4,
  },

  passwordStrengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
  },

  passwordStrengthBarFilled: {
    backgroundColor: '#10B981',
  },

  // ============================================================================
  // STORE PROFILE IMAGE STYLES
  // ============================================================================
  storeProfileSection: {
    alignItems: 'center',
  },

  storeProfileImageContainer: {
    position: 'relative',
  },

  storeCameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },

  // ============================================================================
  // STORE HUB TIME ROW STYLES
  // ============================================================================
  storeHubTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  storeHubTimeDropdown: {
    flex: 1,
  },

  checklistContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  checklistContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // ============================================================================
  // CHECKLIST TITLES
  // ============================================================================
  checklistMainTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    lineHeight: 28,
  },

  checklistSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },

  // ============================================================================
  // CHECKLIST ITEM CARD
  // ============================================================================
  checklistItemCard: {
    backgroundColor: '#FEF3E7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 22,
    marginHorizontal: 25,
    boxShadow: '0px 4px 8px #ff592099',
  },

  checklistItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ============================================================================
  // ORANGE ICON BOX
  // ============================================================================
  checklistOrangeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  checklistIconEmoji: {
    fontSize: 24,
  },

  // ============================================================================
  // TEXT SECTION
  // ============================================================================
  checklistItemTextSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  checklistItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },

  // ============================================================================
  // COMPLETION CIRCLE
  // ============================================================================
  checklistCompletionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },

  checklistCompletionCircleCompleted: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },

  checklistCheckmark: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF6B35',
  },

  // ============================================================================
  // BEGIN ORDER BUTTON
  // ============================================================================
  beginOrderBtn: {
    backgroundColor: '#ff5920',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  beginOrderBtnDisabled: {
    backgroundColor: '#2F292680',
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    alignItems: 'center',
  },

  beginOrderBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Login Page Styles
  loginToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  loginToggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  loginToggleButtonActive: {
    backgroundColor: '#FFFFFF',
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCodePlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#000000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // PIN Input Styles
  pinInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  pinInputBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#FEF3E7',
    borderWidth: 2,
    borderColor: '#FF6B35',
    fontSize: 32,
    fontWeight: '600',
    color: '#FF6B35',
    textAlign: 'center',
  },

  // Store Analytics Styles
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    width: '48%',
  },
  chartContainer: {
    height: 250,
  },
  yAxisContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 40,
  },
  yAxisLabel: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: '100%',
    paddingLeft: 60,
    paddingBottom: 30,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barLabelAbove: {
    position: 'absolute',
    top: -30,
    backgroundColor: '#FCD34D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  bar: {
    width: 30,
    backgroundColor: '#FF6B35',
    borderRadius: 4,
  },
  periodDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  periodMenu: {
    position: 'absolute',
    right: 20,
    top: 40,
    backgroundColor: '#FEF3E7',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  periodMenuItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  periodMenuItemActive: {
    backgroundColor: '#FF6B35',
  },

  // Manage Users Styles
  userCard: {
    backgroundColor: '#FEF3E7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  deviceIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deviceInfo: {
    flex: 1,
  },
  illustrationContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },

  // Your Finances Styles
  balanceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateImage: {
    width: 200,
    height: 200,
  },

  // Transaction History
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAmount: {
    fontWeight: '600',
  },
  transactionAmountCredit: {
    color: '#10B981',
  },
  transactionAmountDebit: {
    color: '#EF4444',
  },

  // Filter Button
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // General
  headerWithAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inviteUserButton: {
    color: '#FF6B35',
  },

  // Container
  toggleContainer: {
    gap: 8,
  },

  // Label
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },

  // Row with status text and switch
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },

  // Status Text (Open/Closed, etc.)
  toggleStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Switch Track (Background)
  toggleSwitch: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D1D5DB', // Gray (inactive)
    padding: 2,
    justifyContent: 'center',
  },

  toggleSwitchActive: {
    backgroundColor: '#FF6B35', // Orange (active)
  },

  // Switch Thumb (Circle)
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    transform: [{ translateX: 0 }], // Left position (inactive)
  },

  toggleThumbActive: {
    transform: [{ translateX: 20 }], // Right position (active)
  },

  // Profile Page Styles
  profileHeader: {
  },
  profileUserInfo: {
    alignItems: 'center',
    position: 'relative',
    alignSelf: 'center',
  },
  profileRatingBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
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