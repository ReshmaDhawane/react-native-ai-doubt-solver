# AI Doubt Solver - React Native (TypeScript)

An AI tutor chat app where students pick a subject (Maths, Physics, Chemistry, Programming, General) and ask study doubts. Built with **React Native (TypeScript)** as part of a cross-platform portfolio: the same product implemented in Flutter, React Native, native Android and native iOS.

## Features

- Chat with an AI tutor per subject; each subject keeps its own history
- Subject-specific system prompts (step-by-step maths, formulas for physics, code for programming)
- Works with any **OpenAI-compatible** Chat Completions API (OpenAI, Azure OpenAI, Groq, local LLM servers)
- **Offline demo mode**: with no API key the app uses a mock tutor, so it runs out of the box
- Chat history persisted locally and restored on app launch
- Failed questions are marked and can be retried without duplicating them
- Friendly error handling (network, invalid key, rate limit, server errors) with a 30 s timeout
- Only the last 12 messages are sent as context to control token cost
- Typing indicator, auto-scroll, long-press to copy, light/dark theme, accessibility labels
- Unit tests for the core chat logic

## Tech stack

- React Native 0.74 with **Expo SDK 51**, **TypeScript (strict)**
- State management: **Redux Toolkit** (slice, async thunks, listener middleware), react-redux typed hooks
- Persistence: AsyncStorage
- Networking: fetch with AbortController timeout
- Testing: Jest (jest-expo)

## Architecture

```
App.tsx            Provider + SafeAreaProvider
src/
  api/             config.ts, aiService.ts (OpenAI-compatible + mock), storage.ts
  store/           chatSlice.ts, actions.ts (send/retry thunks), index.ts (store + persistence listener)
  screens/         ChatScreen.tsx
  components/      MessageBubble.tsx, SubjectChips.tsx, TypingIndicator.tsx
  types/           chat.ts
__tests__/         chatSlice.test.ts
```

UI -> state holder (ViewModel / Cubit / Redux slice) -> repository / service abstraction -> HTTP API + local storage. The AI provider is behind an interface, so it is swapped for a mock in tests and in demo mode.

## Getting started

```bash
npm install
cp .env.example .env        # optional: add EXPO_PUBLIC_AI_API_KEY for real answers
npx expo start              # press a for Android, i for iOS
```

## Tests

```bash
npm run typecheck
npm test
```

## Security note

API keys are never committed. They are read at build time from a git-ignored file / build flag. For production, route requests through your own backend so the key never ships inside the app.

## Author

**Reshma Dhawane** - Senior Mobile Developer (Flutter, React Native, Android, iOS)

## License

MIT
