import * as Clipboard from 'expo-clipboard';
import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, View, useColorScheme } from 'react-native';
import { ChatMessage } from '../types/chat';

interface Props {
  message: ChatMessage;
  onRetry: (id: string) => void;
}

function MessageBubbleBase({ message, onRetry }: Props) {
  const dark = useColorScheme() === 'dark';
  const isUser = message.role === 'user';
  const failed = message.status === 'failed';

  const bg = failed ? '#fde2e1' : isUser ? '#3f51b5' : dark ? '#2b2b33' : '#eceff1';
  const fg = isUser && !failed ? '#fff' : dark && !failed ? '#eee' : '#111';

  return (
    <Pressable
      onLongPress={() => Clipboard.setStringAsync(message.text)}
      style={[styles.bubble, { backgroundColor: bg, alignSelf: isUser ? 'flex-end' : 'flex-start' }]}
      accessibilityRole="text"
      accessibilityLabel={`${isUser ? 'You' : 'Tutor'}: ${message.text}`}
    >
      <Text selectable style={{ color: fg, fontSize: 15, lineHeight: 21 }}>
        {message.text}
      </Text>
      {failed && (
        <View style={styles.retryRow}>
          <Text onPress={() => onRetry(message.id)} style={styles.retry}>
            Failed - tap to retry
          </Text>
        </View>
      )}
    </Pressable>
  );
}

export const MessageBubble = memo(MessageBubbleBase);

const styles = StyleSheet.create({
  bubble: { maxWidth: '80%', marginVertical: 4, marginHorizontal: 12, padding: 12, borderRadius: 16 },
  retryRow: { marginTop: 6 },
  retry: { color: '#b3261e', fontWeight: '600' },
});
