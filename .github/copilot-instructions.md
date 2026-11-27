# Copilot instructions

This repo is the AI Doubt Solver app: a subject-based AI tutor chat.

- Keep the layering: UI -> state holder -> repository/service interface -> network + local storage.
- The AI provider is always behind an interface; never call the HTTP API directly from UI code.
- Never hard-code or log API keys. Config comes from build-time flags or git-ignored files.
- Every new piece of chat logic needs a unit test using a fake/mock AI service.
- Keep user-facing error messages short and friendly; map HTTP 401/429/5xx explicitly.
- Prefer small, pure functions and immutable state updates.
