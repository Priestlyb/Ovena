import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChecklistItem } from '@/components/CheckListItem';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';

interface CompletionStatus {
  verifyBusiness: boolean;
  completeProfile: boolean;
  setupPayments: boolean;
  setupOperations: boolean;
  addMenuItems: boolean;
}

interface SetupChecklistPageProps {
  completionStatus: CompletionStatus;
  onBack?: () => void;
  onSubmit?: () => void;
  onNavigateToGroup: (group: number) => void;
}

const SetupChecklistPage: React.FC<SetupChecklistPageProps> = ({
  completionStatus,
  onBack,
  onSubmit,
  onNavigateToGroup,
}) => {
  const allCompleted = Object.values(completionStatus).every(Boolean);
  const completedCount = Object.values(completionStatus).filter(Boolean).length;

  const handleGroupPress = (group: number, name: string) => {
    console.log(`[Checklist] Navigating to Group ${group}: ${name}`);
    onNavigateToGroup(group);
  };

  const handleSubmit = () => {
    if (!allCompleted) {
      console.log(`[Checklist] ${completedCount}/5 groups complete`);
      return;
    }

    console.log('[Checklist] All groups complete');
    onSubmit?.();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.checklistContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>

        <ScrollView style={styles.checklistContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.checklistMainTitle}>Just one more click away</Text>
          <Text style={styles.checklistMainTitle}>to get started</Text>
          <Text style={styles.checklistSubtitle}>
            Your final steps to process orders today!
          </Text>

          <ChecklistItem
            iconName="📄"
            text="Verify your business"
            completed={completionStatus.verifyBusiness}
            onPress={() => handleGroupPress(1, 'Verify your business')}
          />

          <ChecklistItem
            iconName="👤"
            text="Complete your profile"
            completed={completionStatus.completeProfile}
            onPress={() => handleGroupPress(2, 'Complete your profile')}
          />

          <ChecklistItem
            iconName="💳"
            text="Set up payments"
            completed={completionStatus.setupPayments}
            onPress={() => handleGroupPress(3, 'Set up payments')}
          />

          <ChecklistItem
            iconName="⚙️"
            text="Set up your operations"
            completed={completionStatus.setupOperations}
            onPress={() => handleGroupPress(4, 'Set up your operations')}
          />

          <ChecklistItem
            iconName="🍽️"
            text="Add menu items"
            completed={completionStatus.addMenuItems}
            onPress={() => handleGroupPress(5, 'Add menu items')}
          />

          <View style={{ height: 20 }} />
        </ScrollView>

        <TouchableOpacity
          style={allCompleted ? styles.beginOrderBtn : styles.beginOrderBtnDisabled}
          onPress={handleSubmit}
          disabled={!allCompleted}
        >
          <Text style={styles.beginOrderBtnText}>Begin order handling</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SetupChecklistPage;
