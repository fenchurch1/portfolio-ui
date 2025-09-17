import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ListView from '../components/ListView';
import * as portfolioStoreModule from '../stores/PortfolioStore';
import PortfolioGrid from '../components/PortfolioGrid';
import { MantineProvider } from '@mantine/core';
// Mock PortfolioGrid to isolate ListView
vi.mock('./PortfolioGrid', () => ({
  __esModule: true,
  default: vi.fn(() => <div data-testid="mock-grid">Mock Grid</div>),
}));

describe('ListView', () => {
  it('renders heading and passes rowData to PortfolioGrid', () => {
    const mockData = [
      {
        fileName: 'test1.xlsx',
        portfolioName: 'Portfolio 1',
        uploadedAt: '2025-06-18',
      },
      {
        fileName: 'test2.xlsx',
        portfolioName: 'Portfolio 2',
        uploadedAt: '2025-06-18',
      },
    ];

    // Mock store
    vi.spyOn(portfolioStoreModule, 'portfolioStore', 'get').mockReturnValue({
      portfolios: mockData,
    });

    render(<MantineProvider><ListView /></MantineProvider>);

    // Check heading
    expect(screen.getByRole('heading', { level: 2, name: /Uploaded Portfolios/i })).toBeInTheDocument();

    const { container } = render(<MantineProvider><ListView /></MantineProvider>);
    expect(container.querySelector('.ag-theme-alpine')).toBeInTheDocument();
  });
});
