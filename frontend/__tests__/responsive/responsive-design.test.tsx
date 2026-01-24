import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TasksPage } from '@/app/(dashboard)/tasks/page';

describe('Responsive Design', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // Deprecated
        removeListener: vi.fn(), // Deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly on mobile screen size', async () => {
    window.innerWidth = 375; // Mobile width
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query.includes('max-width') && parseInt(query.match(/\d+/)[0]) >= 375,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<TasksPage />);

    // Check that essential elements are present
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add task/i })).toBeInTheDocument();
  });

  it('renders correctly on desktop screen size', async () => {
    window.innerWidth = 1200; // Desktop width

    render(<TasksPage />);

    // Check that essential elements are present
    expect(screen.getByText('My Tasks')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /add task/i })).toBeInTheDocument();
  });
});