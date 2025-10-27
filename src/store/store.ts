import { configureStore } from '@reduxjs/toolkit';

import contentReducer from './slices/contentSlice';

export const store = configureStore({
  reducer: {
    content: contentReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'content/fetchContentData/pending',
          'content/fetchContentData/fulfilled',
          'content/fetchContentData/rejected',
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
