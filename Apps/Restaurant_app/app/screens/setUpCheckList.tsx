// setUpCheckList.tsx - Updated version
import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { ChecklistItem } from '@/components/CheckListItem';
import { styles } from '@/constants/styles';
import { ArrowLeft } from 'lucide-react-native';

interface SetupChecklistPageProps {
  onBack?: () => void;
  onSubmit?: () => void;
}

/**
 * Page 7: Setup Checklist
 */
const SetupChecklistPage: React.FC<SetupChecklistPageProps> = ({ onBack, onSubmit }) => {
  const [checklist, setChecklist] = useState({
    business: false,
    profile: false,
    payments: false,
    operations: false,
    menu: false,
  });

  // Check if all items are completed
  const allCompleted = Object.values(checklist).every(item => item === true);

  const handleSubmit = () => {
    if (allCompleted && onSubmit) {
      onSubmit();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft />
        </TouchableOpacity>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.pageTitle}>Just one more click away to get started</Text>
          <Text style={styles.subtitle}>Your final steps to process orders today!</Text>

          <ChecklistItem
            iconName="🏢"
            text="Verify your business"
            completed={checklist.business}
            onClick={() => setChecklist({ ...checklist, business: !checklist.business })}
          />

          <ChecklistItem
            iconName="👤"
            text="Complete your profile"
            completed={checklist.profile}
            onClick={() => setChecklist({ ...checklist, profile: !checklist.profile })}
          />

          <ChecklistItem
            iconName="💳"
            text="Set up Payments"
            completed={checklist.payments}
            onClick={() => setChecklist({ ...checklist, payments: !checklist.payments })}
          />

          <ChecklistItem
            iconName="⚙️"
            text="Set up your operations"
            completed={checklist.operations}
            onClick={() => setChecklist({ ...checklist, operations: !checklist.operations })}
          />

          <ChecklistItem
            iconName="📋"
            text="Add menu items"
            completed={checklist.menu}
            onClick={() => setChecklist({ ...checklist, menu: !checklist.menu })}
          />
        </ScrollView>

        <TouchableOpacity 
          style={allCompleted ? styles.continueBtn : styles.disabledBtn} 
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={!allCompleted}
        >
          <Text style={allCompleted ? styles.continueBtnText : styles.disabledBtnText}>
            Begin order handling
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SetupChecklistPage;