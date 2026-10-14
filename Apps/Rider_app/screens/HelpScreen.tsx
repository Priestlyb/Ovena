// screens/HelpScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PageHeader from '../components/PageHeader';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTheme } from '../context/ThemeContext';
import { useDriverTickets } from '../hooks/useDriverTickets';
import { useDriverTicketMessages, OptimisticMessage } from '../hooks/useDriverTicketMessages';
import { SupportTicket, TicketPriority } from '../types/driverHelp';

interface HelpScreenProps {
  onBack: () => void;
}

const CATEGORIES = ['Technical', 'Account Issues', 'Trip Problems', 'Earning & Payout', 'Vehicle & Documents', 'Safety'];

// ── Priority badge helpers ────────────────────────────────────────────────────
function priorityColor(colors: ReturnType<typeof useTheme>['colors'], p: TicketPriority) {
  if (p === 'high') return colors.accentRed;
  if (p === 'medium') return colors.accentYellow;
  return colors.accentGreen;
}

function statusColor(colors: ReturnType<typeof useTheme>['colors'], status: string) {
  return status === 'open' ? colors.accentGreen : colors.textMuted;
}

// ── Ticket row ────────────────────────────────────────────────────────────────
function TicketRow({ ticket, onPress }: { ticket: SupportTicket; onPress: () => void }) {
  const { colors } = useTheme();
  const date = new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <TouchableOpacity
      style={[styles.ticketRow, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.ticketRowTop}>
        <Text style={[styles.ticketSubject, { color: colors.textPrimary }]} numberOfLines={1}>
          {ticket.subject}
        </Text>
        <View style={[styles.priorityDot, { backgroundColor: priorityColor(colors, ticket.priority) }]} />
      </View>
      <Text style={[styles.ticketCategory, { color: colors.textSecondary }]}>{ticket.category}</Text>
      <View style={styles.ticketRowBottom}>
        <View style={styles.statusPill}>
          <View style={[styles.statusDot, { backgroundColor: statusColor(colors, ticket.status) }]} />
          <Text style={[styles.statusText, { color: colors.textMuted }]}>{ticket.status.toUpperCase()}</Text>
        </View>
        <Text style={[styles.ticketDate, { color: colors.textMuted }]}>{date}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Message bubble (chat sub-view) ────────────────────────────────────────────
function MessageBubble({
  msg,
  isDriver,
  onRetry,
}: {
  msg: OptimisticMessage;
  isDriver: boolean;
  onRetry: (id: string) => void;
}) {
  const { colors } = useTheme();
  const time = new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <View style={[styles.msgRow, isDriver ? styles.msgRowDriver : styles.msgRowAdmin]}>
      <View
        style={[
          styles.bubble,
          isDriver
            ? { backgroundColor: colors.accentDark, borderTopRightRadius: 4 }
            : { backgroundColor: colors.cardSecondary, borderTopLeftRadius: 4, borderWidth: 1, borderColor: colors.cardBorder },
          { opacity: msg.pending ? 0.6 : 1 },
        ]}
      >
        <Text style={{ color: isDriver ? colors.textOnAccent : colors.textPrimary, fontSize: 14, lineHeight: 20 }}>
          {msg.message}
        </Text>
      </View>
      <View style={{ marginHorizontal: 4 }}>
        {msg.pending && <Text style={[styles.timeLabel, { color: colors.textMuted }]}>Sending…</Text>}
        {msg.failed && (
          <TouchableOpacity onPress={() => onRetry(msg.id)}>
            <Text style={[styles.timeLabel, { color: colors.accentRed }]}>Failed — tap to retry</Text>
          </TouchableOpacity>
        )}
        {!msg.pending && !msg.failed && (
          <Text style={[styles.timeLabel, { color: colors.textMuted, alignSelf: isDriver ? 'flex-end' : 'flex-start' }]}>
            {time}
          </Text>
        )}
      </View>
    </View>
  );
}

// ── Chat sub-view ─────────────────────────────────────────────────────────────
function TicketChatView({ ticket, onBack }: { ticket: SupportTicket; onBack: () => void }) {
  const { colors } = useTheme();
  const { messages, loading, error, sending, sendMessage, retryMessage, isFromDriver } =
    useDriverTicketMessages(ticket.id);
  const [inputText, setInputText] = useState('');
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || sending) return;
    setInputText('');
    sendMessage(trimmed);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={[styles.chatTopBar, { borderBottomColor: colors.separatorColor }]}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="arrow-back" size={22} color={colors.iconColor} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.chatTopBarTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {ticket.subject}
          </Text>
          <Text style={[styles.chatTopBarSub, { color: colors.textMuted }]}>
            {ticket.category} · {ticket.status.toUpperCase()}
          </Text>
        </View>
        <View style={[styles.priorityChip, { backgroundColor: priorityColor(colors, ticket.priority) }]}>
          <Text style={styles.priorityChipText}>{ticket.priority.toUpperCase()}</Text>
        </View>
      </View>

      {loading && messages.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.accentOrange} />
        </View>
      ) : (
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={m => m.id}
          contentContainerStyle={styles.chatContent}
          ListHeaderComponent={
            !loading && messages.length === 0 && !error ? (
              <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 24 }}>
                No messages yet — start the conversation below.
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <MessageBubble msg={item} isDriver={isFromDriver(item)} onRetry={retryMessage} />
          )}
        />
      )}

      {!!error && (
        <Text style={{ color: colors.accentRed, textAlign: 'center', marginBottom: 8 }}>{error}</Text>
      )}

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.separatorColor }]}>
        <View style={[styles.inputWrap, { backgroundColor: colors.inputBg }]}>
          <TextInput
            style={[styles.chatInput, { color: colors.textPrimary }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
        </View>
        <TouchableOpacity
          style={[styles.sendBtn, { backgroundColor: colors.accentOrange, opacity: sending ? 0.6 : 1 }]}
          onPress={handleSend}
          disabled={sending}
        >
          <Ionicons name="send" size={18} color={colors.textOnAccent} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// ── Create ticket modal ────────────────────────────────────────────────────────
function CreateTicketModal({
  visible,
  onClose,
  onSubmit,
  submitting,
}: {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: { category: string; subject: string; description: string; priority: TicketPriority }) => void;
  submitting: boolean;
}) {
  const { colors } = useTheme();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('medium');

  const canSubmit = subject.trim().length > 0 && description.trim().length > 0 && !submitting;

  const reset = () => {
    setCategory(CATEGORIES[0]);
    setSubject('');
    setDescription('');
    setPriority('medium');
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ category, subject: subject.trim(), description: description.trim(), priority });
  };

  const PRIORITIES: { key: TicketPriority; label: string; color: string }[] = [
    { key: 'low', label: 'Low', color: colors.accentGreen },
    { key: 'medium', label: 'Medium', color: colors.accentYellow },
    { key: 'high', label: 'High', color: colors.accentRed },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.modalOverlay, { backgroundColor: colors.overlayBg }]}>
        <KeyboardAvoidingView
          style={{ width: '100%' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[styles.modalCard, { backgroundColor: colors.background, borderColor: colors.cardBorder }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>New Support Ticket</Text>
              <TouchableOpacity onPress={() => { reset(); onClose(); }} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color={colors.iconColor} />
              </TouchableOpacity>
            </View>

            {/* Category */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Category</Text>
            <View style={styles.chipsWrap}>
              {CATEGORIES.map(c => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: category === c ? colors.accentOrange : colors.actionBtnBg,
                      borderColor: category === c ? colors.accentOrange : colors.actionBtnBorder,
                    },
                  ]}
                >
                  <Text style={{ color: category === c ? colors.textOnAccent : colors.textSecondary, fontSize: 12, fontWeight: '600' }}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Priority toggle */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Priority</Text>
            <View style={[styles.priorityToggle, { borderColor: colors.cardBorder }]}>
              {PRIORITIES.map(p => (
                <TouchableOpacity
                  key={p.key}
                  onPress={() => setPriority(p.key)}
                  style={[
                    styles.priorityToggleBtn,
                    priority === p.key && { backgroundColor: p.color },
                  ]}
                >
                  <Text style={{ color: priority === p.key ? '#fff' : colors.textSecondary, fontWeight: '600', fontSize: 13 }}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Subject */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Subject</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
              placeholder="Brief summary of the issue"
              placeholderTextColor={colors.textMuted}
              value={subject}
              onChangeText={setSubject}
              maxLength={100}
            />

            {/* Description */}
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea, { backgroundColor: colors.inputBg, color: colors.textPrimary }]}
              placeholder="Describe what's happening in detail"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              maxLength={1000}
            />

            <TouchableOpacity
              style={[styles.submitBtn, { backgroundColor: colors.accentOrange, opacity: canSubmit ? 1 : 0.5 }]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitBtnText}>Submit Ticket</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

// ── Main screen ─────────────────────────────────────────────────────────────────
const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  const { colors } = useTheme();
  const { tickets, loading, refreshing, error, creating, refresh, createTicket } = useDriverTickets();

  const [view, setView] = useState<'inbox' | 'chat'>('inbox');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [createVisible, setCreateVisible] = useState(false);

  const fabScale = useRef(new Animated.Value(1)).current;
  const onFabIn  = () => Animated.spring(fabScale, { toValue: 0.9, useNativeDriver: true, speed: 50, bounciness: 4 }).start();
  const onFabOut = () => Animated.spring(fabScale, { toValue: 1, useNativeDriver: true, speed: 20, bounciness: 6 }).start();

  const handleCreate = async (payload: { category: string; subject: string; description: string; priority: TicketPriority }) => {
    try {
      await createTicket({ ...payload, attachments: [] });
      setCreateVisible(false);
    } catch (err: any) {
      console.warn('[HelpScreen] create ticket failed:', err.message);
      // Keep the modal open so the user can retry rather than losing their draft
    }
  };

  if (view === 'chat' && selectedTicket) {
    return (
      <ScreenWrapper style={{ flex: 1, backgroundColor: colors.background }}>
        <TicketChatView
          ticket={selectedTicket}
          onBack={() => { setView('inbox'); setSelectedTicket(null); }}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper style={{ flex: 1, backgroundColor: colors.background }}>
      <PageHeader title="Help & Support" onBack={onBack} />

      {loading && tickets.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator color={colors.accentOrange} />
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={t => t.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accentOrange} />}
          ListEmptyComponent={
            !loading ? (
              <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={40} color={colors.textMuted} />
                <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
                  No support tickets yet. Tap + to open one.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TicketRow
              ticket={item}
              onPress={() => { setSelectedTicket(item); setView('chat'); }}
            />
          )}
        />
      )}

      {!!error && tickets.length === 0 && (
        <Text style={{ color: colors.accentRed, textAlign: 'center', marginTop: 8 }}>{error}</Text>
      )}

      <Animated.View style={[styles.fabWrap, { transform: [{ scale: fabScale }] }]}>
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: colors.accentOrange }]}
          onPressIn={onFabIn}
          onPressOut={onFabOut}
          onPress={() => setCreateVisible(true)}
          activeOpacity={1}
        >
          <Ionicons name="add" size={28} color={colors.textOnAccent} />
        </TouchableOpacity>
      </Animated.View>

      <CreateTicketModal
        visible={createVisible}
        onClose={() => setCreateVisible(false)}
        onSubmit={handleCreate}
        submitting={creating}
      />
    </ScreenWrapper>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  listContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100, gap: 10 },
  ticketRow: { borderWidth: 1, borderRadius: 14, padding: 14, gap: 6 },
  ticketRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ticketSubject: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  ticketCategory: { fontSize: 13 },
  ticketRowBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  ticketDate: { fontSize: 11 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyStateText: { fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },

  fabWrap: { position: 'absolute', bottom: 24, right: 20 },
  fab: {
    width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 6,
  },

  // Chat sub-view
  chatTopBar: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  iconBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  chatTopBarTitle: { fontSize: 15, fontWeight: '600' },
  chatTopBarSub: { fontSize: 11, marginTop: 1 },
  priorityChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  priorityChipText: { fontSize: 10, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },
  chatContent: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },
  msgRow: { maxWidth: '82%', gap: 4 },
  msgRowDriver: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  msgRowAdmin: { alignSelf: 'flex-start', alignItems: 'flex-start' },
  bubble: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 16 },
  timeLabel: { fontSize: 10, marginTop: 2 },
  footer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1 },
  inputWrap: { flex: 1, borderRadius: 22, paddingHorizontal: 14, paddingVertical: 10, maxHeight: 110 },
  chatInput: { fontSize: 14, lineHeight: 19, maxHeight: 90 },
  sendBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },

  // Create modal
  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 20, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  fieldLabel: { fontSize: 12, fontWeight: '600', marginBottom: 8, marginTop: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, borderWidth: 1 },
  priorityToggle: { flexDirection: 'row', borderWidth: 1, borderRadius: 12, overflow: 'hidden' },
  priorityToggleBtn: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  textInput: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  submitBtn: { marginTop: 20, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});