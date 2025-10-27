import React from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import App from './App';
import contentReducer from './store/slices/contentSlice';

// Mock the useContent hook
jest.mock('./hooks/useContent', () => ({
  useContent: () => ({
    filteredItems: [],
    loading: false,
    error: null,
    searchTerm: '',
    filters: { paid: false, free: false, viewOnly: false },
    isOnline: true,
    handleSearch: jest.fn(),
    handleFilterChange: jest.fn(),
    handleReset: jest.fn(),
    handleItemClick: jest.fn(),
    handleRetry: jest.fn(),
  }),
}));

// Create a test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      content: contentReducer,
    },
    preloadedState: {
      content: {
        items: [],
        filteredItems: [],
        loading: false,
        error: null,
        searchTerm: '',
        filters: { paid: false, free: false, viewOnly: false },
        hasFetched: false,
        ...initialState,
      },
    },
  });
};

const renderWithProvider = (
  component: React.ReactElement,
  { initialState = {}, store = createTestStore(initialState) } = {}
) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe('App', () => {
  test('renders all main components', () => {
    renderWithProvider(<App />);

    // Check if main components are rendered
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders header component', () => {
    renderWithProvider(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('renders search bar', () => {
    renderWithProvider(<App />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders filter section', () => {
    renderWithProvider(<App />);

    expect(screen.getByText('Pricing Option')).toBeInTheDocument();
  });

  test('renders contents list', () => {
    renderWithProvider(<App />);

    // Check for the empty state message which is always rendered
    expect(screen.getByText(/No content found/i)).toBeInTheDocument();
  });

  test('has proper app structure', () => {
    renderWithProvider(<App />);

    const appDiv = screen.getByRole('main').parentElement;
    expect(appDiv).toHaveClass('app');
  });
});
