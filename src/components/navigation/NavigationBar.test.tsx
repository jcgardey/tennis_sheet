import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NavigationBar } from './NavigationBar';

// Mock Tanstack Router
vi.mock('@tanstack/react-router', () => ({
  Link: ({ to, children, className }: any) => (
    <a href={to} className={className} data-testid={`link-${to.slice(1)}`}>
      {children}
    </a>
  ),
}));

// Mock logo image
vi.mock('@/assets/tennis_sheet_full_logo_transparent.png', () => ({
  default: 'mocked-logo.png',
}));

describe('NavigationBar', () => {
  describe('Basic rendering', () => {
    it('renders the navigation bar', () => {
      render(<NavigationBar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders the logo image', () => {
      render(<NavigationBar />);

      const logo = screen.getByAltText('Tennis Sheet');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', 'mocked-logo.png');
    });

    it('renders navigation items', () => {
      render(<NavigationBar />);

      const courtsLink = screen.getByText('Courts');
      expect(courtsLink).toBeInTheDocument();

      const coachesLink = screen.getByText('Coaches');
      expect(coachesLink).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('logo has proper alt text', () => {
      render(<NavigationBar />);

      const logo = screen.getByAltText('Tennis Sheet');
      expect(logo).toBeInTheDocument();
    });
  });
});
