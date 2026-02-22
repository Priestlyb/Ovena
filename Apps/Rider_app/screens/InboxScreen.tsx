// screens/InboxScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import PageHeader from "../components/PageHeader";
import ScreenWrapper from "../components/ScreenWrapper";

interface InboxScreenProps {
  onBack: () => void;
}

const MESSAGES = [
  { id: "1", sender: "Ovena Support", time: "10:00 am" },
  { id: "2", sender: "Trip Update", time: "10:00 am" },
];

const InboxScreen: React.FC<InboxScreenProps> = ({ onBack }) => {
  const rightElement = (
    <TouchableOpacity>
      <Text style={styles.markAll}>mark all as read</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <PageHeader title="Inbox" onBack={onBack} rightElement={rightElement} />

      <FlatList
        data={MESSAGES}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.messageCard} activeOpacity={0.75}>
            <View style={styles.messageAvatar} />
            <View style={styles.messageBody}>
              <Text style={styles.messageSender}>{item.sender}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  markAll: {
    fontSize: 13,
    color: "#777",
    fontWeight: "400",
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FFF3E8",
    borderRadius: 14,
    padding: 16,
  },
  messageAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    flexShrink: 0,
  },
  messageBody: {
    flex: 1,
  },
  messageSender: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 13,
    color: "#999",
    textAlign: "right",
  },
});