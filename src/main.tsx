import { AppProviders } from '@core/providers/AppProviders';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

// Ensure root element exists
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Create root and render
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
); 