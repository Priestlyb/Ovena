// setUpCheckList.tsx - Updated version
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChecklistItem } from '@/components/CheckListItem';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface CompletionStatus {
  location: boolean;
  businessDetails: boolean;
  password: boolean;
  emailVerification: boolean;
}

interface SetupChecklistPageProps {
  completionStatus: CompletionStatus;
  onBack?: () => void;
  onSubmit?: () => void;
  onNavigateToPage?: (page: number) => void;
}

/**
 * Onboarding Checklist Page
 */
const SetupChecklistPage: React.FC<SetupChecklistPageProps> = ({ 
  completionStatus,
  onBack, 
  onSubmit,
  onNavigateToPage 
}) => {
  // Calculate if all initial onboarding steps are completed
  const onboardingCompleted = Object.values(completionStatus).every(item => item === true);

  const handleNavigateToPage = (page: number) => {
    if (onNavigateToPage) {
      onNavigateToPage(page);
    }
  };

  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
        </TouchableOpacity>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>Complete your setup to get started</Text>
          <Text style={styles.subtitle}>Finish these steps to start processing orders!</Text>

          {/* <ChecklistItem
            iconName="📍"
            text="Set your location"
            completed={completionStatus.location}
            link={completionStatus.location ? "Location added" : "Add location"}
            onPress={() => handleNavigateToPage(1)}
          />

          <ChecklistItem
            iconName="🏢"
            text="Business details"
            completed={completionStatus.businessDetails}
            link={completionStatus.businessDetails ? "Details added" : "Add business details"}
            onPress={() => handleNavigateToPage(2)}
          />

          <ChecklistItem
            iconName="🔒"
            text="Create password"
            completed={completionStatus.password}
            link={completionStatus.password ? "Password set" : "Set your password"}
            onPress={() => handleNavigateToPage(3)}
          />

          <ChecklistItem
            iconName="✉️"
            text="Verify email"
            completed={completionStatus.emailVerification}
            link={completionStatus.emailVerification ? "Email verified" : "Verify your email"}
            onPress={() => handleNavigateToPage(4)}
          /> */}

          {/* Additional setup items - these could link to other pages/features */}
          {/* <View style={styles.divider} /> */}
          
          <Text style={styles.sectionTitle}>Additional Setup (Optional)</Text>

          <ChecklistItem
            iconName="👤"
            text="Complete your profile"
            completed={false}
            link="Go to profile settings"
            onPress={() => {
              router.push('/superForm2');
              console.log('Navigate to superForm2');
            }}
          />

          <ChecklistItem
            iconName="💳"
            text="Set up payments"
            completed={false}
            link="Configure payment methods"
            onPress={() => {
              // Navigate to payment setup
              console.log('Navigate to payment setup');
            }}
          />

          <ChecklistItem
            iconName="⚙️"
            text="Set up operations"
            completed={false}
            link="View operations setup"
            onPress={() => {
              // Navigate to operations setup
              console.log('Navigate to operations setup');
            }}
          />

          <ChecklistItem
            iconName="📋"
            text="Add menu items"
            completed={false}
            link="Create your menu"
            onPress={() => {
              // Navigate to menu creation
              console.log('Navigate to menu creation');
            }}
          />

          <ChecklistItem
            iconName="📋"
            text="Add menu items"
            completed={false}
            link="Create your menu"
            onPress={() => {
              // Navigate to menu creation
              console.log('Navigate to menu creation');
            }}
          />



        </ScrollView>

        <TouchableOpacity 
          style={onboardingCompleted ? styles.continueBtn : styles.disabledBtn} 
          activeOpacity={0.8}
          onPress={onSubmit}
          disabled={!onboardingCompleted}
        >
          <Text style={onboardingCompleted ? styles.continueBtnText : styles.disabledBtnText}>
            {onboardingCompleted ? 'Begin order handling' : 'Complete required steps'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SetupChecklistPage;