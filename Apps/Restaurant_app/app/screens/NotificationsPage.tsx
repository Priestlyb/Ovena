// NotificationsPage.tsx - Manage notification settings
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';
import { Divider } from '@/components/atoms/Divider';

// Molecule Components
import { Header } from '@/components/molecules/Header';

// Existing Components
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { FloatingChatButton } from '@/components/FloatingChatButton';

export default function NotificationsPage() {
  const router = useRouter();
  const [repeatedNotifications, setRepeatedNotifications] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Notifications"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="lg" />

        <View style={{ paddingHorizontal: 20 }}>
          {/* Section Title */}
          <Text variant="h4" weight="semibold">Manage Notifications</Text>
          
          <Spacer size="sm" />
          <Divider />
          <Spacer size="lg" />

          {/* Notification Toggle */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Text variant="body" color="primary">
              Turn on repeated notifications
            </Text>
            
            <ToggleSwitch
              value={repeatedNotifications}
              onChange={setRepeatedNotifications}
            />
          </View>
        </View>

        <Spacer size="xxl" />
      </ScrollView>

      {/* Floating Chat Button */}
      <FloatingChatButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => console.log('Chat')}
        position="primary"
      />
    </SafeAreaView>
  );
}