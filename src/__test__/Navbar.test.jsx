import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NavBar from '../components/NavBar';
import { MantineProvider } from '@mantine/core';
import '@testing-library/jest-dom';

describe('NavBar', () => {
  const mockOnSelect = vi.fn();

  it('renders both tabs', () => {
    render(
      <MantineProvider>
        <NavBar onSelect={mockOnSelect} activeTab="upload" />
      </MantineProvider>
    );

    expect(screen.getByText('Upload')).toBeInTheDocument();
    expect(screen.getByText('List')).toBeInTheDocument();
  });

  it('marks Upload tab as active when activeTab is "upload"', () => {
    render(<MantineProvider>
      <NavBar onSelect={mockOnSelect} activeTab="upload" />
    </MantineProvider>);

    const uploadButton = screen.getByText(/upload/i);
    const listButton = screen.getByText(/list/i);

    const uploadLink = uploadButton.closest('a');
    const listLink = listButton.closest('a');

    expect(uploadLink.className).toContain('activeLink');
    expect(listLink.className).not.toContain('activeLink');
  });

  it('calls onSelect with correct tab when clicked', () => {
    render(<MantineProvider>
      <NavBar onSelect={mockOnSelect} activeTab="upload" />
    </MantineProvider>);

    fireEvent.click(screen.getByText('List'));
    expect(mockOnSelect).toHaveBeenCalledWith('list');

    fireEvent.click(screen.getByText('Upload'));
    expect(mockOnSelect).toHaveBeenCalledWith('upload');
  });
});
