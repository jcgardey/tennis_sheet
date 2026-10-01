import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavigationBar } from './NavigationBar';

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
      expect(logo).toHaveAttribute('src', '/logo.png');
    });

    it('renders navigation items', () => {
      render(<NavigationBar />);

      const courtsLink = screen.getByText('Courts');
      expect(courtsLink).toBeInTheDocument();
      expect(courtsLink.closest('a')).toHaveAttribute('href', '/sheet');

      const coachesLink = screen.getByText('Coaches');
      expect(coachesLink).toBeInTheDocument();
      expect(coachesLink.closest('a')).toHaveAttribute('href', '/sheet');
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
