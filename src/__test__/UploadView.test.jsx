import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UploadView from '../components/UploadView';
import { portfolioStore } from '../stores/PortfolioStore';
import '@testing-library/jest-dom';
import { MantineProvider } from '@mantine/core';
// Mock portfolioStore
vi.mock('../stores/PortfolioStore', () => ({
  portfolioStore: {
    addPortfolio: vi.fn(),
  },
}));

// Mock xlsx read and utils
vi.mock('xlsx', () => ({
  read: vi.fn(() => ({
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: {
        A1: { v: 'pool_id' },
        A2: { v: '123' },
      },
    },
  })),
  utils: {
    sheet_to_json: vi.fn(() => [{ pool_id: '123', face_amt: '1000' }]),
  },
}));

describe('UploadView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input, button, and dropzone', () => {
    render(
      <MantineProvider>
        <UploadView />
      </MantineProvider>
    );

    expect(screen.getByLabelText(/Portfolio Name/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled();

  });

  it('enables Upload button when portfolio name and file are set', async () => {
    render(
      <MantineProvider>
        <UploadView />
      </MantineProvider>
    );

    const input = screen.getByLabelText(/Portfolio Name/i);
    fireEvent.change(input, { target: { value: 'Test Portfolio' } });


    const dropzone = screen.getByText(/Select files/i);
    const file = new File(['dummy content'], 'test.xlsx');
    fireEvent.click(dropzone);

    fireEvent.change(input, { target: { value: 'Updated Portfolio' } });

    expect(screen.getByRole('button', { name: /upload/i })).toBeDisabled();
  });
});
