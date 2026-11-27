jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

import { AiService, AiServiceError } from '../src/api/aiService';
import { makeStore } from '../src/store';
import { retryQuestion, sendQuestion } from '../src/store/actions';

const fakeAi = (impl: AiService['ask']): AiService => ({ ask: jest.fn(impl) });

describe('chat flow', () => {
  it('adds the question and the answer', async () => {
    const store = makeStore(fakeAi(async () => '4'));
    await store.dispatch(sendQuestion('2 + 2?'));
    const { messages, isThinking } = store.getState().chat;
    expect(messages.map((m) => m.text)).toEqual(['2 + 2?', '4']);
    expect(isThinking).toBe(false);
  });

  it('marks failed questions and recovers on retry', async () => {
    let fail = true;
    const store = makeStore(
      fakeAi(async () => {
        if (fail) throw new AiServiceError('Network error');
        return 'Resistance to change in motion.';
      }),
    );
    await store.dispatch(sendQuestion('What is inertia?'));
    const q = store.getState().chat.messages[0];
    expect(q.status).toBe('failed');
    expect(store.getState().chat.error).toBe('Network error');

    fail = false;
    await store.dispatch(retryQuestion(q.id));
    const { messages } = store.getState().chat;
    expect(messages).toHaveLength(2);
    expect(messages[0].status).toBe('sent');
  });

  it('ignores blank input', async () => {
    const ai = fakeAi(async () => 'x');
    const store = makeStore(ai);
    await store.dispatch(sendQuestion('   '));
    expect(store.getState().chat.messages).toHaveLength(0);
    expect(ai.ask).not.toHaveBeenCalled();
  });
});
