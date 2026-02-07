// superForm.tsx - Updated version
import React, { useState } from 'react';
import { View } from 'react-native';
import LocationPage from './screens/locationPage';
import BusinessDetailsPage from './screens/businessDetails';
import PasswordPage from './screens/passwordCreation';
import EmailVerificationPage from './screens/emailVerification';
import { OvenaFormData, SubmissionData } from '@/types';
import ChecklistPage from './superForm2/checklist';

export default function SuperForm() {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState<OvenaFormData>({
    countries: [
      'Nigeria',
      'Ghana',
      'Kenya',
      'South Africa',
      'United States',
      'United Kingdom',
    ],
    businessTypes: [
      'Restaurant',
      'Fast Food',
      'Cafe',
      'Food Truck',
      'Catering Service',
      'Bakery',
      'Limited Liability Company',
      'Sole Proprietorship',
      'Partnership',
    ],
    registrationOptions: ['Yes', 'No', 'In Progress'],

    selectedCountry: '',
    businessAddress: '',
    businessName: '',
    businessType: '',
    isRegistered: '',
    email: '',
    phone: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  });

  // Track completion status of onboarding steps
  const [completionStatus, setCompletionStatus] = useState({
    location: false,
    businessDetails: false,
    password: false,
    emailVerification: false,
  });

  // Function to prepare data for API submission
  const prepareSubmissionData = (): SubmissionData => {
    return {
      country: formData.selectedCountry,
      businessAddress: formData.businessAddress,
      businessName: formData.businessName,
      businessType: formData.businessType,
      isRegistered: formData.isRegistered,
      email: formData.email,
      phone: formData.phone,
      fullName: formData.fullName,
      password: formData.password,
    };
  };

  // Function to handle final submission
  const handleSubmit = async () => {
    const submissionData = prepareSubmissionData();
    
    try {
      console.log('Submitting data:', submissionData);
      
      // TODO: Replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(submissionData),
      // });
      
      // const result = await response.json();
      // console.log('Success:', result);
      
      // Navigate to success page or dashboard
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (show toast, alert, etc.)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {page === 1 && (
        <LocationPage
          data={formData}
          setData={setFormData}
          onNext={() => {
            setCompletionStatus({ ...completionStatus, location: true });
            setPage(2);
          }}
        />
      )}
      {page === 2 && (
        <BusinessDetailsPage
          data={formData}
          setData={setFormData}
          onNext={() => {
            setCompletionStatus({ ...completionStatus, businessDetails: true });
            setPage(3);
          }}
          onBack={() => setPage(1)}
        />
      )}
      {page === 3 && (
        <PasswordPage
          data={formData}
          setData={setFormData}
          onNext={() => {
            setCompletionStatus({ ...completionStatus, password: true });
            setPage(4);
          }}
          onBack={() => setPage(2)}
        />
      )}
      {page === 4 && (
        <EmailVerificationPage
          data={formData}
          onNext={() => {
            setCompletionStatus({ ...completionStatus, emailVerification: true });
            setPage(5);
          }}
          onBack={() => setPage(3)}
        />
      )}
      {page === 5 && (
        <ChecklistPage
          completionStatus={completionStatus}
          onBack={() => setPage(4)}
          onSubmit={handleSubmit}
          onNavigateToPage={(pageNumber: number) => setPage(pageNumber)}
        />
      )}
    </View>
  );
} 