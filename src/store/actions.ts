import { createId } from '../utils/id';
import { askAi, retryRequested, userMessageAdded } from './chatSlice';
import type { AppDispatch, RootState } from './index';

export const sendQuestion =
  (raw: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const text = raw.trim();
    if (!text || getState().chat.isThinking) return;
    const id = createId();
    dispatch(userMessageAdded({ id, role: 'user', text, createdAt: Date.now(), status: 'sent' }));
    return dispatch(askAi(id));
  };

export const retryQuestion =
  (id: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    if (getState().chat.isThinking) return;
    dispatch(retryRequested(id));
    return dispatch(askAi(id));
  };
