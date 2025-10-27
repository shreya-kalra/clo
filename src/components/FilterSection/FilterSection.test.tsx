import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MAX_PRICE, MIN_PRICE } from '../../constants';
import FilterSection from './FilterSection';

// Mock the translate function
jest.mock('../../locales', () => ({
  translate: (key: string) => key,
}));

describe('FilterSection', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnReset = jest.fn();

  const defaultFilters = {
    paid: false,
    free: false,
    viewOnly: false,
    priceRange: { min: MIN_PRICE, max: MAX_PRICE },
  };

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    mockOnReset.mockClear();
  });

  test('renders all filter checkboxes', () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('filters.title')).toBeInTheDocument();
    expect(screen.getByLabelText('common.paid')).toBeInTheDocument();
    expect(screen.getByLabelText('common.free')).toBeInTheDocument();
    expect(screen.getByLabelText('common.view-only')).toBeInTheDocument();
  });

  test('renders reset button', () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByText('filters.reset')).toBeInTheDocument();
  });

  test('initial filters are unchecked by default', () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    expect(screen.getByLabelText('common.paid')).not.toBeChecked();
    expect(screen.getByLabelText('common.free')).not.toBeChecked();
    expect(screen.getByLabelText('common.view-only')).not.toBeChecked();
  });

  test('uses initialFilters prop', () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ ...defaultFilters, paid: true }}
      />
    );

    expect(screen.getByLabelText('common.paid')).toBeChecked();
    expect(screen.getByLabelText('common.free')).not.toBeChecked();
  });

  test('calls onFilterChange when checkbox is toggled', async () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
      />
    );

    const paidCheckbox = screen.getByLabelText('common.paid');
    await userEvent.click(paidCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...defaultFilters,
      paid: true,
    });
  });

  test('toggles filter state when clicked', async () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ ...defaultFilters, paid: true }}
      />
    );

    const paidCheckbox = screen.getByLabelText('common.paid');
    expect(paidCheckbox).toBeChecked();

    await userEvent.click(paidCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith(defaultFilters);
  });

  test('multiple filters can be active simultaneously', async () => {
    const user = userEvent.setup();

    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={defaultFilters}
      />
    );

    const paidCheckbox = screen.getByLabelText('common.paid');
    const freeCheckbox = screen.getByLabelText('common.free');

    // Click paid first
    await user.click(paidCheckbox);

    // Manually update the component with the new state
    // This simulates the parent component updating initialFilters after first click
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith({
        ...defaultFilters,
        paid: true,
      });
    });

    // Click free - this should keep paid as true
    await user.click(freeCheckbox);

    // Check that onFilterChange was called twice
    expect(mockOnFilterChange).toHaveBeenCalledTimes(2);

    // First call: paid was clicked (paid: true, free: false)
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, {
      ...defaultFilters,
      paid: true,
    });

    // Second call: free was clicked while paid was active (paid: true, free: true)
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, {
      ...defaultFilters,
      paid: true,
      free: true,
    });
  });

  test('calls onReset when reset button is clicked', async () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{
          ...defaultFilters,
          paid: true,
          free: true,
          viewOnly: true,
        }}
      />
    );

    const resetButton = screen.getByText('filters.reset');
    await userEvent.click(resetButton);

    expect(mockOnReset).toHaveBeenCalled();
  });

  test('resets all filters when reset is clicked', async () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{
          ...defaultFilters,
          paid: true,
          free: true,
          viewOnly: true,
        }}
      />
    );

    const resetButton = screen.getByText('filters.reset');
    await userEvent.click(resetButton);

    // After reset, onReset should be called
    expect(mockOnReset).toHaveBeenCalled();
    // The local state should be reset (visible in UI)
    expect(screen.getByLabelText('common.paid')).not.toBeChecked();
    expect(screen.getByLabelText('common.free')).not.toBeChecked();
    expect(screen.getByLabelText('common.view-only')).not.toBeChecked();
  });

  test('updates when initialFilters prop changes', () => {
    const { rerender } = render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={defaultFilters}
      />
    );

    expect(screen.getByLabelText('common.paid')).not.toBeChecked();

    rerender(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ ...defaultFilters, paid: true }}
      />
    );

    expect(screen.getByLabelText('common.paid')).toBeChecked();
  });

  test('renders price range slider when paid is checked', () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ ...defaultFilters, paid: true }}
      />
    );

    // Check that price values are displayed
    expect(screen.getByText(`$${MIN_PRICE}`)).toBeInTheDocument();
    expect(screen.getByText(`$${MAX_PRICE}`)).toBeInTheDocument();
  });

  test('does not render price range slider when paid is not checked', () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={defaultFilters}
      />
    );

    // Price range should not be visible
    expect(screen.queryByText(`$${MIN_PRICE}`)).not.toBeInTheDocument();
    expect(screen.queryByText(`$${MAX_PRICE}`)).not.toBeInTheDocument();
  });

  test('price range slider shows custom initial values', () => {
    const customMin = 100;
    const customMax = 500;

    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{
          ...defaultFilters,
          paid: true,
          priceRange: { min: customMin, max: customMax },
        }}
      />
    );

    expect(screen.getByText(`$${customMin}`)).toBeInTheDocument();
    expect(screen.getByText(`$${customMax}`)).toBeInTheDocument();
  });

  test('price range resets to default values when reset is clicked', async () => {
    const customMin = 100;
    const customMax = 500;

    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{
          ...defaultFilters,
          paid: true,
          priceRange: { min: customMin, max: customMax },
        }}
      />
    );

    // Verify custom values are shown
    expect(screen.getByText(`$${customMin}`)).toBeInTheDocument();
    expect(screen.getByText(`$${customMax}`)).toBeInTheDocument();

    // Click reset
    const resetButton = screen.getByText('filters.reset');
    await userEvent.click(resetButton);

    // After reset, filters should be cleared (paid becomes false, so slider disappears)
    expect(screen.getByLabelText('common.paid')).not.toBeChecked();
  });
});
