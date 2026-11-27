// Values come from .env (EXPO_PUBLIC_* are inlined at build time). Never hard-code keys.
export const AI_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_AI_API_KEY ?? '',
  model: process.env.EXPO_PUBLIC_AI_MODEL ?? 'gpt-4o-mini',
  baseUrl: process.env.EXPO_PUBLIC_AI_BASE_URL ?? 'https://api.openai.com/v1',
};

export const hasApiKey = (): boolean => AI_CONFIG.apiKey.length > 0;
