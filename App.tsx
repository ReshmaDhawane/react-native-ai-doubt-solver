import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ChatScreen } from './src/screens/ChatScreen';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ChatScreen />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}
