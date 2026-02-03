// constants/styles.ts - Complete stylesheet for all components and pages
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
    backgroundColor: 'rgba(255, 180, 126, 0.2)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 30,
    boxShadow: '0px 4px 8px #ff592099',
  },
  checklistIconBox: {
    width: 48,
    height: 48,
    backgroundColor: '#FF5920',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checklistIconText: {
    fontSize: 24,
  },
  checklistItemText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxCompleted: {
    borderColor: '#FF5920',
    backgroundColor: '#FF5920',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
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
  disabledBtn: {
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
  disabledBtnText: {
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
  resendSection: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 8,
  },
  resendLink: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF5920',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
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
  infoIcon: {
    fontSize: 20,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  phoneVerificationContent: {
    flex: 1,
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
});