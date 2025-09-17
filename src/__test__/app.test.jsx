import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import React from 'react';
import App from '../App';
import { MantineProvider } from '@mantine/core';

const renderWithMantine = (ui) => {
  return render(<MantineProvider>{ui}</MantineProvider>);
};

describe('App component with real components', () => {
  test('renders HeaderBar, NavBar, and UploadView by default', () => {
    renderWithMantine(<App />);

    // Replace with actual visible content from each component
    expect(screen.getByText(/portfolios/i)).toBeInTheDocument();
    expect(screen.getByText(/List/i)).toBeInTheDocument();
  });
});
