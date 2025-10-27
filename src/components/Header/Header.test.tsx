import { render, screen } from '@testing-library/react';

import Header from './Header';

// Mock the translate function
jest.mock('../../locales', () => ({
  translate: (key: string) => key,
}));

describe('Header', () => {
  test('renders header element', () => {
    render(<Header />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  test('displays app title', () => {
    render(<Header />);
    expect(screen.getByText('app.title')).toBeInTheDocument();
  });

  test('has correct className', () => {
    render(<Header />);
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass('header');
  });

  test('has logo section with heading', () => {
    render(<Header />);
    const logoDiv = screen.getByText('app.title').parentElement;
    expect(logoDiv).toBeInTheDocument();
    expect(logoDiv).toHaveClass('header__logo');
  });
});
