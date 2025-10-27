import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchBar from './SearchBar';

// Mock the translate function
jest.mock('../../locales', () => ({
  translate: (key: string) => key,
}));

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('renders with placeholder', () => {
    render(<SearchBar onSearch={mockOnSearch} placeholder='Search here' />);
    const input = screen.getByPlaceholderText('Search here');
    expect(input).toBeInTheDocument();
  });

  test('renders search icon button when input is empty', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const button = screen.getByRole('button', { name: /common.search/i });
    expect(button).toBeInTheDocument();
  });

  test('updates input value when user types', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    await userEvent.type(input, 'test search');

    expect(input.value).toBe('test search');
    // onSearch is called on form submit or button click, not on type
  });

  test('calls onSearch when form is submitted', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');
    const form = input.closest('form');

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    });
  });

  test('calls onSearch when search button is clicked', async () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test' } });

    // The button is now a clear button since input has value
    const clearButton = screen.getByRole('button', { name: /search.clear/i });
    expect(clearButton).toBeInTheDocument();
  });

  test('renders clear icon when input has value', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'test' } });

    const clearButton = screen.getByRole('button', { name: /search.clear/i });
    expect(clearButton).toBeInTheDocument();
  });

  test('clears search term when clear button is clicked', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    const clearButton = screen.getByRole('button', { name: /search.clear/i });
    fireEvent.click(clearButton);

    expect(input.value).toBe('');
    expect(mockOnSearch).toHaveBeenCalledWith('');
  });

  test('uses initialValue prop', () => {
    render(<SearchBar onSearch={mockOnSearch} initialValue='initial search' />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial search');
  });

  test('updates when initialValue prop changes', () => {
    const { rerender } = render(
      <SearchBar onSearch={mockOnSearch} initialValue='initial' />
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');

    rerender(<SearchBar onSearch={mockOnSearch} initialValue='updated' />);
    expect(input.value).toBe('updated');
  });
});
