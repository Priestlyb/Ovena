// components/support/SupportMessages.tsx

import React from "react";
import { ScrollView } from "react-native";

import { Message } from "@/src/types/support";
import { useTheme } from "@/constants/theme";

import { SupportMessageBubble } from "@/components/support/SupportMessageBubble";

interface SupportMessagesProps {
  messages: Message[];
  scrollViewRef?: React.RefObject<ScrollView | null>;
  autoScroll?: boolean;
  onContentSizeChange?: () => void;
  paddingHorizontal?: number;
  paddingTop?: number;
  paddingBottom?: number;
  showsVerticalScrollIndicator?: boolean;
}

export const SupportMessages = ({
  messages,
  scrollViewRef,
  autoScroll = true,
  onContentSizeChange,
  paddingHorizontal = 20,
  paddingTop = 20,
  paddingBottom = 20,
  showsVerticalScrollIndicator = false,
}: SupportMessagesProps) => {
  const theme = useTheme();

  return (
    <ScrollView
      ref={scrollViewRef}
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={{
        paddingHorizontal,
        paddingTop,
        paddingBottom,
      }}
      onContentSizeChange={() => {
        if (autoScroll) {
          scrollViewRef?.current?.scrollToEnd({
            animated: true,
          });
        }

        onContentSizeChange?.();
      }}
    >
      {messages.map((message) => (
        <SupportMessageBubble
          key={message.id}
          message={message}
          theme={theme}
        />
      ))}
    </ScrollView>
  );
};
