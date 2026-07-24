// components/support/SupportMessages.tsx

import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { Badge } from "@/components/atoms/Badge";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";
import { Message } from "@/types/support";

interface SupportMessagesProps {
  messages: Message[];
}

export default function SupportMessages({ messages }: SupportMessagesProps) {
  const formatMessageTime = (timestamp?: string) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  const renderAttachments = (message: Message, containerStyle: any) => {
    if (!message.attachments?.length) {
      return null;
    }

    return (
      <View style={containerStyle}>
        {message.attachments.map((attachment) => (
          <TouchableOpacity
            key={attachment.id}
            activeOpacity={0.8}
            onPress={() => {
              if (attachment.file) {
                Linking.openURL(attachment.file);
              }
            }}
          >
            <Image
              source={{
                uri: attachment.file,
              }}
              style={styles.attachmentImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message) => (
        <View key={message.id}>
          {/* SYSTEM DATE */}
          {message.type === "system" && (
            <View style={styles.systemContainer}>
              <Badge label={message.text} variant="neutral" size="small" />
            </View>
          )}

          {/* AGENT MESSAGE */}
          {message.type === "agent" && (
            <View style={styles.agentContainer}>
              <View style={styles.avatarContainer}>
                <Image
                  source={require("@/assets/images/SupportLogo.png")}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              </View>

              <View style={styles.agentBubble}>
                {!!message.text && (
                  <Text variant="body" color="primary">
                    {message.text}
                  </Text>
                )}

                {renderAttachments(message, styles.attachmentContainer)}

                <Text variant="caption" color="secondary" style={styles.time}>
                  {formatMessageTime(message.timestamp)}
                </Text>
              </View>
            </View>
          )}

          {/* USER MESSAGE */}
          {message.type === "user" && (
            <View style={styles.userBubble}>
              {!!message.text && (
                <Text variant="body" style={styles.userText}>
                  {message.text}
                </Text>
              )}

              {renderAttachments(message, styles.userAttachmentContainer)}

              <Text variant="caption" style={styles.userTime}>
                {formatMessageTime(message.timestamp)}
              </Text>
            </View>
          )}

          <Spacer size="sm" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  systemContainer: {
    alignItems: "center",
    marginVertical: 8,
  },

  agentContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },

  avatarContainer: {
    marginRight: 8,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  agentBubble: {
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 12,
    maxWidth: "80%",
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#FF5920",
    padding: 10,
    borderRadius: 12,
    marginVertical: 8,
    maxWidth: "80%",
  },

  userText: {
    color: "#FFFFFF",
  },

  attachmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  userAttachmentContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },

  attachmentImage: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F3F4F6",
  },

  time: {
    marginTop: 4,
    fontSize: 11,
  },

  userTime: {
    marginTop: 4,
    fontSize: 11,
    color: "#F3F4F6",
    alignSelf: "flex-end",
  },
});
