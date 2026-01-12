import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TSAlert } from './TSAlert';

describe('CustomAlert', () => {
  describe('Basic rendering', () => {
    it('renders with success status by default', () => {
      render(<TSAlert message="Test message" />);

      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('Test message');
      expect(alert).toHaveClass(
        'bg-green-50',
        'text-green-900',
        'border-green-200'
      );
    });

    it('renders the provided message text', () => {
      const message = 'This is a test alert message';
      render(<TSAlert status="success" message={message} />);

      expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const customClass = 'custom-alert-class';
      render(<TSAlert message="Test" className={customClass} />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(customClass);
    });

    it('passes through additional props', () => {
      render(<TSAlert message="Test" data-testid="custom-alert" />);

      expect(screen.getByTestId('custom-alert')).toBeInTheDocument();
    });
  });

  describe('Status variants', () => {
    it('renders success variant with correct styles and icon', () => {
      render(<TSAlert status="success" message="Success message" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(
        'bg-green-50',
        'text-green-900',
        'border-green-200'
      );

      // Check for CheckCircle icon (lucide-react)
      const icon = alert.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-green-600');
    });

    it('renders error variant with correct styles and icon', () => {
      render(<TSAlert status="error" message="Error message" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass('bg-red-50', 'text-red-900', 'border-red-200');

      // Check for AlertCircle icon (lucide-react)
      const icon = alert.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-red-600');
    });

    it('renders warning variant with correct styles and icon', () => {
      render(<TSAlert status="warning" message="Warning message" />);

      const alert = screen.getByRole('alert');
      expect(alert).toHaveClass(
        'bg-yellow-50',
        'text-yellow-900',
        'border-yellow-200'
      );

      // Check for AlertTriangle icon (lucide-react)
      const icon = alert.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-yellow-600');
    });
  });

  describe('Icon rendering', () => {
    it('renders CheckCircle icon for success status', () => {
      const { container } = render(
        <TSAlert status="success" message="Success" />
      );

      // Lucide icons are SVG elements
      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveClass('size-4');
    });

    it('renders AlertCircle icon for error status', () => {
      const { container } = render(<TSAlert status="error" message="Error" />);

      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveClass('size-4');
    });

    it('renders AlertTriangle icon for warning status', () => {
      const { container } = render(
        <TSAlert status="warning" message="Warning" />
      );

      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toBeInTheDocument();
      expect(svgIcon).toHaveClass('size-4');
    });

    it('icon has correct size and color classes', () => {
      const { container } = render(<TSAlert status="success" message="Test" />);

      const svgIcon = container.querySelector('svg');
      expect(svgIcon).toHaveClass('size-4', 'text-green-600');
    });
  });
});
