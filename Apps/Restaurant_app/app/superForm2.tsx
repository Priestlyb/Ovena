// superForm2.tsx - Secondary onboarding flow
import React, { useState } from 'react';
import { View } from 'react-native';
import BusinessDocumentsPage from './screens/businessDocuments';
import PhoneVerificationPage1 from './screens/phoneVerification';
import PhoneVerificationPage2 from './screens/phoneVerification2';
import ProfileCompletionPage from './screens/profilecompletion';
import PaymentPage from './screens/payments';
import OperationsPage from './screens/operations';
import MenuItemsPage from './screens/menuItem';
import RoomMenuPage from './screens/roomMenu';
import { SuperForm2Data, SuperForm2SubmissionData } from '@/types';

export default function SuperForm2() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<SuperForm2Data>({
    // Business Types for dropdown
    businessTypes: [
      'Limited Liability Company',
      'Sole Proprietorship',
      'Partnership',
      'Corporation',
    ],

    // Business Documents Data
    docBusinessType: '',
    registeredBusinessName: '',
    taxId: '',
    rcNumber: '',
    uploadedDocument: null,

    // Phone Verification Data (Page 1)
    phone: '',

    // Phone Verification OTP (Page 2)
    otp: '',

    // Profile Completion Data
    shopName: '',
    shopType: '',
    profileImage: null,
    businessImage: null,

    // Payment Data
    selectedBank: '',
    accountNumber: '',
    accountName: '',
    bvn: '',

    // Operations Data
    deliveryMethod: '',
    preOrderTime: '',
    finalOrderTime: '',
    selectedDay: 'Default',
    openingTime: '00:00 PM',
    closingTime: '00:00 PM',

    // Menu Items Data
    menuCategory: '',
    menuItemName: '',
    menuItemDescription: '',
    menuItemImage: null,

    // Room Menu Data
    roomName: '',
    roomNumber: '',
    roomDescription: '',
    roomAmenities: '',
  });

  // Function to prepare data for API submission
  const prepareSubmissionData = (): SuperForm2SubmissionData => {
    return {
      // Business Documents
      businessType: formData.docBusinessType,
      registeredBusinessName: formData.registeredBusinessName,
      taxId: formData.taxId,
      rcNumber: formData.rcNumber,
      businessDocument: formData.uploadedDocument,

      // Phone Verification
      phone: formData.phone,
      phoneVerified: formData.otp.length === 4, // Assume verified if OTP is 4 digits

      // Profile
      shopName: formData.shopName,
      shopType: formData.shopType,
      profileImage: formData.profileImage,
      businessImage: formData.businessImage,

      // Payment
      bankName: formData.selectedBank,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,
      bvn: formData.bvn,

      // Operations
      deliveryMethod: formData.deliveryMethod,
      preOrderTime: formData.preOrderTime,
      finalOrderTime: formData.finalOrderTime,
      operatingDay: formData.selectedDay,
      openingTime: formData.openingTime,
      closingTime: formData.closingTime,

      // Menu Items
      menuCategory: formData.menuCategory,
      menuItemName: formData.menuItemName,
      menuItemDescription: formData.menuItemDescription,
      menuItemImage: formData.menuItemImage,

      // Room Details
      roomName: formData.roomName,
      roomNumber: formData.roomNumber,
      roomDescription: formData.roomDescription,
      roomAmenities: formData.roomAmenities,
    };
  };

  // Function to handle final submission
  const handleSubmit = async () => {
    const submissionData = prepareSubmissionData();
    
    try {
      console.log('Submitting SuperForm2 data:', submissionData);
      
      // TODO: Replace with your actual API endpoint
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      const result = await response.json();
      console.log('Success:', result);
      
      // Navigate to success page or dashboard
      // navigation.navigate('Dashboard');
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show toast, alert, etc.)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Page 1: Business Documents */}
      {page === 1 && (
        <BusinessDocumentsPage
          data={formData}
          setData={setFormData}
          onNext={() => setPage(2)}
          onBack={() => console.log('Go back to previous flow')}
        />
      )}

      {/* Page 2: Phone Verification (Input) */}
      {page === 2 && (
        <PhoneVerificationPage1
          data={formData}
          setData={setFormData}
          onNext={() => setPage(3)}
          onBack={() => setPage(1)}
        />
      )}

      {/* Page 3: Phone Verification (OTP) */}
      {page === 3 && (
        <PhoneVerificationPage2
          phoneNumber={formData.phone}
          onNext={() => {
            // In a real app, verify OTP here before proceeding
            setPage(4);
          }}
          onBack={() => setPage(2)}
        />
      )}

      {/* Page 4: Profile Completion */}
      {page === 4 && (
        <ProfileCompletionPage
          onNext={() => setPage(5)}
          onBack={() => setPage(3)}
        />
      )}

      {/* Page 5: Payment Setup */}
      {page === 5 && (
        <PaymentPage
          onNext={() => setPage(6)}
          onBack={() => setPage(4)}
        />
      )}

      {/* Page 6: Operations Setup */}
      {page === 6 && (
        <OperationsPage
          onNext={() => setPage(7)}
          onBack={() => setPage(5)}
        />
      )}

      {/* Page 7: Menu Items */}
      {page === 7 && (
        <MenuItemsPage
          onNext={() => setPage(8)}
          onBack={() => setPage(6)}
        />
      )}

      {/* Page 8: Room Menu (Final Page) */}
      {page === 8 && (
        <RoomMenuPage
          onNext={handleSubmit}
          onBack={() => setPage(7)}
        />
      )}
    </View>
  );
}