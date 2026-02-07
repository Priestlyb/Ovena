// ManageUsersPage.tsx - Manage admin staff and vendor agents
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, MessageCircle, Smartphone } from 'lucide-react-native';
import { styles } from '@/constants/styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Spacer } from '@/components/atoms/Spacer';
import { Badge } from '@/components/atoms/Badge';

// Molecule Components
import { Card } from '@/components/molecules/Card';
import { Header } from '@/components/molecules/Header';

// Existing Components
import { TabBar } from '@/components/TabBar';
import { FloatingActionButton } from '@/components/FloatingActionButton';

interface Device {
  id: string;
  name: string;
  lastActive: string;
}

interface AdminUser {
  id: string;
  name: string;
  role: string;
}

export default function ManageUsersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'admin' | 'vendor'>('admin');
  
  const [devices] = useState<Device[]>([
    { id: '1', name: 'Samsung A20', lastActive: 'today at 11:18 pm' },
  ]);

  const [adminUsers] = useState<AdminUser[]>([
    { id: '1', name: '{User_Name}', role: 'Admin' },
  ]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header
          title="Manage Users"
          leftIcon={<ArrowLeft size={24} color="#111827" />}
          onLeftIconPress={() => router.back()}
        />

        <Spacer size="md" />

        {/* Tab Bar */}
        <TabBar
          tabs={[
            { id: 'admin', label: 'Admin Staff' },
            { id: 'vendor', label: 'Vendor Agent' },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as 'admin' | 'vendor')}
        />

        <Spacer size="lg" />

        {/* Admin Staff Tab */}
        {activeTab === 'admin' && (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Header Row */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}>
              <Text variant="h4" weight="semibold">Manage Users</Text>
              <TouchableOpacity onPress={() => router.push('/invite-user')}>
                <Text variant="body" weight="medium" style={{ color: '#FF6B35' }}>
                  + Invite new user
                </Text>
              </TouchableOpacity>
            </View>

            {/* Admin Users List */}
            {adminUsers.map((user) => (
              <Card
                key={user.id}
                variant="filled"
                padding="md"
                style={{ marginBottom: 12 }}
              >
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <User size={20} color="#111827" />
                    <Text variant="body">{user.name}</Text>
                  </View>

                  <Badge
                    label={user.role}
                    variant="neutral"
                    size="small"
                  />
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Vendor Agent Tab */}
        {activeTab === 'vendor' && (
          <View style={{ paddingHorizontal: 20 }}>
            {/* Illustration */}
            <View style={{
              backgroundColor: '#F3F4F6',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              marginBottom: 24,
            }}>
              <Image
                source={require('@/assets/images/team-illustration.png')}
                style={{ width: 300, height: 200 }}
                resizeMode="contain"
              />
              <Spacer size="md" />
              <Text variant="body" color="secondary" align="center">
                You can link other device to this account
              </Text>
            </View>

            {/* Device Status Section */}
            <Text variant="h4" weight="semibold">Device Status</Text>
            <Spacer size="xs" />
            <Text variant="body" color="secondary">
              Tap a device to log out
            </Text>

            <Spacer size="lg" />

            {/* Devices List */}
            {devices.map((device) => (
              <Card
                key={device.id}
                variant="elevated"
                padding="md"
                style={{ marginBottom: 12 }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <View style={{
                    width: 50,
                    height: 50,
                    backgroundColor: '#F9FAFB',
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Smartphone size={28} color="#111827" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text variant="body" weight="semibold">{device.name}</Text>
                    <Text variant="bodySmall" color="secondary">
                      Last active {device.lastActive}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}

            <Spacer size="lg" />

            {/* Link a Device Button */}
            <Button
              label="Link a device"
              variant="primary"
              size="large"
              fullWidth
              onPress={() => router.push('/link-device')}
            />
          </View>
        )}

        <Spacer size="xxl" />
      </ScrollView>

      {/* Floating Chat Button */}
      <FloatingActionButton
        icon={<MessageCircle size={28} color="#fff" />}
        onPress={() => console.log('Chat')}
        position="primary"
      />
    </SafeAreaView>
  );
}