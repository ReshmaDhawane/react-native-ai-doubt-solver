import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { aiService, AiService } from '../api/aiService';
import { chatStorage } from '../api/storage';
import chatReducer, { askAi, cleared } from './chatSlice';

export const makeStore = (ai: AiService = aiService) => {
  // Persist history whenever an answer arrives or fails.
  const persistence = createListenerMiddleware();
  persistence.startListening({
    matcher: isAnyOf(askAi.fulfilled, askAi.rejected, cleared),
    effect: async (_action, api) => {
      const { subject, messages } = (api.getState() as RootState).chat;
      await chatStorage.save(subject, messages);
    },
  });

  return configureStore({
    reducer: { chat: chatReducer },
    middleware: (gDM) =>
      gDM({ thunk: { extraArgument: { ai } } }).prepend(persistence.middleware),
  });
};

export const store = makeStore();

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
