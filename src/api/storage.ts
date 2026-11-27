import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage, SubjectId } from '../types/chat';

const key = (s: SubjectId) => `chat_history_${s}`;

export const chatStorage = {
  async load(subject: SubjectId): Promise<ChatMessage[]> {
    const raw = await AsyncStorage.getItem(key(subject));
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  },
  save: (subject: SubjectId, messages: ChatMessage[]) =>
    AsyncStorage.setItem(key(subject), JSON.stringify(messages)),
  clear: (subject: SubjectId) => AsyncStorage.removeItem(key(subject)),
};
