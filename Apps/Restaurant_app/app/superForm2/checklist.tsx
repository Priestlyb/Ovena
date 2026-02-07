// app/superForm2/checklist.tsx - Router-based checklist
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ChecklistItem } from '@/components/CheckListItem';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';
import { useCompletionStore, useIsAllComplete } from '@/stores/completionStore';

export default function ChecklistPage() {
  const router = useRouter();
  const completionStatus = useCompletionStore((state) => state.completionStatus);
  const isAllComplete = useIsAllComplete();

  const handleGroupPress = (group: number, groupName: string, route: string) => {
    console.log(`[Checklist] Navigating to Group ${group}: ${groupName}`);
    router.push(route);
  };

  const handleSubmit = () => {
    console.log('[Checklist] Button clicked');
    console.log('[Checklist] isAllComplete:', isAllComplete);
    console.log('[Checklist] completionStatus:', completionStatus);
    
    if (isAllComplete) {
      console.log('[Checklist] All groups complete - Begin order handling');
      console.log('[Checklist] Navigating to dashboard');
      
      // Replace current route with dashboard (can't go back to checklist)
      router.replace('/(tabs)');
    } else {
      const completedCount = Object.values(completionStatus).filter(Boolean).length;
      console.log(`[Checklist] Cannot submit - ${completedCount}/5 groups complete`);
      console.log('[Checklist] Incomplete groups:', 
        Object.entries(completionStatus)
          .filter(([_, completed]) => !completed)
          .map(([group]) => group)
      );
    }
  };

  const completedCount = Object.values(completionStatus).filter(Boolean).length;

  // Debug logging
  React.useEffect(() => {
    console.log('[Checklist] Render - completionStatus:', completionStatus);
    console.log('[Checklist] Render - isAllComplete:', isAllComplete);
    console.log('[Checklist] Render - completedCount:', completedCount);
  }, [completionStatus, isAllComplete, completedCount]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.checklistContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <ScrollView style={styles.checklistContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.checklistMainTitle}>Just one more click away</Text>
          <Text style={styles.checklistMainTitle}>to get started</Text>
          <Text style={styles.checklistSubtitle}>Your final steps to process orders today!</Text>

          {/* Group 1: Verify Business */}
          <ChecklistItem
            iconName="📄"
            text="Verify your business"
            completed={completionStatus.verifyBusiness}
        
            onPress={() => handleGroupPress(1, 'Verify your business', '/superForm2/business-documents')}
          />

          {/* Group 2: Complete Profile */}
          <ChecklistItem
            iconName="👤"
            text="Complete your profile"
            completed={completionStatus.completeProfile}
        
            onPress={() => handleGroupPress(2, 'Complete your profile', '/superForm2/profile')}
          />

          {/* Group 3: Setup Payments */}
          <ChecklistItem
            iconName="💳"
            text="Set up Payments"
            completed={completionStatus.setupPayments}
        
            onPress={() => handleGroupPress(3, 'Set up Payments', '/superForm2/payments')}
          />

          {/* Group 4: Setup Operations */}
          <ChecklistItem
            iconName="⚙️"
            text="Set up your operations"
            completed={completionStatus.setupOperations}
        
            onPress={() => handleGroupPress(4, 'Set up your operations', '/superForm2/operations')}
          />

          {/* Group 5: Add Menu Items */}
          <ChecklistItem
            iconName="🍽️"
            text="Add menu items"
            completed={completionStatus.addMenuItems}
        
            onPress={() => handleGroupPress(5, 'Add menu items', '/superForm2/menu-items')}
          />

          {/* Progress Indicator */}
          <View style={{ marginTop: 24 }}>
            <Text style={styles.checklistSubtitle}>
              {completedCount} of 5 groups completed
            </Text>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Begin Order Handling Button */}
        <TouchableOpacity 
          style={isAllComplete ? styles.beginOrderBtn : styles.beginOrderBtnDisabled} 
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={!isAllComplete}
        >
          <Text style={styles.beginOrderBtnText}>
            {isAllComplete ? 'Begin order handling' : `Complete ${5 - completedCount} more ${5 - completedCount === 1 ? 'group' : 'groups'}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}