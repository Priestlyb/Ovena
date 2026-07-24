// screen/SupportReports.tsx
import { Spacer } from "@/components/atoms/Spacer";
import { Header } from "@/components/molecules/Header";
import api from "@/services/apiClient";
import { useRouter } from "expo-router";
import { ArrowLeft, Send } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "../../../components/atoms/Text";

interface Ticket {
  id: string | number;
  category: string;
  subject: string;
  description: string;
  priority: string;
  created_at: string;
  status?: "open" | "closed";
}

interface Message {
  id: string | number;
  type: "user" | "agent" | "system";
  text: string;
  timestamp: string;
}

const SupportReportsScreen: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);

  const [ticketStatus, setTicketStatus] = useState<"open" | "closed">("open");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const prevMessageIdsRef = useRef<Set<string | number>>(new Set());

  // ---------------- FETCH TICKETS ----------------
  const fetchTickets = async () => {
    try {
      setLoadingTickets(true);
      const res = await api.get("/business/support/staff/tickets/");
      setTickets(res.data?.results || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    setRefreshing(false);
  };

  // ---------------- FETCH MESSAGES ----------------
  const fetchMessages = async (ticketId: string | number) => {
    try {
      if (messages.length === 0) setLoadingMessages(true);

      const res = await api.get(
        `/business/support/staff/tickets/${ticketId}/messages/`,
      );

      let msgs: any[] = [];

      if (Array.isArray(res.data)) msgs = res.data;
      else if (res.data?.results?.data) msgs = res.data.results.data;

      const parsed: Message[] = msgs.map((msg: any) => ({
        id: msg.id,
        type:
          msg.sender_type === "business_admin"
            ? "user"
            : msg.sender_type === "agent"
              ? "agent"
              : "system",
        text: msg.message,
        timestamp: msg.created_at,
      }));

      const prevIds = prevMessageIdsRef.current;
      const newMessages = parsed.filter((m) => !prevIds.has(m.id));
      const newAgentMessages = newMessages.filter((m) => m.type === "agent");

      if (newAgentMessages.length > 0) {
        Alert.alert("New Support Reply", newAgentMessages[0].text);
      }

      parsed.forEach((m) => prevIds.add(m.id));
      setMessages(parsed);
    } catch (err) {
      console.error(err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const selectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setTicketStatus(ticket.status || "open");
    prevMessageIdsRef.current.clear();
    fetchMessages(ticket.id);
  };

  // ---------------- AUTO REFRESH ----------------
  useEffect(() => {
    if (!selectedTicket) return;

    const interval = setInterval(() => {
      fetchMessages(selectedTicket.id);
    }, 300000);

    return () => clearInterval(interval);
  }, [selectedTicket]);

  // ---------------- TOGGLE CLOSE/REOPEN ----------------
  const toggleTicketStatus = async () => {
    if (!selectedTicket) return;

    setUpdatingStatus(true);

    try {
      if (ticketStatus === "open") {
        await api.post(
          `/business/support/staff/tickets/${selectedTicket.id}/close/`,
        );
      } else {
        await api.post(
          `/business/support/staff/tickets/${selectedTicket.id}/reopen/`,
        );
      }

      const res = await api.get(
        `/business/support/staff/tickets/${selectedTicket.id}/`,
      );

      const updatedTicket = res.data;

      setTicketStatus(updatedTicket.status || "open");

      setSelectedTicket(updatedTicket);

      fetchTickets();
    } catch (err: any) {
      console.error(err?.response?.data || err);

      Alert.alert(
        "Action Failed",
        err?.response?.data?.detail ||
          "Invalid action for current ticket state",
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // ---------------- SEND MESSAGE ----------------
  const sendMessage = async () => {
    if (!inputText.trim() || !selectedTicket) return;

    if (ticketStatus === "closed") {
      Alert.alert("Closed Ticket", "Reopen ticket to send messages");
      return;
    }

    const newMsg: Message = {
      id: Date.now(),
      type: "user",
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
    setSending(true);

    try {
      await api.post(
        `/business/support/staff/tickets/${selectedTicket.id}/messages/`,
        { message: newMsg.text },
      );

      await fetchMessages(selectedTicket.id);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  // ---------------- UI ----------------
  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity onPress={() => selectTicket(item)} style={styles.card}>
      <View style={styles.rowBetween}>
        <Text style={styles.subject}>{item.subject}</Text>
        <View
          style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        >
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        {item.category} • {new Date(item.created_at).toLocaleDateString()}
      </Text>

      <Text style={styles.description}>{item.description}</Text>
    </TouchableOpacity>
  );

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const renderMessages = () => (
    <ScrollView
      ref={scrollViewRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      onContentSizeChange={() =>
        scrollViewRef.current?.scrollToEnd({ animated: true })
      }
    >
      {messages.map((msg) => {
        const isUser = msg.type === "user";

        return (
          <View
            key={msg.id}
            style={[
              styles.messageRow,
              isUser ? styles.alignRight : styles.alignLeft,
            ]}
          >
            <View
              style={[
                styles.bubble,
                isUser ? styles.userBubble : styles.agentBubble,
              ]}
            >
              <Text style={isUser ? styles.userText : styles.agentText}>
                {msg.text}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  // ---------------- CHAT VIEW ----------------
  if (selectedTicket) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Header
            title={selectedTicket.subject}
            leftIcon={<ArrowLeft size={24} color="#111" />}
            onLeftIconPress={() => setSelectedTicket(null)}
            rightContent={
              <TouchableOpacity
                onPress={toggleTicketStatus}
                disabled={updatingStatus}
                style={{
                  backgroundColor:
                    ticketStatus === "open" ? "#EF4444" : "#10B981",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                  opacity: updatingStatus ? 0.6 : 1,
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                  {updatingStatus
                    ? "..."
                    : ticketStatus === "open"
                      ? "Close"
                      : "Reopen"}
                </Text>
              </TouchableOpacity>
            }
          />

          {loadingMessages ? (
            <ActivityIndicator size="large" color="#FF5920" />
          ) : (
            <>
              {renderMessages()}

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder={
                    ticketStatus === "closed"
                      ? "Ticket is closed"
                      : "Type a message..."
                  }
                  value={inputText}
                  onChangeText={setInputText}
                  editable={ticketStatus === "open"}
                />

                <TouchableOpacity
                  style={styles.sendBtn}
                  onPress={sendMessage}
                  disabled={ticketStatus === "closed"}
                >
                  <Send size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ---------------- LIST VIEW ----------------
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Support Tickets"
        leftIcon={<ArrowLeft size={24} color="#111" />}
        onLeftIconPress={() => router.back()}
      />

      <Spacer size="md" />

      {loadingTickets ? (
        <ActivityIndicator size="large" color="#FF5920" />
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderTicket}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default SupportReportsScreen;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingTop: 50 },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  subject: { fontSize: 16, fontWeight: "600" },
  description: { marginTop: 8, color: "#374151" },
  meta: { fontSize: 12, color: "#6B7280", marginTop: 4 },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  priorityText: { color: "#fff", fontSize: 10 },

  messageRow: { marginBottom: 10 },
  alignRight: { alignItems: "flex-end" },
  alignLeft: { alignItems: "flex-start" },

  bubble: {
    padding: 10,
    borderRadius: 12,
    maxWidth: "75%",
  },

  userBubble: { backgroundColor: "#FF5920" },
  agentBubble: { backgroundColor: "#E5E7EB" },

  userText: { color: "#fff" },
  agentText: { color: "#111" },

  time: { fontSize: 10, marginTop: 4, color: "#fff", textAlign: "right" },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 12,
  },

  input: {
    flex: 1,
    height: 60,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    maxHeight: 100,
  },

  sendBtn: {
    backgroundColor: "#FF5920",
    padding: 10,
    borderRadius: 8,
    marginLeft: 8,
  },

  headerSubtitle: {
    textAlign: "center",
    padding: 10,
    color: "#6B7280",
  },
});
