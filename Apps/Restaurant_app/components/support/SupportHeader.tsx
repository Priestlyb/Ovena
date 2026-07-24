// components/support/SupportPageHeader.tsx

import { ArrowLeft } from "lucide-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { Header } from "@/components/molecules/Header";

interface SupportPageHeaderProps {
  onBack: () => void;
  onReports: () => void;
}

export default function SupportHeader({
  onBack,
  onReports,
}: SupportPageHeaderProps) {
  return (
    <>
      <Header
        title="Support"
        leftIcon={<ArrowLeft size={24} color="#111827" />}
        onLeftIconPress={onBack}
        rightContent={
          <TouchableOpacity onPress={onReports}>
            <Text>Reports</Text>
          </TouchableOpacity>
        }
      />

      <Spacer size="md" />

      <View style={{ paddingHorizontal: 20 }}>
        <Text variant="body" align="center" color="secondary">
          Our typical response time is under
        </Text>

        <Text variant="body" align="center" weight="semibold">
          20 minutes.
        </Text>
      </View>

      <Spacer size="md" />
    </>
  );
}
