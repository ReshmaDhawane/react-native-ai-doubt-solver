import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AiService, AiServiceError } from '../api/aiService';
import { chatStorage } from '../api/storage';
import { ChatMessage, SUBJECTS, SubjectId } from '../types/chat';
import { createId } from '../utils/id';

export interface ChatState {
  subject: SubjectId;
  messages: ChatMessage[];
  isThinking: boolean;
  error: string | null;
}

export const initialState: ChatState = {
  subject: 'general',
  messages: [],
  isThinking: false,
  error: null,
};

export interface ThunkExtra {
  ai: AiService;
}

type ThunkCfg = { state: { chat: ChatState }; extra: ThunkExtra; rejectValue: { id: string; error: string } };

export const loadSubject = createAsyncThunk('chat/loadSubject', async (subject: SubjectId) => ({
  subject,
  messages: await chatStorage.load(subject),
}));

/** Asks the AI about the question with the given id (used for both send and retry). */
export const askAi = createAsyncThunk<ChatMessage, string, ThunkCfg>(
  'chat/askAi',
  async (questionId, { getState, extra, rejectWithValue }) => {
    const { subject, messages } = getState().chat;
    const subj = SUBJECTS.find((s) => s.id === subject)!;
    try {
      const text = await extra.ai.ask(subj, messages);
      return { id: createId(), role: 'assistant', text, createdAt: Date.now(), status: 'sent' };
    } catch (e) {
      const msg = e instanceof AiServiceError ? e.message : 'Something went wrong.';
      return rejectWithValue({ id: questionId, error: msg });
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    userMessageAdded(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
      state.error = null;
    },
    retryRequested(state, action: PayloadAction<string>) {
      const m = state.messages.find((x) => x.id === action.payload);
      if (m) m.status = 'sent';
      state.error = null;
    },
    cleared(state) {
      state.messages = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSubject.fulfilled, (state, { payload }) => {
        state.subject = payload.subject;
        state.messages = payload.messages;
        state.error = null;
      })
      .addCase(askAi.pending, (state) => {
        state.isThinking = true;
      })
      .addCase(askAi.fulfilled, (state, { payload }) => {
        state.isThinking = false;
        state.messages.push(payload);
      })
      .addCase(askAi.rejected, (state, { payload }) => {
        state.isThinking = false;
        if (payload) {
          const m = state.messages.find((x) => x.id === payload.id);
          if (m) m.status = 'failed';
          state.error = payload.error;
        }
      });
  },
});

export const { userMessageAdded, retryRequested, cleared } = chatSlice.actions;
export default chatSlice.reducer;
