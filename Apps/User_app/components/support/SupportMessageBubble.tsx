// components/Support/SupportMessageBubble.tsx

import React from "react";
import { View, Text, Image } from "react-native";

import { Message } from "@/src/types/support";

import { ThemeColors } from "@/constants/theme";

interface SupportMessageBubbleProps {
  message: Message;
  theme: ThemeColors;
}

const getAttachmentUri = (attachment: any): string | null => {
  if (!attachment) return null;

  if (typeof attachment === "string") {
    return attachment;
  }

  return attachment.file || attachment.url || attachment.uri || null;
};

const formatTime = (timestamp?: string) => {
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const SupportMessageBubble = ({
  message,
  theme,
}: SupportMessageBubbleProps) => {
  const attachments = Array.isArray(message.attachments)
    ? message.attachments
    : [];

  switch (message.type) {
    case "system":
      return (
        <View
          style={{
            alignItems: "center",
            marginVertical: 8,
          }}
        >
          <View
            style={{
              backgroundColor: "#F3F4F6",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 999,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
              }}
            >
              {message.timestamp || message.text}
            </Text>
          </View>
        </View>
      );

    case "bot":
    case "agent":
      return (
        <View
          style={{
            backgroundColor: "#E5E7EB",
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: 8,
            borderRadius: 16,
            marginVertical: 15,
            maxWidth: "80%",
          }}
        >
          {!!message.text && (
            <Text
              style={{
                color: "#111827",
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              {message.text}
            </Text>
          )}

          {attachments.map((attachment, index) => {
            const uri = getAttachmentUri(attachment);

            if (!uri) return null;

            return (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 10,
                  marginTop: 8,
                }}
                resizeMode="cover"
              />
            );
          })}

          {!!message.timestamp && (
            <View
              style={{
                marginTop: 4,
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                }}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          )}
        </View>
      );

    case "user":
      return (
        <View
          style={{
            alignSelf: "flex-end",
            backgroundColor: "#D9502E",
            paddingHorizontal: 12,
            paddingTop: 12,
            paddingBottom: 8,
            borderRadius: 16,
            marginVertical: 15,
            maxWidth: "80%",
          }}
        >
          {!!message.text && (
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 15,
                lineHeight: 21,
              }}
            >
              {message.text}
            </Text>
          )}

          {attachments.map((attachment, index) => {
            const uri = getAttachmentUri(attachment);

            if (!uri) return null;

            return (
              <Image
                key={`${uri}-${index}`}
                source={{ uri }}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: 10,
                  marginTop: 8,
                }}
                resizeMode="cover"
              />
            );
          })}

          {!!message.timestamp && (
            <View
              style={{
                marginTop: 4,
                alignItems: "flex-end",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                {formatTime(message.timestamp)}
              </Text>
            </View>
          )}
        </View>
      );

    default:
      return null;
  }
};
