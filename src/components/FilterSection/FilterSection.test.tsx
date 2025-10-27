import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FilterSection from './FilterSection';

// Mock the translate function
jest.mock('../../locales', () => ({
  translate: (key: string) => key,
}));

describe('FilterSection', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnReset = jest.fn();

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
        initialFilters={{ paid: true, free: false, viewOnly: false }}
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
      paid: true,
      free: false,
      viewOnly: false,
    });
  });

  test('toggles filter state when clicked', async () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ paid: true, free: false, viewOnly: false }}
      />
    );

    const paidCheckbox = screen.getByLabelText('common.paid');
    expect(paidCheckbox).toBeChecked();

    await userEvent.click(paidCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      paid: false,
      free: false,
      viewOnly: false,
    });
  });

  test('multiple filters can be active simultaneously', async () => {
    const user = userEvent.setup();

    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ paid: false, free: false, viewOnly: false }}
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
        paid: true,
        free: false,
        viewOnly: false,
      });
    });

    // Click free - this should keep paid as true
    await user.click(freeCheckbox);

    // Check that onFilterChange was called twice
    expect(mockOnFilterChange).toHaveBeenCalledTimes(2);

    // First call: paid was clicked (paid: true, free: false)
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, {
      paid: true,
      free: false,
      viewOnly: false,
    });

    // Second call: free was clicked while paid was active (paid: true, free: true)
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, {
      paid: true,
      free: true,
      viewOnly: false,
    });
  });

  test('calls onReset when reset button is clicked', async () => {
    render(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ paid: true, free: true, viewOnly: true }}
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
        initialFilters={{ paid: true, free: true, viewOnly: true }}
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
        initialFilters={{ paid: false, free: false, viewOnly: false }}
      />
    );

    expect(screen.getByLabelText('common.paid')).not.toBeChecked();

    rerender(
      <FilterSection
        onFilterChange={mockOnFilterChange}
        onReset={mockOnReset}
        initialFilters={{ paid: true, free: false, viewOnly: false }}
      />
    );

    expect(screen.getByLabelText('common.paid')).toBeChecked();
  });
});
