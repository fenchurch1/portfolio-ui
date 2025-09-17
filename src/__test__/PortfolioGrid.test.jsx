import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PortfolioGrid from '../components/PortfolioGrid';
import '@testing-library/jest-dom';
import * as Mantine from '@mantine/core'; // to access and mock hook correctly
import { MantineProvider } from '@mantine/core';

// ✅ Proper mocking of useComputedColorScheme
vi.mock('@mantine/core', async () => {
  const actual = await vi.importActual('@mantine/core');
  return {
    ...actual,
    useComputedColorScheme: vi.fn(() => ({ colorScheme: 'light' })),
  };
});

describe('PortfolioGrid', () => {
  const mockRowData = [
    { fileName: 'file1.csv', portfolioName: 'Portfolio 1', uploadedAt: '2024-06-01' },
    { fileName: 'file2.csv', portfolioName: 'Portfolio 2', uploadedAt: '2024-06-02' },
  ];

  const mockColumnDefs = [
    { headerName: 'File Name', field: 'fileName' },
    { headerName: 'Portfolio Name', field: 'portfolioName' },
    { headerName: 'Date/Time Uploaded', field: 'uploadedAt' },
  ];

  beforeEach(() => {
    vi.clearAllMocks(); // clear mocks between tests
  });

  it('renders AG Grid with default light theme class', () => {
    render(
      <MantineProvider>
        <PortfolioGrid rowData={mockRowData} columnDefs={mockColumnDefs} />
      </MantineProvider>
    );

    const gridContainer = document.querySelector('.ag-theme-alpine');
    expect(gridContainer).toBeInTheDocument();
  });



  it('renders with default columns when none are passed', () => {
    render(
      <MantineProvider>
        <PortfolioGrid rowData={mockRowData} />
      </MantineProvider>
    );

    const grid = document.querySelector('.ag-theme-alpine');
    expect(grid).toBeInTheDocument();
  });
});
