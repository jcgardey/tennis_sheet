import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NextIntlClientProvider } from 'next-intl';
import { messages } from '../../../i18n/messages';
import { NavigationBar } from './NavigationBar';
import { getLocaleSwitchUrl } from './LocaleSwitcher';

const renderNavigation = () =>
  render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <NavigationBar />
    </NextIntlClientProvider>,
  );

describe('NavigationBar', () => {
  describe('Basic rendering', () => {
    it('renders the navigation bar', () => {
      renderNavigation();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('renders the logo image', () => {
      renderNavigation();

      const logo = screen.getByAltText('Tennis Sheet');
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/logo.png');
    });

    it('renders navigation items', () => {
      renderNavigation();

      const courtsLink = screen.getByText('Courts');
      expect(courtsLink).toBeInTheDocument();
      expect(courtsLink.closest('a')).toHaveAttribute('href', '/en/sheet');

      const coachesLink = screen.getByText('Coaches');
      expect(coachesLink).toBeInTheDocument();
      expect(coachesLink.closest('a')).toHaveAttribute('href', '/en/sheet');

      expect(
        screen.getByRole('link', { name: 'Switch language: Español' }),
      ).toHaveAttribute('href', '/es');
    });
  });

  describe('Accessibility', () => {
    it('logo has proper alt text', () => {
      renderNavigation();

      const logo = screen.getByAltText('Tennis Sheet');
      expect(logo).toBeInTheDocument();
    });
  });
});

describe('getLocaleSwitchUrl', () => {
  it('preserves the current route, query, and hash when changing locale', () => {
    expect(
      getLocaleSwitchUrl(
        { pathname: '/es/sheet', search: '?date=2025-06-01', hash: '#court-2' },
        'en',
      ),
    ).toBe('/en/sheet?date=2025-06-01#court-2');
  });
});
