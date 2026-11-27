import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { hasApiKey } from '../api/config';
import { MessageBubble } from '../components/MessageBubble';
import { SubjectChips } from '../components/SubjectChips';
import { TypingIndicator } from '../components/TypingIndicator';
import { useAppDispatch, useAppSelector } from '../store';
import { retryQuestion, sendQuestion } from '../store/actions';
import { cleared, loadSubject } from '../store/chatSlice';
import { ChatMessage, SUBJECTS } from '../types/chat';

export function ChatScreen() {
  const dispatch = useAppDispatch();
  const { subject, messages, isThinking, error } = useAppSelector((s) => s.chat);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const dark = useColorScheme() === 'dark';

  useEffect(() => {
    dispatch(loadSubject('general'));
  }, [dispatch]);

  useEffect(() => {
    if (error) Alert.alert('Could not get an answer', error);
  }, [error]);

  const onSend = () => {
    dispatch(sendQuestion(input));
    setInput('');
  };

  const onRetry = useCallback((id: string) => dispatch(retryQuestion(id)), [dispatch]);
  const label = SUBJECTS.find((s) => s.id === subject)?.label;

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: dark ? '#121217' : '#fff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: dark ? '#fff' : '#111' }]}>AI Doubt Solver</Text>
        <Pressable onPress={() => dispatch(cleared())} accessibilityLabel="Clear chat">
          <Text style={styles.clear}>Clear</Text>
        </Pressable>
      </View>
      <SubjectChips selected={subject} onSelect={(id) => dispatch(loadSubject(id))} />
      {!hasApiKey() && <Text style={styles.banner}>Demo mode: no API key configured.</Text>}

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} onRetry={onRetry} />}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={<Text style={styles.empty}>Ask your first {label} doubt</Text>}
          ListFooterComponent={isThinking ? <TypingIndicator /> : null}
          contentContainerStyle={styles.listContent}
        />
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type your doubt..."
            placeholderTextColor="#888"
            multiline
            style={[styles.input, { color: dark ? '#fff' : '#111' }]}
          />
          <Pressable
            onPress={onSend}
            disabled={isThinking || !input.trim()}
            style={[styles.send, (isThinking || !input.trim()) && styles.sendDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Send"
          >
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
  clear: { color: '#3f51b5', fontWeight: '600' },
  banner: { backgroundColor: '#fff4ce', color: '#5c4400', padding: 8, textAlign: 'center' },
  listContent: { paddingVertical: 8, flexGrow: 1 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888', fontSize: 16 },
  inputRow: { flexDirection: 'row', padding: 8, alignItems: 'flex-end' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, maxHeight: 120 },
  send: { marginLeft: 8, backgroundColor: '#3f51b5', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10 },
  sendDisabled: { opacity: 0.5 },
  sendText: { color: '#fff', fontWeight: '600' },
});
