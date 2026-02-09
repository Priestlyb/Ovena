// ProfilePage.tsx - User profile with collapsible sections
import React from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, Lock, BarChart3, Wallet, Store, Settings,
  Users, Shield, Bell, Key, LogOut, Edit
} from 'lucide-react-native';
import { styles } from '@/constants/styles';
import { profileBookingStyles } from '@/constants/profile-booking-styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';
import { Badge } from '@/components/atoms/Badge';
import { Avatar } from '@/components/atoms/Avatar';

// Custom Components
import { CollapsibleSection } from '@/components/CollapsibleSection';
import { ProfileMenuItem } from '@/components/ProfilemenuItem';

export default function ProfilePage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Header */}
          <View style={profileBookingStyles.profileHeader}>
            <Text variant="h3" weight="bold">Profile</Text>
            <TouchableOpacity onPress={() => console.log('Edit profile')}>
              <Edit size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <Spacer size="lg" />

          {/* User Info */}
          <View style={profileBookingStyles.profileUserInfo}>
            <Avatar
              size="lg"
              
              initials="UC"
            />
            
            <View style={profileBookingStyles.profileRatingBadge}>
              <Text variant="bodySmall" weight="semibold" color="white">
                5.00 ⭐
              </Text>
            </View>
          </View>

          <Spacer size="sm" />

          <Text variant="body" weight="semibold" align="center">
            {'{user_Company}'}
          </Text>
          <Text variant="bodySmall" color="secondary" align="center">
            {'{user_Address}'}
          </Text>

          <Spacer size="xl" />

          {/* Account Settings Section */}
          <CollapsibleSection title="Account Settings" defaultExpanded={true}>
            <ProfileMenuItem
              icon={User}
              label="Your Details"
              onPress={() => router.push('/screens/yourDetails')}
            />
            <ProfileMenuItem
              icon={Lock}
              label="Change password"
              onPress={() => router.push('/screens/changePassword')}
            />
          </CollapsibleSection>

          {/* Store Settings Section */}
          <CollapsibleSection title="Store Settings" defaultExpanded={true}>
            <ProfileMenuItem
              icon={BarChart3}
              label="Store Analytics"
              onPress={() => router.push('/screens/StoreAnalyticsPage')}
              badge={{
                icon: <BarChart3 size={20} color="#FFFFFF" />,
                color: '#000000',
              }}
            />
            <ProfileMenuItem
              icon={Wallet}
              label="Your Finances"
              onPress={() => router.push('/screens/YourFinancesPage')}
              badge={{
                icon: <Wallet size={20} color="#FFFFFF" />,
                color: '#FF6B35',
              }}
            />
            <ProfileMenuItem
              icon={Store}
              label="Store Details"
              onPress={() => router.push('/screens/storeDetails')}
            />
            <ProfileMenuItem
              icon={Settings}
              label="Store Hub"
              onPress={() => router.push('/screens/StoreHubPage')}
            />
            <ProfileMenuItem
              icon={Users}
              label="Manage users"
              onPress={() => router.push('/screens/ManageUsersPage')}
            />
          </CollapsibleSection>

          {/* App Settings Section */}
          <CollapsibleSection title="App Settings" defaultExpanded={true}>
            <ProfileMenuItem
              icon={Shield}
              label="Privacy"
              onPress={() => router.push('/')}
            />
            <ProfileMenuItem
              icon={Bell}
              label="Notifications"
              onPress={() => router.push('/screens/NotificationsPage')}
            />
            <ProfileMenuItem
              icon={Key}
              label="Reset PIN"
              onPress={() => router.push('/screens/ResetTransactionPinPage')}
            />
          </CollapsibleSection>

          <Spacer size="lg" />

          {/* Logout Button */}
          <TouchableOpacity
            style={profileBookingStyles.logoutButton}
            onPress={() => {
              console.log('Logout');
              router.replace('/screens/LoginPage');
            }}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#EF4444" />
            <Text variant="body" weight="semibold" style={{ color: '#EF4444' }}>
              Logout
            </Text>
          </TouchableOpacity>

          <Spacer size="sm" />

          {/* Version */}
          <Text variant="caption" color="secondary" align="center">
            v2.0.3(v699)
          </Text>

          <Spacer size="xxl" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}