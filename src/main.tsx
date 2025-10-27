/**
 * Application Entry Point
 *
 * This file is the entry point of the React application. It renders the App component
 * and provides Redux store to all child components via the Provider.
 *
 * @module main
 */
import React from 'react';

import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import App from './App';
import { store } from './store/store';

import './index.scss';

// Get the root DOM element where the app will be mounted
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create React root and render the application
// StrictMode is enabled for additional development checks
// Provider wraps the app to make Redux store available to all components
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
