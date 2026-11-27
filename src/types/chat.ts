export type Role = 'user' | 'assistant';
export type MessageStatus = 'sent' | 'failed';

export interface ChatMessage {
  id: string;
  role: Role;
  text: string;
  createdAt: number;
  status: MessageStatus;
}

export type SubjectId = 'maths' | 'physics' | 'chemistry' | 'programming' | 'general';

export interface Subject {
  id: SubjectId;
  label: string;
  styleHint: string;
}

export const SUBJECTS: Subject[] = [
  { id: 'maths', label: 'Maths', styleHint: 'Explain step by step with worked examples.' },
  { id: 'physics', label: 'Physics', styleHint: 'Use formulas, units and real-life intuition.' },
  { id: 'chemistry', label: 'Chemistry', styleHint: 'Mention reactions and balanced equations where relevant.' },
  { id: 'programming', label: 'Programming', styleHint: 'Give short, runnable code snippets.' },
  { id: 'general', label: 'General', styleHint: 'Answer clearly and concisely.' },
];

export const systemPrompt = (s: Subject): string =>
  `You are a friendly ${s.label} tutor for students. ${s.styleHint} ` +
  'If the question is ambiguous, ask one clarifying question. Keep answers under 250 words.';
