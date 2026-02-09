// YourFinancesPage.tsx - Wallet and transaction history
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Wallet, Landmark, SlidersHorizontal, MessageCircle } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Spacer } from '@/components/atoms/Spacer';
import { Divider } from '@/components/atoms/Divider';

// Molecule Components
import { Card } from '@/components/molecules/Card';
import { Header } from '@/components/molecules/Header';

// Existing Components
import { FloatingChatButton } from '@/components/FloatingChatButton';

export default function YourFinancesPage() {
  const router = useRouter();
  const [balance] = useState(19550.00);
  const [transactions] = useState([]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#FEF3E7' }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Your Finances"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="lg" />

        {/* Balance Card */}
        <View style={{ paddingHorizontal: 20 }}>
          <Card variant="elevated" padding="lg">
            <Text variant="body" color="secondary" align="center">
              Available Balance
            </Text>
            <Spacer size="xs" />
            <Text variant="h1" weight="bold" align="center">
              ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </Text>
          </Card>
        </View>

        <Spacer size="lg" />

        {/* Action Buttons */}
        <View style={{ paddingHorizontal: 20, flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Button
              label="Withdraw"
              variant="primary"
              size="medium"
              icon={<Wallet size={20} color="#fff" />}
              iconPosition="left"
              onPress={() => router.push('/withdraw')}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Button
              label="Deposit"
              variant="outline"
              size="medium"
              icon={<Landmark size={20} color="#FF6B35" />}
              iconPosition="left"
              onPress={() => router.push('/deposit')}
            />
          </View>
        </View>

        <Spacer size="lg" />

        {/* Create Transaction PIN Link */}
        <TouchableOpacity
          onPress={() => router.push('/reset-transaction-pin')}
          style={{ paddingHorizontal: 20 }}
        >
          <Text variant="body" align="center">
            Create Transaction PIN {'>'} 
          </Text>
        </TouchableOpacity>

        <Spacer size="lg" />

        {/* Transaction History */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text variant="h4" weight="semibold">Transaction History</Text>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <SlidersHorizontal size={20} color="#111827" />
                <Text variant="body" weight="medium">Filter</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <Spacer size="xl" />

        {/* Empty State */}
        {transactions.length === 0 && (
          <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
            <Image
              source={require('@/assets/images/wallet 1.png')}
              style={{ width: 200, height: 200 }}
              resizeMode="contain"
            />
            <Spacer size="md" />
            <Text variant="h3" weight="bold" align="center">
              No transactions yet
            </Text>
            <Spacer size="xs" />
            <Text variant="body" color="secondary" align="center">
              Your transactions will appear here
            </Text>
          </View>
        )}

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