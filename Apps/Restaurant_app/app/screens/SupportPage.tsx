// SupportPage.tsx - Customer support chat interface
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Send } from 'lucide-react-native';
import { styles } from '@/constants/styles';
import { supportPageStyles } from '@/constants/support-page-styles';

// Atomic Components
import { Text } from '@/components/atoms/Text';
import { Spacer } from '@/components/atoms/Spacer';
import { Badge } from '@/components/atoms/Badge';

// Molecule Components
import { Header } from '@/components/molecules/Header';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  text: string;
  timestamp?: string;
}

interface QuickReply {
  id: string;
  text: string;
}

export default function SupportPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      text: '{recent_date}',
      timestamp: new Date().toLocaleDateString(),
    },
    {
      id: '2',
      type: 'bot',
      text: 'What brings you here today?',
    },
  ]);

  const [inputText, setInputText] = useState('');

  const quickReplies: QuickReply[] = [
    {
      id: '1',
      text: 'My order has been delayed/ I need an update with my order',
    },
    {
      id: '2',
      text: 'An item is missing from my order',
    },
    {
      id: '3',
      text: 'I want to transfer the funds in my wallet back to my bank account.',
    },
  ];


  const handleQuickReply = (reply: QuickReply) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: reply.text,
    };
    setMessages([...messages, newMessage]);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        text: inputText,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View style={{ flex: 1 }}>
          {/* Header */}
          <Header
            title="Support"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.back()}
          />

          <Spacer size="md" />

          {/* Info Banner */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text variant="body" align="center" color="secondary">
              Our typical response time is under
            </Text>
            <Text variant="body" align="center" weight="semibold">
              20 minutes.
            </Text>
            <Spacer size="sm" />
            <Text variant="bodySmall" align="center" color="secondary">
              Hi! Welcome to Ovena Support. How can we help?
            </Text>
          </View>

          <Spacer size="md" />

          {/* Chat Messages */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View key={message.id}>
                {message.type === 'system' && (
                  <View style={supportPageStyles.systemMessageContainer}>
                    <Badge
                      label={message.timestamp || message.text}
                      variant="neutral"
                      size="small"
                    />
                  </View>
                )}

                {message.type === 'bot' && (
                  <View style={supportPageStyles.botMessageContainer}>
                    {/* Bot Avatar */}
                    <View style={supportPageStyles.botAvatar}>
                      <Image
                        source={require('@/assets/images/favicon.png')}
                        style={supportPageStyles.avatarImage}
                        resizeMode="cover"
                      />
                    </View>

                    {/* Bot Message Bubble */}
                    <View style={supportPageStyles.botBubble}>
                      <Text variant="body" color="primary">
                        {message.text}
                      </Text>
                    </View>
                  </View>
                )}

                {message.type === 'user' && (
                  <View style={supportPageStyles.userMessageContainer}>
                    <View style={supportPageStyles.userBubble}>
                      <Text variant="body" color="white">
                        {message.text}
                      </Text>
                    </View>
                  </View>
                )}

                <Spacer size="md" />
              </View>
            ))}

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <View>
                {quickReplies.map((reply) => (
                  <TouchableOpacity
                    key={reply.id}
                    style={supportPageStyles.quickReplyButton}
                    onPress={() => handleQuickReply(reply)}
                    activeOpacity={0.7}
                  >
                    <Text variant="body" color="white">
                      {reply.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={supportPageStyles.inputContainer}>
            <TextInput
              style={supportPageStyles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type your message..."
              placeholderTextColor="#9CA3AF"
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                supportPageStyles.sendButton,
                !inputText.trim() && supportPageStyles.sendButtonDisabled,
              ]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Send size={20} color={inputText.trim() ? '#FFFFFF' : '#9CA3AF'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}