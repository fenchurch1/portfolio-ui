import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MantineProvider } from '@mantine/core';
import HeaderBar from '../components/HeaderBar';
import '@testing-library/jest-dom';
import { useMantineColorScheme, useComputedColorScheme } from '@mantine/core';

// Mock Mantine hooks
vi.mock('@mantine/core', async () => {
  const actual = await vi.importActual('@mantine/core');
  return {
    ...actual,
    useMantineColorScheme: vi.fn(),
    useComputedColorScheme: vi.fn(),
  };
});

describe('HeaderBar', () => {
  const mockSetColorScheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useMantineColorScheme.mockReturnValue({ setColorScheme: mockSetColorScheme });
  });

  it('renders logo, title and avatar', () => {
    useComputedColorScheme.mockReturnValue('light');
    render(<MantineProvider><HeaderBar /></MantineProvider>);
    expect(screen.getByText('Portfolios')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
    expect(screen.getByText('MK')).toBeInTheDocument();
  });

  it('renders moon icon for light theme', () => {
    useComputedColorScheme.mockReturnValue('light');
    render(<MantineProvider><HeaderBar /></MantineProvider>);
    expect(screen.getByTitle('Toggle color scheme')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('toggles theme to dark when in light mode', () => {
    useComputedColorScheme.mockReturnValue('light');
    render(<MantineProvider><HeaderBar /></MantineProvider>);
    fireEvent.click(screen.getByTitle('Toggle color scheme'));
    expect(mockSetColorScheme).toHaveBeenCalledWith('dark');
  });

  it('toggles theme to light when in dark mode', () => {
    useComputedColorScheme.mockReturnValue('dark');
    render(<MantineProvider><HeaderBar /></MantineProvider>);
    fireEvent.click(screen.getByTitle('Toggle color scheme'));
    expect(mockSetColorScheme).toHaveBeenCalledWith('light');
  });
});
