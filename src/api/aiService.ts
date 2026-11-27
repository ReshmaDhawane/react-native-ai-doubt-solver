import { AI_CONFIG, hasApiKey } from './config';
import { ChatMessage, Subject, systemPrompt } from '../types/chat';

export class AiServiceError extends Error {}

export interface AiService {
  ask(subject: Subject, history: ChatMessage[]): Promise<string>;
}

const MAX_CONTEXT = 12;

/** Works with any OpenAI-compatible Chat Completions endpoint. */
export const openAiCompatibleService: AiService = {
  async ask(subject, history) {
    const recent = history.slice(-MAX_CONTEXT);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30_000);

    let res: Response;
    try {
      res = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${AI_CONFIG.apiKey}`,
        },
        body: JSON.stringify({
          model: AI_CONFIG.model,
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt(subject) },
            ...recent.map((m) => ({ role: m.role, content: m.text })),
          ],
        }),
      });
    } catch {
      throw new AiServiceError('Network error. Check your connection.');
    } finally {
      clearTimeout(timer);
    }

    if (res.status === 401) throw new AiServiceError('Invalid API key.');
    if (res.status === 429) throw new AiServiceError('Rate limited. Please try again shortly.');
    if (!res.ok) throw new AiServiceError(`Server error (${res.status}).`);

    const json = (await res.json()) as { choices: { message: { content: string } }[] };
    return json.choices[0].message.content.trim();
  },
};

/** Offline tutor used when no API key is configured. */
export const mockAiService: AiService = {
  async ask(subject, history) {
    await new Promise((r) => setTimeout(r, 700));
    const question = [...history].reverse().find((m) => m.role === 'user')?.text ?? '';
    return (
      `(${subject.label} demo tutor) Great question: "${question}".\n\n` +
      '1. Identify what is given and what is asked.\n' +
      '2. Recall the core concept or formula.\n' +
      '3. Apply it step by step and check units.\n\n' +
      'Add EXPO_PUBLIC_AI_API_KEY in .env for real answers.'
    );
  },
};

export const aiService: AiService = hasApiKey() ? openAiCompatibleService : mockAiService;
