// SupportPage.tsx - Support chat with categories + dropdown
import api from "@/services/apiClient";
import { useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Atomic Components
import { Badge } from "@/components/atoms/Badge";
import { Spacer } from "@/components/atoms/Spacer";
import { Text } from "@/components/atoms/Text";

// Molecule Components
import { CustomDropdown } from "@/components/CustomDropDown";
import { Header } from "@/components/molecules/Header";

interface Message {
  id: string;
  type: "bot" | "user" | "system";
  text: string;
  timestamp?: string;
}

const SUPPORT_CATEGORIES = [
  "General Inquiry",
  "Technical Issues",
  "Billing & Payments",
  "Account Management",
  "Bug Reports",
  "Feature Requests",
];

export default function SupportPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "system",
      text: "{recent_date}",
      timestamp: new Date().toLocaleDateString(),
    },
    {
      id: "2",
      type: "bot",
      text: "Hi! Welcome to Ovena Support. How can we help?",
    },
  ]);

  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("high");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && !subject) {
      setSubject(category);
    }
  }, [category]);

  const sendTicket = async () => {
    if (!subject.trim() || !description.trim() || !category) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text: description,
    };

    setMessages((prev) => [...prev, userMessage]);
    setDescription("");
    setSubject("");

    setLoading(true);
    try {
      await api.post("/business/support/staff/tickets/", {
        category,
        subject: subject.trim(),
        description: description.trim(),
        priority,
      });

      const botReply: Message = {
        id: Date.now().toString() + "-bot",
        type: "bot",
        text: "Your support ticket has been created successfully. Our team will respond shortly.",
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error: any) {
      console.log("Ticket Error:", error?.response?.data || error.message);

      const errorReply: Message = {
        id: Date.now().toString() + "-error",
        type: "bot",
        text: "Failed to create ticket. Please try again.",
      };

      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? 50 : 0,
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={{ flex: 1 }}>
          <Header
            title="Support"
            leftIcon={<ArrowLeft size={24} color="#111827" />}
            onLeftIconPress={() => router.back()}
            rightContent={
              <TouchableOpacity
                onPress={() => router.push("/screens/staffs/SupportReports")}
              >
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

          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message) => (
              <View key={message.id}>
                {message.type === "system" && (
                  <View style={{ alignItems: "center", marginVertical: 8 }}>
                    <Badge
                      label={message.timestamp || message.text}
                      variant="neutral"
                      size="small"
                    />
                  </View>
                )}

                {message.type === "bot" && (
                  <View style={{ flexDirection: "row", marginVertical: 8 }}>
                    <View style={{ marginRight: 8 }}>
                      <Image
                        source={require("@/assets/images/Resturant_logo 1.png")}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                        resizeMode="cover"
                      />
                    </View>
                    <View
                      style={{
                        backgroundColor: "#E5E7EB",
                        padding: 10,
                        borderRadius: 12,
                        maxWidth: "80%",
                      }}
                    >
                      <Text variant="body" color="primary">
                        {message.text}
                      </Text>
                    </View>
                  </View>
                )}

                {message.type === "user" && (
                  <View
                    style={{
                      alignSelf: "flex-end",
                      backgroundColor: "#FF5920",
                      padding: 10,
                      borderRadius: 12,
                      marginVertical: 8,
                      maxWidth: "80%",
                    }}
                  >
                    <Text variant="body" style={{ color: "#fff" }}>
                      {message.text}
                    </Text>
                  </View>
                )}

                <Spacer size="sm" />
              </View>
            ))}
          </ScrollView>

          <View
            style={{
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: "#E5E7EB",
              backgroundColor: "#F9FAFB",
            }}
          >
            <CustomDropdown
              label="Category"
              placeholder="Select a category"
              options={SUPPORT_CATEGORIES}
              value={category}
              onChange={setCategory}
              required
            />

            <TextInput
              style={{
                height: 60,
                backgroundColor: "#fff",
                padding: 10,
                borderRadius: 8,
                marginBottom: 10,
              }}
              value={subject}
              onChangeText={setSubject}
              placeholder="Subject (brief title)"
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />

            <View
              style={{
                flexDirection: "row",
                marginBottom: 10,
                justifyContent: "space-around",
              }}
            >
              {(["low", "medium", "high"] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => setPriority(p)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 6,
                    backgroundColor: priority === p ? "#ff592099" : "#F3F4F6",
                  }}
                >
                  <Text
                    variant="body"
                    style={{
                      textTransform: "capitalize",
                      fontWeight: priority === p ? "800" : "400",
                      color: priority === p ? "#fff" : "#111",
                    }}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{
                  flex: 1,
                  height: 60,
                  backgroundColor: "#fff",
                  padding: 10,
                  borderRadius: 8,
                  maxHeight: 100,
                }}
                value={description}
                onChangeText={setDescription}
                placeholder="Type your message..."
                placeholderTextColor="#9CA3AF"
                multiline
                editable={!loading}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: "#FF5920",
                  padding: 12,
                  borderRadius: 8,
                  marginLeft: 8,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity:
                    !description.trim() || !category || loading ? 0.5 : 1,
                }}
                onPress={sendTicket}
                disabled={!description.trim() || !category || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FF5920" />
                ) : (
                  <Send
                    size={20}
                    color={description.trim() ? "#FFFFFF" : "#9CA3AF"}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
