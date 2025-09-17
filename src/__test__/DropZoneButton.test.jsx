import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import DropZoneButton from '../components/DropZoneButton';

describe('DropZoneButton', () => {
  it('renders upload prompt', () => {
    render(
      <MantineProvider>
        <DropZoneButton setFile={() => {}} />
      </MantineProvider>
    );

    expect(screen.getByText(/Upload Excel or CSV file/i)).toBeInTheDocument();
  });

  it('opens file dialog when button clicked', () => {
    const setFile = vi.fn();
    render(
      <MantineProvider>
        <DropZoneButton setFile={setFile} />
      </MantineProvider>
    );

    const button = screen.getByRole('button', { name: /select files/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // You can't simulate file picker in JSDOM, but click should not throw
  });
});
