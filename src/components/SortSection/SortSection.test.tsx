import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SortOption } from '../../store/slices/contentSlice';
import SortSection from './SortSection';

// Mock the translate function
jest.mock('../../locales', () => ({
  translate: (key: string) => key,
}));

describe('SortSection', () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  test('renders sort label and dropdown', () => {
    render(<SortSection onSortChange={mockOnSortChange} />);

    expect(screen.getByText('sort.title')).toBeInTheDocument();
    expect(screen.getByLabelText('sort.title')).toBeInTheDocument();
  });

  test('renders all sort options', () => {
    render(<SortSection onSortChange={mockOnSortChange} />);

    const select = screen.getByLabelText('sort.title');
    expect(select).toBeInTheDocument();

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('sort.item-name');
    expect(options[1]).toHaveTextContent('sort.higher-price');
    expect(options[2]).toHaveTextContent('sort.lower-price');
  });

  test('defaults to Item Name sort', () => {
    render(<SortSection onSortChange={mockOnSortChange} />);

    const select = screen.getByLabelText('sort.title');
    expect(select).toHaveValue(SortOption.ITEM_NAME);
  });

  test('uses initialSort prop', () => {
    render(
      <SortSection
        onSortChange={mockOnSortChange}
        initialSort={SortOption.HIGHER_PRICE}
      />
    );

    const select = screen.getByLabelText('sort.title');
    expect(select).toHaveValue(SortOption.HIGHER_PRICE);
  });

  test('calls onSortChange when dropdown value changes', async () => {
    const user = userEvent.setup();
    render(<SortSection onSortChange={mockOnSortChange} />);

    const select = screen.getByLabelText('sort.title');

    // Change to Higher Price
    await user.selectOptions(select, SortOption.HIGHER_PRICE);

    expect(mockOnSortChange).toHaveBeenCalledWith(SortOption.HIGHER_PRICE);

    // Change to Lower Price
    await user.selectOptions(select, SortOption.LOWER_PRICE);

    expect(mockOnSortChange).toHaveBeenCalledWith(SortOption.LOWER_PRICE);
    expect(mockOnSortChange).toHaveBeenCalledTimes(2);
  });

  test('can select all three sort options', async () => {
    const user = userEvent.setup();
    render(<SortSection onSortChange={mockOnSortChange} />);

    const select = screen.getByLabelText('sort.title');

    // Item Name
    await user.selectOptions(select, SortOption.ITEM_NAME);
    expect(mockOnSortChange).toHaveBeenNthCalledWith(1, SortOption.ITEM_NAME);

    // Higher Price
    await user.selectOptions(select, SortOption.HIGHER_PRICE);
    expect(mockOnSortChange).toHaveBeenNthCalledWith(
      2,
      SortOption.HIGHER_PRICE
    );

    // Lower Price
    await user.selectOptions(select, SortOption.LOWER_PRICE);
    expect(mockOnSortChange).toHaveBeenNthCalledWith(3, SortOption.LOWER_PRICE);

    expect(mockOnSortChange).toHaveBeenCalledTimes(3);
  });

  test('updates when initialSort prop changes', () => {
    const { rerender } = render(
      <SortSection
        onSortChange={mockOnSortChange}
        initialSort={SortOption.ITEM_NAME}
      />
    );

    const select = screen.getByLabelText('sort.title');
    expect(select).toHaveValue(SortOption.ITEM_NAME);

    rerender(
      <SortSection
        onSortChange={mockOnSortChange}
        initialSort={SortOption.LOWER_PRICE}
      />
    );

    expect(select).toHaveValue(SortOption.LOWER_PRICE);
  });

  test('dropdown has proper accessibility attributes', () => {
    render(<SortSection onSortChange={mockOnSortChange} />);

    const select = screen.getByLabelText('sort.title');
    expect(select).toHaveAttribute('id', 'sort-select');
    // Native select elements don't have explicit role attribute
    // They have implicit role of 'combobox' or 'listbox' depending on browser
  });
});
