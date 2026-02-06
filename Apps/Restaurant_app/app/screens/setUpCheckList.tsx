// setUpCheckList-superform2.tsx - Checklist for SuperForm2 ONLY
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChecklistItem } from '@/components/CheckListItem';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface CompletionStatus {
  businessDocuments: boolean;
  phoneVerification: boolean;
  phoneOTP: boolean;
  profileCompletion: boolean;
  payment: boolean;
  operations: boolean;
  menuItems: boolean;
  roomMenu: boolean;
}

interface SetupChecklistPageProps {
  completionStatus: CompletionStatus;
  onBack?: () => void;
  onSubmit?: () => void;
  onNavigateToPage?: (page: number) => void;
}

const SetupChecklistPage: React.FC<SetupChecklistPageProps> = ({ 
  completionStatus,
  onBack, 
  onSubmit,
  onNavigateToPage 
}) => {
  // Calculate if all steps are completed
  const allCompleted = Object.values(completionStatus).every(item => item === true);
  const router = useRouter()
  const handleNavigateToPage = (page: number) => {
    if (onNavigateToPage) {
      onNavigateToPage(page);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
        </TouchableOpacity>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>Complete your setup</Text>
          <Text style={styles.subtitle}>Review and complete all required steps</Text>

          {/* SuperForm2 Pages Only */}
          
          <ChecklistItem
            iconName="📄"
            text="Business Documents"
            completed={completionStatus.businessDocuments}
            link={completionStatus.businessDocuments ? "Documents uploaded" : "Upload documents"}
            onPress={() => router.push('/superForm2')}
          />

          <ChecklistItem
            iconName="📱"
            text="Phone Number"
            completed={completionStatus.phoneVerification}
            link={completionStatus.phoneVerification ? "Phone number added" : "Add phone number"}
            onPress={() => router.push('/screens/phoneVerification')}
          />

          <ChecklistItem
            iconName="🔐"
            text="Verify Phone"
            completed={completionStatus.phoneOTP}
            link={completionStatus.phoneOTP ? "Phone verified" : "Enter verification code"}
            onPress={() => handleNavigateToPage(3)}
          />

          <ChecklistItem
            iconName="👤"
            text="Complete Profile"
            completed={completionStatus.profileCompletion}
            link={completionStatus.profileCompletion ? "Profile completed" : "Add shop details"}
            onPress={() => handleNavigateToPage(4)}
          />

          <ChecklistItem
            iconName="💳"
            text="Payment Setup"
            completed={completionStatus.payment}
            link={completionStatus.payment ? "Payment configured" : "Add bank details"}
            onPress={() => handleNavigateToPage(5)}
          />

          <ChecklistItem
            iconName="⚙️"
            text="Operations Setup"
            completed={completionStatus.operations}
            link={completionStatus.operations ? "Operations configured" : "Set delivery & hours"}
            onPress={() => handleNavigateToPage(6)}
          />

          <ChecklistItem
            iconName="🍽️"
            text="Menu Items"
            completed={completionStatus.menuItems}
            link={completionStatus.menuItems ? "Menu item added" : "Add first product"}
            onPress={() => handleNavigateToPage(7)}
          />

          <ChecklistItem
            iconName="🏨"
            text="Room Details"
            completed={completionStatus.roomMenu}
            link={completionStatus.roomMenu ? "Room details added" : "Add room information"}
            onPress={() => handleNavigateToPage(8)}
          />

          {/* Progress indicator */}
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>
              {Object.values(completionStatus).filter(Boolean).length} of 8 steps completed
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${(Object.values(completionStatus).filter(Boolean).length / 8) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity 
          style={allCompleted ? styles.continueBtn : styles.disabledBtn} 
          activeOpacity={0.8}
          onPress={onSubmit}
          disabled={!allCompleted}
        >
          <Text style={allCompleted ? styles.continueBtnText : styles.disabledBtnText}>
            {allCompleted ? 'Complete Setup' : `Complete ${8 - Object.values(completionStatus).filter(Boolean).length} more steps`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SetupChecklistPage;