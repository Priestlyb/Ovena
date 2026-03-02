// screens/AppSettingsScreen.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";
import PageHeader from "../components/PageHeader";
import SettingsRow from "../components/SettingsRow";
import { MoonIcon, SoundVoiceIcon, NavigationIcon } from "../components/icons/SettingsIcons";

interface AppSettingsScreenProps {
  onBack: () => void;
}

const AppSettingsScreen: React.FC<AppSettingsScreenProps> = ({ onBack }) => {
  return (
    <ScreenWrapper>
      <PageHeader title="App settings" onBack={onBack} />

      <View style={styles.list}>
        <SettingsRow
          icon={<MoonIcon size={26} color="#111" />}
          title="Night mode"
          subtitle="Always off"
          onPress={() => {}}
          borderBottom
        />
        <SettingsRow
          icon={<SoundVoiceIcon size={26} color="#111" />}
          title="Sounds and voice"
          onPress={() => {}}
          borderBottom
        />
        <SettingsRow
          icon={<NavigationIcon size={24} color="#111" />}
          title="Navigation"
          onPress={() => {}}
          borderBottom={false}
        />
      </View>
    </ScreenWrapper>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});