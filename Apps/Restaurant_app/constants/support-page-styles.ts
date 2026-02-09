// support-page-styles.ts - Styles for Support/Chat page

import { StyleSheet } from 'react-native';

export const supportPageStyles = StyleSheet.create({
  // System Message (Date Badge)
  systemMessageContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },

  // Bot Message
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  botAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  botBubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    padding: 12,
    maxWidth: '75%',
  },

  // User Message
  userMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  userBubble: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    borderTopRightRadius: 4,
    padding: 12,
    maxWidth: '75%',
  },

  // Quick Reply Buttons
  quickReplyButton: {
    backgroundColor: '#FF6B35',
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    alignItems: 'flex-start',
  },

  // Input Area
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 12,
    fontSize: 16,
    color: '#111827',
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
});